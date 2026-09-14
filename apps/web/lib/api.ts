import type { HealthResponse } from "@sara-pragya/contracts";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export type AnalysisStatus = {
  ready: boolean;
  provider: string | null;
};

export type AnalysisRequest = {
  sarata_profile: Array<{ dhatu: string; score: number; maximum: number; percentage: number }>;
  prakriti_pattern: string;
  vikriti_profile: Array<{ dosha: string; score: number; percentage: number }>;
  clinical_history: {
    chief_complaint: string;
    duration: string;
    presenting_symptoms: string;
    associated_symptoms: string;
    relevant_history: string;
    notes: string;
  };
  documents: VerifiedDocument[];
};

export type DocumentKind = "examination" | "laboratory" | "physiology";

export type VerifiedDocument = {
  document_id: string;
  kind: DocumentKind;
  filename: string;
  verified_text: string;
  measurements: StructuredMeasurement[];
};

export type StructuredMeasurement = {
  name: string;
  value: string;
  unit: string;
  reference_range: string;
};

type DocumentUploadResponse = VerifiedDocument & { extracted_text: string };

export type AnalysisResponse = {
  result: {
    summary: string;
    observations: string[];
    research_focus: string[];
  };
  model: string;
};

export async function getApiHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const response = await fetch(`${apiBaseUrl}/health`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) {
    throw new Error("SARA-PRAGYA services are temporarily unavailable.");
  }
  const data: unknown = await response.json();
  if (
    !data ||
    typeof data !== "object" ||
    !("status" in data) ||
    !("service" in data) ||
    !("version" in data)
  ) {
    throw new Error("The service returned an invalid health response.");
  }
  return data as HealthResponse;
}

export async function getAnalysisStatus(signal?: AbortSignal): Promise<AnalysisStatus> {
  const response = await fetch(`${apiBaseUrl}/analysis/status`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) {
    throw new Error("The analysis service is temporarily unavailable.");
  }
  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || !("ready" in data) || typeof data.ready !== "boolean") {
    throw new Error("The analysis service returned an invalid response.");
  }
  return {
    ready: data.ready,
    provider: "provider" in data && typeof data.provider === "string" ? data.provider : null,
  };
}

export async function requestAnalysis(payload: AnalysisRequest, signal?: AbortSignal): Promise<AnalysisResponse> {
  const response = await fetch(`${apiBaseUrl}/analysis`, {
    method: "POST",
    cache: "no-store",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
  if (!response.ok) {
    const data: unknown = await response.json().catch(() => null);
    if (
      data
      && typeof data === "object"
      && "error" in data
      && data.error
      && typeof data.error === "object"
      && "message" in data.error
      && typeof data.error.message === "string"
    ) {
      throw new Error(data.error.message);
    }
    throw new Error("The analysis service is temporarily unavailable.");
  }
  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || !("result" in data) || !("model" in data)) {
    throw new Error("The analysis service returned an invalid response.");
  }
  return data as AnalysisResponse;
}

export async function downloadAssessmentReport(
  assessment: AnalysisRequest,
  analysis: AnalysisResponse,
  signal?: AbortSignal,
): Promise<Blob> {
  const response = await fetch(`${apiBaseUrl}/reports/pdf`, {
    method: "POST",
    cache: "no-store",
    headers: { Accept: "application/pdf", "Content-Type": "application/json" },
    body: JSON.stringify({ assessment, analysis }),
    signal,
  });
  if (!response.ok) {
    const data: unknown = await response.json().catch(() => null);
    if (
      data && typeof data === "object" && "error" in data && data.error
      && typeof data.error === "object" && "message" in data.error
      && typeof data.error.message === "string"
    ) throw new Error(data.error.message);
    throw new Error("The report could not be created right now.");
  }
  const report = await response.blob();
  if (report.type !== "application/pdf" || report.size === 0) {
    throw new Error("The report service returned an invalid file.");
  }
  return report;
}

export async function uploadPdfDocument(
  kind: DocumentKind,
  file: File,
  signal?: AbortSignal,
): Promise<DocumentUploadResponse> {
  const body = new FormData();
  body.append("kind", kind);
  body.append("file", file);
  const response = await fetch(`${apiBaseUrl}/documents`, {
    method: "POST",
    cache: "no-store",
    headers: { Accept: "application/json" },
    body,
    signal,
  });
  if (!response.ok) {
    const data: unknown = await response.json().catch(() => null);
    if (
      data && typeof data === "object" && "error" in data && data.error
      && typeof data.error === "object" && "message" in data.error
      && typeof data.error.message === "string"
    ) throw new Error(data.error.message);
    throw new Error("The PDF could not be processed right now.");
  }
  const data: unknown = await response.json();
  if (
    !data || typeof data !== "object" || !("document_id" in data) || !("extracted_text" in data)
    || typeof data.document_id !== "string" || typeof data.extracted_text !== "string"
  ) throw new Error("The PDF service returned an invalid response.");
  return data as DocumentUploadResponse;
}
