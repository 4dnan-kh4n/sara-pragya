from __future__ import annotations

import re
from io import BytesIO
from pathlib import Path
from uuid import uuid4

from pypdf import PdfReader

from app.core.errors import ApiError
from app.schemas.analysis import DocumentKind, DocumentUploadResponse, StructuredMeasurement

MAX_PDF_BYTES = 10 * 1024 * 1024
MAX_EXTRACTED_TEXT = 24_000
_API_ROOT = Path(__file__).resolve().parents[2]
_UPLOAD_DIRECTORY = _API_ROOT / "uploads"

_MEASUREMENT_ALIASES: dict[str, tuple[str, ...]] = {
    "Hemoglobin": ("hemoglobin", "haemoglobin", "hb"),
    "RBC": ("rbc", "red blood cell"),
    "WBC": ("wbc", "white blood cell", "total leukocyte"),
    "Platelets": ("platelet", "platelets"),
    "Fasting glucose": ("fasting glucose", "fbs", "fasting blood sugar"),
    "HbA1c": ("hba1c", "glycated hemoglobin"),
    "Total cholesterol": ("total cholesterol",),
    "Creatinine": ("creatinine",),
    "TSH": ("tsh", "thyroid stimulating hormone"),
    "Blood pressure": ("blood pressure", "bp"),
    "Heart rate": ("heart rate", "pulse rate", "pulse"),
    "Respiratory rate": ("respiratory rate", "respiratory"),
    "SpO₂": ("spo2", "sp02", "oxygen saturation"),
    "Temperature": ("temperature", "temp"),
    "Weight": ("weight",),
    "Height": ("height",),
    "BMI": ("bmi", "body mass index"),
    "Waist circumference": ("waist circumference", "waist"),
}


def extract_structured_measurements(text: str, kind: DocumentKind) -> list[StructuredMeasurement]:
    allowed = {
        "laboratory": {
            "Hemoglobin", "RBC", "WBC", "Platelets", "Fasting glucose", "HbA1c",
            "Total cholesterol", "Creatinine", "TSH",
        },
        "physiology": {
            "Blood pressure", "Heart rate", "Respiratory rate", "SpO₂", "Temperature",
            "Weight", "Height", "BMI", "Waist circumference",
        },
        "examination": {
            "Blood pressure", "Heart rate", "Respiratory rate", "SpO₂", "Temperature",
            "Weight", "Height", "BMI",
        },
    }[kind]
    measurements: list[StructuredMeasurement] = []
    seen: set[str] = set()
    for line in text.splitlines():
        normalised = re.sub(r"\s+", " ", line).strip()
        if not normalised:
            continue
        for name, aliases in _MEASUREMENT_ALIASES.items():
            if name not in allowed or name in seen:
                continue
            alias_pattern = "|".join(re.escape(alias) for alias in aliases)
            match = re.search(
                rf"\b(?:{alias_pattern})\b\s*(?:[:\-]|\s{{2,}})\s*"
                r"(?P<value>[<>≤≥]?\s*\d+(?:[.,]\d+)?(?:\s*/\s*\d+(?:[.,]\d+)?)?)"
                r"(?P<tail>.{0,70})$",
                normalised,
                flags=re.IGNORECASE,
            )
            if not match:
                continue
            tail = match.group("tail").strip(" :;|()")
            range_match = re.search(
                r"(?:ref(?:erence)?|range|normal)?\s*[:\-]?\s*"
                r"(?P<range>\d+(?:[.,]\d+)?\s*[\-–]\s*\d+(?:[.,]\d+)?[^|;]*)",
                tail,
                flags=re.IGNORECASE,
            )
            reference_range = range_match.group("range").strip() if range_match else ""
            unit = tail[: range_match.start()].strip(" :;|()") if range_match else tail
            measurements.append(
                StructuredMeasurement(
                    name=name,
                    value=match.group("value").replace(" ", ""),
                    unit=unit[:80],
                    reference_range=reference_range[:160],
                )
            )
            seen.add(name)
    return measurements


def store_and_extract_pdf(
    *, content: bytes, filename: str, content_type: str | None, kind: DocumentKind
) -> DocumentUploadResponse:
    if not filename.lower().endswith(".pdf") or content_type not in {
        "application/pdf",
        "application/x-pdf",
        None,
    }:
        raise ApiError(422, "invalid_document_type", "Upload a PDF document up to 10 MB.")
    if not content or len(content) > MAX_PDF_BYTES:
        raise ApiError(422, "invalid_document_size", "Upload a PDF document up to 10 MB.")
    if not content.startswith(b"%PDF-"):
        raise ApiError(422, "invalid_document_file", "The uploaded file is not a valid PDF.")

    try:
        reader = PdfReader(BytesIO(content))
        if reader.is_encrypted:
            raise ValueError("encrypted")
        extracted = "\n".join(page.extract_text() or "" for page in reader.pages)
    except Exception:
        raise ApiError(
            422,
            "document_text_unavailable",
            "No readable text could be extracted from this PDF. Upload a text-based PDF.",
        ) from None

    text = "\n".join(line.strip() for line in extracted.splitlines() if line.strip())[
        :MAX_EXTRACTED_TEXT
    ]
    if not text:
        raise ApiError(
            422,
            "document_text_unavailable",
            "No readable text could be extracted from this PDF. Upload a text-based PDF.",
        )

    document_id = uuid4().hex
    _UPLOAD_DIRECTORY.mkdir(parents=True, exist_ok=True)
    (_UPLOAD_DIRECTORY / f"{document_id}.pdf").write_bytes(content)
    safe_filename = Path(filename).name[:240] or "document.pdf"
    return DocumentUploadResponse(
        document_id=document_id,
        kind=kind,
        filename=safe_filename,
        extracted_text=text,
        verified_text=text,
        measurements=extract_structured_measurements(text, kind),
    )
