"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";

import { getAnalysisStatus, requestAnalysis, type AnalysisRequest, type AnalysisResponse } from "@/lib/api";

type AnalysisState = "idle" | "checking" | "running" | "needs-setup" | "complete" | "unavailable" | "incomplete";

export function AnalysisWorkspace({
  assessment,
  onBack,
  onViewReport,
}: {
  assessment: AnalysisRequest | null;
  onBack: () => void;
  onViewReport: (result: AnalysisResponse) => void;
}) {
  const [state, setState] = useState<AnalysisState>("idle");
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function startAnalysis() {
    if (!assessment) {
      setState("incomplete");
      return;
    }
    setErrorMessage("");
    setState("checking");
    try {
      const status = await getAnalysisStatus();
      if (!status.ready) {
        setState("needs-setup");
        return;
      }
      setState("running");
      setResult(await requestAnalysis(assessment));
      setState("complete");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "The analysis service is temporarily unavailable.");
      setState("unavailable");
    }
  }

  return (
    <section aria-busy={state === "checking" || state === "running"} className="assessment-workspace" aria-labelledby="analysis-title">
      <div className="assessment-topline">
        <div>
          <span className="assessment-kicker">Assessment 09 of 09</span>
          <h2 id="analysis-title">AI analysis</h2>
        </div>
      </div>

      <div className="analysis-overview" aria-label="Assessment inputs ready for analysis">
        {[
          "Dhātu Sāratā observations",
          "Prakṛti & Vikṛti assessment",
          "Clinical history",
          assessment?.documents.length ? `Verified PDFs (${assessment.documents.length})` : null,
        ].map((item) => (
          item && <div key={item}>
            <CheckCircle2 aria-hidden="true" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      {state === "incomplete" && (
        <p className="analysis-message" role="status">
          Return to the assessment sections and complete the required observations before starting analysis.
        </p>
      )}
      {state === "needs-setup" && (
        <p className="analysis-message" role="status">
          Connect an AI provider in the server environment to begin analysis.
        </p>
      )}
      {state === "complete" && result && (
        <div className="analysis-result" aria-live="polite">
          <p>{result.result.summary}</p>
          <div>
            <article>
              <span>Observed patterns</span>
              <ul>{result.result.observations.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article>
              <span>Research focus</span>
              <ul>{result.result.research_focus.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </div>
          <button className="assessment-restart" onClick={() => onViewReport(result)} type="button">View full research report</button>
        </div>
      )}
      {(state === "checking" || state === "running") && (
        <p className="analysis-message is-ready" role="status">
          {state === "checking" ? "Checking the analysis service…" : "Preparing the research analysis…"}
        </p>
      )}
      {state === "unavailable" && (
        <p className="analysis-message" role="status">
          {errorMessage || "The analysis service is not available right now. Your assessment remains ready to review."}
        </p>
      )}

      <div className="assessment-actions analysis-actions">
        <button className="assessment-restart" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" /> Back to review
        </button>
        <button className="button button-primary" disabled={state === "checking" || state === "running"} onClick={startAnalysis} type="button">
          <Sparkles aria-hidden="true" /> {state === "checking" || state === "running" ? "Analyzing…" : state === "complete" ? "Run again" : "Start analysis"}
        </button>
      </div>
    </section>
  );
}
