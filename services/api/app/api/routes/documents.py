from typing import Annotated

from fastapi import APIRouter, File, Form, UploadFile

from app.core.errors import ApiError
from app.schemas.analysis import DocumentKind, DocumentUploadResponse
from app.services.documents import MAX_PDF_BYTES, store_and_extract_pdf

router = APIRouter()


@router.post("/documents", response_model=DocumentUploadResponse)
async def upload_document(
    kind: Annotated[DocumentKind, Form()], file: Annotated[UploadFile, File()]
) -> DocumentUploadResponse:
    content = await file.read(MAX_PDF_BYTES + 1)
    if len(content) > MAX_PDF_BYTES:
        raise ApiError(422, "invalid_document_size", "Upload a PDF document up to 10 MB.")
    return store_and_extract_pdf(
        content=content,
        filename=file.filename or "document.pdf",
        content_type=file.content_type,
        kind=kind,
    )
