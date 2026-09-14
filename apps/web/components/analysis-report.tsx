"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, Download, LoaderCircle } from "lucide-react";

import { downloadAssessmentReport, type AnalysisRequest, type AnalysisResponse } from "@/lib/api";

export function AnalysisReport({
  assessment,
  result,
  onBack,
}: {
  assessment: AnalysisRequest;
  result: AnalysisResponse;
  onBack: () => void;
}) {
  const [downloadState, setDownloadState] = useState<"idle" | "downloading" | "error">("idle");
  const [downloadError, setDownloadError] = useState("");

  const downloadReport = async () => {
    setDownloadState("downloading");
    setDownloadError("");
    try {
      const file = await downloadAssessmentReport(assessment, result);
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = "sara-pragya-assessment-report.pdf";
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setDownloadState("idle");
    } catch (error) {
      setDownloadState("error");
      setDownloadError(error instanceof Error ? error.message : "The report could not be created right now.");
    }
  };

  return (
    <section className="assessment-workspace clinical-report" aria-labelledby="clinical-report-title">
      <div className="assessment-topline">
        <div>
          <span className="assessment-kicker">Research report</span>
          <h2 id="clinical-report-title">Assessment insight</h2>
        </div>
        <div className="report-actions">
          <button aria-busy={downloadState === "downloading"} className="button button-primary" disabled={downloadState === "downloading"} onClick={() => void downloadReport()} type="button">
            {downloadState === "downloading" ? <LoaderCircle aria-hidden="true" className="report-download-spinner" /> : <Download aria-hidden="true" />}
            {downloadState === "downloading" ? "Preparing PDF..." : "Download PDF"}
          </button>
          <button className="assessment-restart" onClick={onBack} type="button">
            <ArrowLeft aria-hidden="true" /> Back to analysis
          </button>
        </div>
      </div>
      <p aria-live="polite" className="report-download-status">{downloadError}</p>

      <article className="report-summary">
        <span>AI research summary</span>
        <p>{result.result.summary}</p>
      </article>

      <section className="report-section" aria-labelledby="sarata-report-title">
        <div className="report-section-heading">
          <div>
            <span>Dhātu profile</span>
            <h3 id="sarata-report-title">Recorded Sāratā observations</h3>
          </div>
          <p>Correlation evidence is not established in the current dataset.</p>
        </div>
        <div className="report-table-wrap">
          <table>
            <thead>
              <tr><th scope="col">Dhātu</th><th scope="col">Recorded score</th><th scope="col">Profile</th></tr>
            </thead>
            <tbody>
              {assessment.sarata_profile.map((item) => (
                <tr key={item.dhatu}>
                  <th scope="row">{item.dhatu}</th>
                  <td>{item.score} / {item.maximum}</td>
                  <td>{item.percentage}% recorded observation points</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="report-grid">
        <section className="report-section" aria-labelledby="observed-patterns-title">
          <span>AI analysis</span>
          <h3 id="observed-patterns-title">Observed patterns</h3>
          <ReportList items={result.result.observations} />
        </section>
        <section className="report-section" aria-labelledby="research-focus-title">
          <span>Next review</span>
          <h3 id="research-focus-title">Research focus</h3>
          <ReportList items={result.result.research_focus} />
        </section>
      </div>

      <section className="report-section report-method" aria-labelledby="report-method-title">
        <span>Method status</span>
        <h3 id="report-method-title">Risk score and differential assessment</h3>
        <p>No validated risk thresholds or differential-assessment model are configured for this research dataset.</p>
      </section>
    </section>
  );
}

function ReportList({ items }: { items: string[] }) {
  return <ul className="report-list">{items.map((item) => <li key={item}><CheckCircle2 aria-hidden="true" /> <span>{item}</span></li>)}</ul>;
}
