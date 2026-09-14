from fastapi import APIRouter

from app.core.config import get_settings
from app.schemas.analysis import AnalysisRequest, AnalysisResponse, AnalysisStatusResponse
from app.services.openai_analysis import active_analysis_model, generate_research_analysis

router = APIRouter()


@router.get("/analysis/status", response_model=AnalysisStatusResponse)
def analysis_status() -> AnalysisStatusResponse:
    settings = get_settings()
    provider = settings.ai_provider.strip().lower()
    gemini_ready = bool(settings.gemini_api_key and settings.gemini_api_key.get_secret_value())
    ready = provider == "gemini" and gemini_ready
    return AnalysisStatusResponse(ready=ready, provider=provider if ready else None)


@router.post("/analysis", response_model=AnalysisResponse)
def analyze_assessment(payload: AnalysisRequest) -> AnalysisResponse:
    settings = get_settings()
    result = generate_research_analysis(payload, settings)
    return AnalysisResponse(result=result, model=active_analysis_model(settings))
