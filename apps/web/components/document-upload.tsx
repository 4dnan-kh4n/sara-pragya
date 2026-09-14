"use client";

import { FileText, Upload } from "lucide-react";
import { useEffect, useState } from "react";

import {
  uploadPdfDocument,
  type DocumentKind,
  type StructuredMeasurement,
  type VerifiedDocument,
} from "@/lib/api";

type DocumentUploadProps = {
  kind: DocumentKind;
  stageNumber: string;
  title: string;
  uploadLabel: string;
  continueLabel: string;
  backLabel: string;
  initialDocument?: VerifiedDocument;
  onBack?: () => void;
  onContinue: (document: VerifiedDocument) => void;
};

export function DocumentUpload({
  kind, stageNumber, title, uploadLabel, continueLabel, backLabel,
  initialDocument, onBack, onContinue,
}: DocumentUploadProps) {
  const [document, setDocument] = useState<VerifiedDocument | undefined>(initialDocument);
  const [verifiedText, setVerifiedText] = useState(initialDocument?.verified_text ?? "");
  const [measurements, setMeasurements] = useState<StructuredMeasurement[]>(initialDocument?.measurements ?? []);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDocument(initialDocument);
    setVerifiedText(initialDocument?.verified_text ?? "");
    setMeasurements(initialDocument?.measurements ?? []);
  }, [initialDocument]);

  async function choose(selected?: File) {
    if (!selected) return;
    if (selected.type !== "application/pdf" || selected.size > 10 * 1024 * 1024) {
      setError("Upload a PDF document up to 10 MB.");
      return;
    }
    setError("");
    setIsUploading(true);
    try {
      const uploaded = await uploadPdfDocument(kind, selected);
      setDocument(uploaded);
      setVerifiedText(uploaded.extracted_text);
      setMeasurements(uploaded.measurements ?? []);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "The PDF could not be processed right now.");
    } finally {
      setIsUploading(false);
    }
  }

  const updateMeasurement = (index: number, field: keyof StructuredMeasurement, value: string) => {
    setMeasurements((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  };

  return (
    <section className="assessment-workspace" aria-labelledby={`${kind}-upload-title`}>
      <div className="assessment-topline"><div><span className="assessment-kicker">Assessment {stageNumber} of 09</span><h2 id={`${kind}-upload-title`}>{title}</h2></div>{onBack && <button className="assessment-restart" onClick={onBack} type="button">{backLabel}</button>}</div>
      {!document ? <label className="upload-dropzone"><Upload aria-hidden="true" /><strong>{uploadLabel}</strong><span>PDF only · up to 10 MB</span><input accept="application/pdf" disabled={isUploading} onChange={(event) => void choose(event.target.files?.[0])} type="file" />{isUploading && <span aria-live="polite">Extracting readable text…</span>}</label> : <div className="history-form document-review"><div className="upload-file"><FileText aria-hidden="true" /><span>{document.filename}</span><button onClick={() => { setDocument(undefined); setVerifiedText(""); setMeasurements([]); }} type="button">Replace</button></div><label className="history-field history-area"><span>Review extracted PDF text</span><textarea onChange={(event) => setVerifiedText(event.target.value)} rows={8} value={verifiedText} /></label><section aria-labelledby={`${kind}-measurements-title`} className="structured-measurements"><div><h3 id={`${kind}-measurements-title`}>Structured values</h3><button className="assessment-restart" onClick={() => setMeasurements((current) => [...current, { name: "", value: "", unit: "", reference_range: "" }])} type="button">Add value</button></div>{measurements.length ? <div className="structured-measurement-table"><div className="structured-measurement-head"><span>Parameter</span><span>Value</span><span>Unit</span><span>Reference range</span><span> </span></div>{measurements.map((measurement, index) => <div className="structured-measurement-row" key={`${measurement.name}-${index}`}><input aria-label={`Parameter ${index + 1}`} onChange={(event) => updateMeasurement(index, "name", event.target.value)} value={measurement.name} /><input aria-label={`Value ${index + 1}`} onChange={(event) => updateMeasurement(index, "value", event.target.value)} value={measurement.value} /><input aria-label={`Unit ${index + 1}`} onChange={(event) => updateMeasurement(index, "unit", event.target.value)} value={measurement.unit} /><input aria-label={`Reference range ${index + 1}`} onChange={(event) => updateMeasurement(index, "reference_range", event.target.value)} value={measurement.reference_range} /><button aria-label={`Remove ${measurement.name || "value"}`} className="assessment-restart" onClick={() => setMeasurements((current) => current.filter((_, itemIndex) => itemIndex !== index))} type="button">Remove</button></div>)}</div> : <p>No values were recognised automatically. Add any verified values you want included.</p>}</section><div className="history-actions"><button className="button button-primary" disabled={!verifiedText.trim()} onClick={() => onContinue({ ...document, verified_text: verifiedText.trim(), measurements: measurements.filter((item) => item.name.trim() || item.value.trim()) })} type="button">{continueLabel}</button></div></div>}
      {error && <p className="history-error" role="alert">{error}</p>}
    </section>
  );
}
