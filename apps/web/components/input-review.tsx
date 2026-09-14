"use client";

import type { VerifiedDocument } from "@/lib/api";

type Section = { id: "sarata" | "dosha" | "symptoms" | "examination" | "laboratory" | "physiology"; label: string; detail: string };
const sections: Section[] = [
  { id: "sarata", label: "Dhātu Sāratā", detail: "Assessment recorded" },
  { id: "dosha", label: "Prakṛti & Vikṛti", detail: "Assessment recorded" },
  { id: "symptoms", label: "Symptoms & Clinical History", detail: "Clinical history recorded" },
  { id: "examination", label: "Examination Findings", detail: "" },
  { id: "laboratory", label: "Laboratory Parameters", detail: "" },
  { id: "physiology", label: "Physiological Measurements", detail: "" },
];

export function InputReview({ documents, onEdit, onContinue }: { documents: VerifiedDocument[]; onEdit: (stage: Section["id"]) => void; onContinue: () => void }) {
  const detailFor = (section: Section) => {
    if (section.detail) return section.detail;
    const document = documents.find((item) => item.kind === section.id);
    return document ? `${document.filename} · ${document.measurements.length} verified values` : "No PDF added";
  };
  return <section className="assessment-workspace" aria-labelledby="input-review-title"><div className="assessment-topline"><div><span className="assessment-kicker">Assessment 08 of 09</span><h2 id="input-review-title">Patient Assessment Summary</h2></div></div><div className="review-grid">{sections.map((section) => <article key={section.id}><div><strong>{section.label}</strong><span>{detailFor(section)}</span></div><button className="assessment-restart" onClick={() => onEdit(section.id)} type="button">Edit</button></article>)}</div><div className="history-actions"><button className="button button-primary" onClick={onContinue} type="button">Proceed to AI analysis</button></div></section>;
}
