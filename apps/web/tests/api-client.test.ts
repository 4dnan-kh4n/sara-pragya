import { afterEach, describe, expect, it, vi } from "vitest";

import { downloadAssessmentReport, getAnalysisStatus, getApiHealth, requestAnalysis } from "@/lib/api";

describe("API health client", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("accepts the shared health contract", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      status: "ok",
      service: "SARA-PRAGYA API",
      version: "0.1.0",
    }), { status: 200, headers: { "Content-Type": "application/json" } })));

    await expect(getApiHealth()).resolves.toEqual({
      status: "ok",
      service: "SARA-PRAGYA API",
      version: "0.1.0",
    });
  });

  it("returns a safe message when the API is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("unavailable", { status: 503 })));

    await expect(getApiHealth()).rejects.toThrow("temporarily unavailable");
  });
});

describe("analysis setup client", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("keeps a disabled analysis service distinct from an available provider", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      ready: false,
      provider: null,
    }), { status: 200, headers: { "Content-Type": "application/json" } })));

    await expect(getAnalysisStatus()).resolves.toEqual({ ready: false, provider: null });
  });

  it("sends the structured assessment payload to the analysis service", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      result: { summary: "Example", observations: ["Observed pattern"], research_focus: ["Review context"] },
      model: "gpt-5",
    }), { status: 200, headers: { "Content-Type": "application/json" } })));

    await expect(requestAnalysis({
      sarata_profile: [{ dhatu: "Rasa", score: 2, maximum: 4, percentage: 50 }],
      prakriti_pattern: "Vata",
      vikriti_profile: [{ dosha: "Vata", score: 2, percentage: 50 }],
      clinical_history: { chief_complaint: "Example", duration: "One week", presenting_symptoms: "Example", associated_symptoms: "", relevant_history: "", notes: "" },
      documents: [],
    })).resolves.toMatchObject({ model: "gpt-5" });
  });

  it("downloads a generated assessment report as a PDF", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("%PDF-demo", {
      status: 200,
      headers: { "Content-Type": "application/pdf" },
    })));

    await expect(downloadAssessmentReport({
      sarata_profile: [{ dhatu: "Rasa", score: 2, maximum: 4, percentage: 50 }],
      prakriti_pattern: "Vata",
      vikriti_profile: [{ dosha: "Vata", score: 2, percentage: 50 }],
      clinical_history: { chief_complaint: "Example", duration: "One week", presenting_symptoms: "Example", associated_symptoms: "", relevant_history: "", notes: "" },
      documents: [],
    }, {
      result: { summary: "Example", observations: ["Observed"], research_focus: ["Review"] },
      model: "gemini-3.5-flash-lite",
    })).resolves.toMatchObject({ type: "application/pdf" });
  });

  it("shows a safe provider message when the free analysis limit is reached", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: { message: "The free analysis limit has been reached. Please try again later." },
    }), { status: 503, headers: { "Content-Type": "application/json" } })));

    await expect(requestAnalysis({
      sarata_profile: [{ dhatu: "Rasa", score: 2, maximum: 4, percentage: 50 }],
      prakriti_pattern: "Vata",
      vikriti_profile: [{ dosha: "Vata", score: 2, percentage: 50 }],
      clinical_history: { chief_complaint: "Example", duration: "One week", presenting_symptoms: "Example", associated_symptoms: "", relevant_history: "", notes: "" },
      documents: [],
    })).rejects.toThrow("free analysis limit");
  });
});
