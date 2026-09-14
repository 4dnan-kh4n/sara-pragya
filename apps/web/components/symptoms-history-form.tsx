"use client";

import { useEffect, useState } from "react";

import { Check, Pencil } from "lucide-react";

export type History = { chiefComplaint: string; duration: string; presentingSymptoms: string; associatedSymptoms: string; relevantHistory: string; notes: string };
const key = "sara-pragya:symptoms-history:v1";
const blank: History = { chiefComplaint: "", duration: "", presentingSymptoms: "", associatedSymptoms: "", relevantHistory: "", notes: "" };

function readHistory() {
  if (typeof window === "undefined") return blank;
  try { return { ...blank, ...JSON.parse(window.sessionStorage.getItem(key) ?? "{}") } as History; } catch { return blank; }
}

export function SymptomsHistoryForm({ onBack, onContinue }: { onBack?: () => void; onContinue?: (history: History) => void }) {
  const [history, setHistory] = useState<History>(readHistory);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { try { window.sessionStorage.setItem(key, JSON.stringify(history)); } catch {} }, [history]);
  const update = (field: keyof History, value: string) => setHistory((current) => ({ ...current, [field]: value }));
  const save = () => {
    if (!history.chiefComplaint.trim() || !history.presentingSymptoms.trim()) { setError("Add the chief complaint and presenting symptoms to continue."); return; }
    setError(""); setSaved(true);
  };
  if (saved) return <section className="assessment-workspace history-review" aria-labelledby="history-review-title"><div className="assessment-profile-heading"><h2 id="history-review-title">Clinical history</h2><div className="assessment-profile-actions">{onBack && <button className="assessment-restart" onClick={onBack} type="button">← Back to Vikṛti</button>}<button className="assessment-restart" onClick={() => setSaved(false)} type="button"><Pencil aria-hidden="true" /> Edit</button>{onContinue && <button className="button button-primary" onClick={() => onContinue(history)} type="button">Continue to examination</button>}</div></div><div className="history-summary">{([ ["Chief complaint", history.chiefComplaint], ["Duration", history.duration || "Not recorded"], ["Presenting symptoms", history.presentingSymptoms], ["Associated symptoms", history.associatedSymptoms || "Not recorded"], ["Relevant history", history.relevantHistory || "Not recorded"], ["Additional notes", history.notes || "Not recorded"] ] as const).map(([label, value]) => <article key={label}><span>{label}</span><p>{value}</p></article>)}</div></section>;
  return <section className="assessment-workspace" aria-labelledby="history-title"><div className="assessment-topline"><div><span className="assessment-kicker">Assessment 04 of 09</span><h2 id="history-title">Symptoms &amp; Clinical History</h2></div><span className="assessment-draft-status">Saved in this session</span></div><form className="history-form" onSubmit={(event) => { event.preventDefault(); save(); }}><div className="history-form-grid"><Field label="Chief complaint" required value={history.chiefComplaint} onChange={(value) => update("chiefComplaint", value)} /><Select label="Duration" value={history.duration} onChange={(value) => update("duration", value)} /><Area label="Presenting symptoms" required value={history.presentingSymptoms} onChange={(value) => update("presentingSymptoms", value)} /><Area label="Associated symptoms" value={history.associatedSymptoms} onChange={(value) => update("associatedSymptoms", value)} /><Area label="Relevant history" value={history.relevantHistory} onChange={(value) => update("relevantHistory", value)} /><Area label="Additional notes" value={history.notes} onChange={(value) => update("notes", value)} /></div>{error && <p className="history-error" role="alert">{error}</p>}<div className="history-actions"><button className="button button-primary" type="submit"><Check aria-hidden="true" /> Save clinical history</button></div></form></section>;
}
function Field({ label, required, value, onChange }: { label: string; required?: boolean; value: string; onChange: (value: string) => void }) { return <label className="history-field"><span>{label}{required && <b> *</b>}</span><input onChange={(event) => onChange(event.target.value)} required={required} value={value} /></label>; }
function Select({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="history-field"><span>{label}</span><select onChange={(event) => onChange(event.target.value)} value={value}><option value="">Select duration</option><option>Less than 1 week</option><option>1–4 weeks</option><option>1–3 months</option><option>More than 3 months</option></select></label>; }
function Area({ label, required, value, onChange }: { label: string; required?: boolean; value: string; onChange: (value: string) => void }) { return <label className="history-field history-area"><span>{label}{required && <b> *</b>}</span><textarea onChange={(event) => onChange(event.target.value)} required={required} rows={4} value={value} /></label>; }
