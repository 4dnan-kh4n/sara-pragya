from io import BytesIO

from fastapi.testclient import TestClient
from pydantic import SecretStr
from pypdf import PdfReader

from app.core.config import Settings
from app.core.errors import ApiError
from app.main import create_app
from app.schemas.analysis import AnalysisRequest, AnalysisResult
from app.services.openai_analysis import generate_research_analysis


def _text_pdf(text: str) -> bytes:
    stream = f"BT\n/F1 12 Tf\n72 720 Td\n({text}) Tj\nET".encode()
    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        (
            b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
            b"/Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>"
        ),
        b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]
    result = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for number, content in enumerate(objects, start=1):
        offsets.append(len(result))
        result.extend(f"{number} 0 obj\n".encode() + content + b"\nendobj\n")
    xref = len(result)
    result.extend(f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode())
    result.extend(b"".join(f"{offset:010} 00000 n \n".encode() for offset in offsets[1:]))
    trailer = f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF"
    result.extend(trailer.encode())
    return bytes(result)


def test_health_response_is_public_and_minimal() -> None:
    client = TestClient(create_app())

    response = client.get("/api/v1/health", headers={"X-Request-ID": "phase-1-test"})

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "SARA-PRAGYA API",
        "version": "0.1.0",
    }
    assert response.headers["x-request-id"] == "phase-1-test"
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"
    assert response.headers["cache-control"] == "no-store"


def test_analysis_status_does_not_expose_provider_details_when_disabled() -> None:
    client = TestClient(create_app())

    response = client.get("/api/v1/analysis/status")

    assert response.status_code == 200
    assert response.json() == {"ready": False, "provider": None}


def test_analysis_rejects_requests_until_a_provider_is_configured() -> None:
    client = TestClient(create_app())
    response = client.post(
        "/api/v1/analysis",
        json={
            "sarata_profile": [{"dhatu": "Rasa", "score": 2, "maximum": 4, "percentage": 50}],
            "prakriti_pattern": "Vata",
            "vikriti_profile": [{"dosha": "Vata", "score": 2, "percentage": 50}],
            "clinical_history": {
                "chief_complaint": "Example",
                "duration": "One week",
                "presenting_symptoms": "Example symptoms",
                "associated_symptoms": "",
                "relevant_history": "",
                "notes": "",
            },
        },
    )

    assert response.status_code == 503
    assert response.json()["error"]["code"] == "analysis_not_configured"


def test_gemini_analysis_uses_structured_json_response(monkeypatch) -> None:
    requested: dict[str, object] = {}

    class FakeResponse:
        def __enter__(self):
            return self

        def __exit__(self, *_args):
            return False

        def read(self) -> bytes:
            return (
                b'{"candidates":[{"content":{"parts":[{"text":'
                b'"{\\\"summary\\\":\\\"Preliminary review.\\\",'
                b'\\\"observations\\\":[\\\"Observed pattern.\\\"],'
                b'\\\"research_focus\\\":[\\\"Qualified review.\\\"]}"}]}}]}'
            )

    class FakeClient:
        def open(self, request, timeout: int):
            requested["url"] = request.full_url
            requested["payload"] = request.data
            requested["timeout"] = timeout
            return FakeResponse()

    monkeypatch.setattr("app.services.openai_analysis.build_opener", lambda *_args: FakeClient())
    payload = AnalysisRequest.model_validate(
        {
            "sarata_profile": [{"dhatu": "Rasa", "score": 2, "maximum": 4, "percentage": 50}],
            "prakriti_pattern": "Vata",
            "vikriti_profile": [{"dosha": "Vata", "score": 2, "percentage": 50}],
            "clinical_history": {
                "chief_complaint": "Example",
                "duration": "One week",
                "presenting_symptoms": "Example symptoms",
                "associated_symptoms": "",
                "relevant_history": "",
                "notes": "",
            },
            "documents": [],
        }
    )

    result = generate_research_analysis(
        payload,
        Settings(
            ai_provider="gemini",
            gemini_api_key=SecretStr("test-key"),
            gemini_model="gemini-test-model",
        ),
    )

    assert result.summary == "Preliminary review."
    assert "models/gemini-test-model:generateContent" in str(requested["url"])
    assert b'"responseMimeType": "application/json"' in requested["payload"]


def test_pdf_upload_returns_text_for_clinician_review(monkeypatch, tmp_path) -> None:
    monkeypatch.setattr("app.services.documents._UPLOAD_DIRECTORY", tmp_path)
    client = TestClient(create_app())
    response = client.post(
        "/api/v1/documents",
        data={"kind": "examination"},
        files={"file": ("exam.pdf", _text_pdf("Verified clinical note."), "application/pdf")},
    )

    assert response.status_code == 200
    assert response.json()["extracted_text"] == "Verified clinical note."
    assert len(list(tmp_path.glob("*.pdf"))) == 1


