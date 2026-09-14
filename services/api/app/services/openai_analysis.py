import json
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import ProxyHandler, Request, build_opener

from app.core.config import Settings
from app.core.errors import ApiError
from app.schemas.analysis import AnalysisRequest, AnalysisResult

OUTPUT_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "summary": {"type": "string"},
        "observations": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 1,
            "maxItems": 4,
        },
        "research_focus": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 1,
            "maxItems": 3,
        },
    },
    "required": ["summary", "observations", "research_focus"],
}

ANALYSIS_INSTRUCTIONS = (
    "You support an Ayurvedic research workflow. Analyze only the supplied observations. "
    "Do not diagnose diseases, prescribe treatment, recommend medication, "
    "or claim clinical certainty. Describe patterns as preliminary research "
    "observations and identify concise questions for qualified review. "
    "When verified document text or structured measurements are included, use only "
    "that information and do not invent, extrapolate, or treat missing values as findings."
)


def generate_research_analysis(payload: AnalysisRequest, settings: Settings) -> AnalysisResult:
    if (
        settings.ai_provider != "gemini"
        or not settings.gemini_api_key
        or not settings.gemini_api_key.get_secret_value()
    ):
        raise ApiError(503, "analysis_not_configured", "The analysis service is not configured.")

    request_body = {
        "systemInstruction": {"parts": [{"text": ANALYSIS_INSTRUCTIONS}]},
        "contents": [
            {
                "role": "user",
                "parts": [{"text": json.dumps(payload.model_dump(), ensure_ascii=False)}],
            }
        ],
        "generationConfig": {
            "temperature": 0,
            "responseMimeType": "application/json",
            "responseJsonSchema": OUTPUT_SCHEMA,
        },
    }
    api_key = settings.gemini_api_key.get_secret_value()
    request = Request(
        (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{settings.gemini_model}:generateContent?key={api_key}"
        ),
        data=json.dumps(request_body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    # Bypass any invalid loopback proxy configuration in local development.
    gemini_client = build_opener(ProxyHandler({}))
    try:
        with gemini_client.open(request, timeout=45) as response:
            provider_response = json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        if error.code == 429:
            raise ApiError(
                503,
                "analysis_provider_quota",
                "The free analysis limit has been reached. Please try again later.",
            ) from None
        if error.code in {400, 401, 403}:
            raise ApiError(
                503,
                "analysis_provider_authentication",
                "The Gemini connection needs a valid API key.",
            ) from None
        raise ApiError(
            502, "analysis_provider_unavailable", "The analysis service is temporarily unavailable."
        ) from None
    except (URLError, TimeoutError, OSError):
        raise ApiError(
            502, "analysis_provider_unavailable", "The analysis service is temporarily unavailable."
        ) from None

    output_text = _read_gemini_output_text(provider_response)
    if not output_text:
        raise ApiError(
            502,
            "analysis_provider_invalid_response",
            "The analysis service returned an invalid response.",
        )

    try:
        return AnalysisResult.model_validate_json(output_text)
    except ValueError:
        raise ApiError(
            502,
            "analysis_provider_invalid_response",
            "The analysis service returned an invalid response.",
        ) from None


def active_analysis_model(settings: Settings) -> str:
    return settings.gemini_model


def _read_gemini_output_text(response: dict[str, Any]) -> str | None:
    for candidate in response.get("candidates", []):
        content = candidate.get("content")
        if not isinstance(content, dict):
            continue
        for part in content.get("parts", []):
            text = part.get("text") if isinstance(part, dict) else None
            if isinstance(text, str) and text:
                return text
    return None
