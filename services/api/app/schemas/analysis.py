from typing import Literal

from pydantic import BaseModel, Field


class AnalysisStatusResponse(BaseModel):
    ready: bool
    provider: str | None = None


class SarataObservation(BaseModel):
    dhatu: str = Field(min_length=1, max_length=80)
    score: int = Field(ge=0, le=100)
    maximum: int = Field(ge=1, le=100)
    percentage: int = Field(ge=0, le=100)


class DoshaObservation(BaseModel):
    dosha: str = Field(min_length=1, max_length=80)
    score: int = Field(ge=0, le=100)
    percentage: int = Field(ge=0, le=100)


class ClinicalHistoryInput(BaseModel):
    chief_complaint: str = Field(min_length=1, max_length=4_000)
    duration: str = Field(max_length=240)
    presenting_symptoms: str = Field(min_length=1, max_length=8_000)
    associated_symptoms: str = Field(max_length=8_000)
    relevant_history: str = Field(max_length=8_000)
    notes: str = Field(max_length=8_000)


DocumentKind = Literal["examination", "laboratory", "physiology"]


class VerifiedDocument(BaseModel):
    document_id: str = Field(min_length=32, max_length=64)
    kind: DocumentKind
    filename: str = Field(min_length=1, max_length=240)
    verified_text: str = Field(min_length=1, max_length=24_000)
    measurements: list["StructuredMeasurement"] = Field(default_factory=list, max_length=40)


class StructuredMeasurement(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    value: str = Field(max_length=80)
    unit: str = Field(max_length=80)
    reference_range: str = Field(max_length=160)


class DocumentUploadResponse(VerifiedDocument):
    extracted_text: str = Field(min_length=1, max_length=24_000)


class AnalysisRequest(BaseModel):
    sarata_profile: list[SarataObservation] = Field(min_length=1, max_length=14)
    prakriti_pattern: str = Field(min_length=1, max_length=240)
    vikriti_profile: list[DoshaObservation] = Field(min_length=1, max_length=3)
    clinical_history: ClinicalHistoryInput
    documents: list[VerifiedDocument] = Field(default_factory=list, max_length=3)


class AnalysisResult(BaseModel):
    summary: str = Field(min_length=1, max_length=2_000)
    observations: list[str] = Field(min_length=1, max_length=4)
    research_focus: list[str] = Field(min_length=1, max_length=3)


class AnalysisResponse(BaseModel):
    result: AnalysisResult
    model: str


class ReportRequest(BaseModel):
    assessment: AnalysisRequest
    analysis: AnalysisResponse
