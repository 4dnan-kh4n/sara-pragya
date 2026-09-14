import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BarChart3,
  ClipboardCheck,
  Database,
  FileCheck2,
} from "lucide-react";

const samplePatterns = [
  { label: "Vāta-Pitta", count: 4, share: 33 },
  { label: "Pitta-Kapha", count: 3, share: 25 },
  { label: "Vāta", count: 3, share: 25 },
  { label: "Mixed pattern", count: 2, share: 17 },
];

const sourceCompleteness = [
  { label: "Sāratā observations", value: 100, detail: "12 of 12 sample records" },
  { label: "Clinical history", value: 92, detail: "11 of 12 sample records" },
  { label: "Verified PDFs", value: 75, detail: "9 of 12 sample records" },
];

const sampleRecords = [
  { id: "SAMPLE-012", pattern: "Vāta-Pitta", documents: "3 verified PDFs", status: "Ready for review" },
  { id: "SAMPLE-011", pattern: "Pitta-Kapha", documents: "2 verified PDFs", status: "Ready for review" },
  { id: "SAMPLE-010", pattern: "Vāta", documents: "Clinical history only", status: "Partial sample" },
  { id: "SAMPLE-009", pattern: "Mixed pattern", documents: "1 verified PDF", status: "Ready for review" },
];

export function ResearchDashboard() {
  return (
    <section aria-labelledby="sample-dashboard-title" className="container research-dashboard">
      <div className="research-dashboard-heading">
        <div>
          <span className="assessment-kicker">Illustrative cohort view</span>
          <h2 id="sample-dashboard-title">Research dashboard</h2>
          <p>Explore how a future research workspace can keep recorded observations, source completeness, and review status visibly separate from interpretation.</p>
        </div>
        <Link className="button button-primary" href="/assessment">Open assessment <ArrowUpRight aria-hidden="true" /></Link>
      </div>

      <div className="research-kpi-grid" aria-label="Sample cohort summary">
        <Metric detail="Fictional cohort" icon={<Database aria-hidden="true" />} label="Sample records" value="12" />
        <Metric detail="Across 3 document groups" icon={<FileCheck2 aria-hidden="true" />} label="Verified PDFs" value="24" />
        <Metric detail="Sample status only" icon={<ClipboardCheck aria-hidden="true" />} label="Review-ready" value="9" />
        <Metric detail="Transparent observation groups" icon={<BarChart3 aria-hidden="true" />} label="Sāratā domains" value="7" />
      </div>

      <div className="research-dashboard-grid">
        <section aria-labelledby="pattern-distribution-title" className="research-dashboard-card">
          <div className="research-card-heading"><div><span>Illustrative distribution</span><h3 id="pattern-distribution-title">Preliminary pattern mix</h3></div><small>12 sample records</small></div>
          <div className="research-bars" role="img" aria-label="Illustrative pattern distribution: Vata-Pitta 4, Pitta-Kapha 3, Vata 3, Mixed pattern 2.">
            {samplePatterns.map((item) => <div className="research-bar-row" key={item.label}><div><strong>{item.label}</strong><span>{item.count} sample records - {item.share}%</span></div><div aria-hidden="true" className="research-bar-track"><span style={{ width: `${item.share}%` }} /></div></div>)}
          </div>
        </section>

        <section aria-labelledby="source-completeness-title" className="research-dashboard-card">
          <div className="research-card-heading"><div><span>Record completeness</span><h3 id="source-completeness-title">Available source material</h3></div><small>Sample tracking</small></div>
          <div className="research-bars" role="img" aria-label="Sample source completeness: Sarata observations 100 percent, clinical history 92 percent, verified PDFs 75 percent.">
            {sourceCompleteness.map((item) => <div className="research-bar-row" key={item.label}><div><strong>{item.label}</strong><span>{item.detail} - {item.value}%</span></div><div aria-hidden="true" className="research-bar-track source"><span style={{ width: `${item.value}%` }} /></div></div>)}
          </div>
          <p className="research-card-note">Completeness tracks whether each source is present.</p>
        </section>
      </div>

      <section aria-labelledby="sample-register-title" className="research-dashboard-card research-register">
        <div className="research-card-heading"><div><span>Sample register</span><h3 id="sample-register-title">Illustrative cohort records</h3></div></div>
        <div className="research-register-table-wrap"><table><thead><tr><th scope="col">Sample ID</th><th scope="col">Recorded pattern</th><th scope="col">Supporting material</th><th scope="col">Review state</th></tr></thead><tbody>{sampleRecords.map((record) => <tr key={record.id}><th scope="row">{record.id}</th><td>{record.pattern}</td><td>{record.documents}</td><td><span className={record.status === "Ready for review" ? "research-status is-ready" : "research-status"}>{record.status}</span></td></tr>)}</tbody></table></div>
      </section>

      <section aria-labelledby="dashboard-next-title" className="research-dashboard-card research-next">
        <div><span>Later, with saved records</span><h3 id="dashboard-next-title">From sample view to research workspace</h3></div>
        <p>When permanent anonymous case records are added, this dashboard can use the same layout for real cohort filters, reproducible statistics, and versioned analysis outputs.</p>
      </section>
    </section>
  );
}

function Metric({ detail, icon, label, value }: { detail: string; icon: ReactNode; label: string; value: string }) {
  return <article className="research-kpi"><span>{icon}</span><div><small>{label}</small><strong>{value}</strong><p>{detail}</p></div></article>;
}
