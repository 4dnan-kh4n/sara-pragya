from datetime import UTC, datetime

from fastapi import APIRouter
from fastapi.responses import Response

from app.schemas.analysis import ReportRequest
from app.services.report_pdf import build_assessment_report

router = APIRouter()


@router.post("/reports/pdf", response_class=Response)
def download_assessment_report(payload: ReportRequest) -> Response:
    report = build_assessment_report(payload)
    filename = f"sara-pragya-assessment-{datetime.now(UTC).strftime('%Y%m%d')}.pdf"
    return Response(
        content=report,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
