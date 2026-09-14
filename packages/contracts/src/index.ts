export type HealthStatus = "ok" | "degraded";

export interface HealthResponse {
  status: HealthStatus;
  service: string;
  version: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    requestId: string;
  };
}

export const CLINICAL_DISCLAIMER =
  "SARA-PRAGYA is an AI-assisted research and clinical decision-support platform. Dhātu Sāratā is not an independent diagnostic test. Outputs must not replace examination, clinical judgment, laboratory interpretation, or diagnosis by a qualified healthcare professional.";