def test_pdf_upload_rejects_non_pdf_files() -> None:
    client = TestClient(create_app())
    response = client.post(
        "/api/v1/documents",
        data={"kind": "laboratory"},
        files={"file": ("report.txt", b"not a pdf", "text/plain")},
    )

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "invalid_document_type"


def test_laboratory_pdf_suggests_structured_measurements(monkeypatch, tmp_path) -> None:
    monkeypatch.setattr("app.services.documents._UPLOAD_DIRECTORY", tmp_path)
    client = TestClient(create_app())
    response = client.post(
        "/api/v1/documents",
        data={"kind": "laboratory"},
        files={
            "file": (
                "lab.pdf",
                _text_pdf("Hemoglobin: 12.4 g/dL Ref: 12-16\nPlatelets: 250 10^3/uL"),
                "application/pdf",
            )
        },
    )

    assert response.status_code == 200
    assert response.json()["measurements"] == [
        {
            "name": "Hemoglobin",
            "value": "12.4",
            "unit": "g/dL",
            "reference_range": "12-16",
        },
        {
            "name": "Platelets",
            "value": "250",
            "unit": "10^3/uL",
            "reference_range": "",
        },
    ]


def test_end_to_end_upload_analysis_and_report_download(monkeypatch, tmp_path) -> None:
    monkeypatch.setattr("app.services.documents._UPLOAD_DIRECTORY", tmp_path)
    monkeypatch.setenv("AI_PROVIDER", "gemini")
    monkeypatch.setenv("GEMINI_API_KEY", "test-key")
    monkeypatch.setattr(
        "app.api.routes.analysis.generate_research_analysis",
        lambda *_args: AnalysisResult(
            summary="Synthetic research summary.",
            observations=["Recorded sample pattern."],
            research_focus=["Qualified review."],
        ),
    )
    client = TestClient(create_app())
    uploaded = client.post(
        "/api/v1/documents",
        data={"kind": "laboratory"},
        files={
            "file": (
                "lab.pdf",
                _text_pdf("Hemoglobin: 12.4 g/dL Ref: 12-16"),
                "application/pdf",
            )
        },
    )
    assert uploaded.status_code == 200
    document = uploaded.json()
    request = {
        "sarata_profile": [{"dhatu": "Rasa", "score": 2, "maximum": 4, "percentage": 50}],
        "prakriti_pattern": "Vata",
        "vikriti_profile": [{"dosha": "Vata", "score": 2, "percentage": 50}],
        "clinical_history": {
            "chief_complaint": "Synthetic record",
            "duration": "One week",
            "presenting_symptoms": "Sample symptoms",
            "associated_symptoms": "",
            "relevant_history": "",
            "notes": "",
        },
        "documents": [document],
    }
    analysis = client.post("/api/v1/analysis", json=request)
    assert analysis.status_code == 200

    report = client.post(
        "/api/v1/reports/pdf",
        json={"assessment": request, "analysis": analysis.json()},
    )
    assert report.status_code == 200
    assert report.headers["content-type"] == "application/pdf"
    assert "attachment;" in report.headers["content-disposition"]
    assert report.content.startswith(b"%PDF")
    text = "\n".join(page.extract_text() or "" for page in PdfReader(BytesIO(report.content)).pages)
    assert "Synthetic research summary." in text
    assert "Hemoglobin" in text


def test_known_errors_return_safe_shape() -> None:
    app = create_app()

    @app.get("/_test/known-error")
    def known_error() -> None:
        raise ApiError(422, "invalid_test_input", "The supplied test input is invalid.")

    client = TestClient(app, raise_server_exceptions=False)
    response = client.get("/_test/known-error", headers={"X-Request-ID": "safe-error-test"})

    assert response.status_code == 422
    assert response.json() == {
        "error": {
            "code": "invalid_test_input",
            "message": "The supplied test input is invalid.",
            "requestId": "safe-error-test",
        }
    }


def test_unhandled_errors_do_not_leak_exception_details() -> None:
    app = create_app()

    @app.get("/_test/unhandled-error")
    def unhandled_error() -> None:
        raise RuntimeError("private database credential detail")

    client = TestClient(app, raise_server_exceptions=False)
    response = client.get("/_test/unhandled-error")

    assert response.status_code == 500
    assert "private database credential detail" not in response.text
    assert response.json()["error"]["code"] == "internal_error"
