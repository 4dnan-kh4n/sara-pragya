import { RouteShell } from "@/components/route-shell";

const pathway = ["Patient assessment", "Dhātu Sāratā", "Prakṛti", "Vikṛti", "Clinical history", "Verified measurements", "Cross-domain analysis", "Research output"];

export default function WorkflowPage() {
  return (
    <RouteShell
      eyebrow="Research pathway"
      title="Human verification connects every stage."
      description="No document extraction or AI interpretation advances silently into the clinical analysis layer."
      clinical
    >
      <section className="container pathway" aria-label="Planned SARA-PRAGYA workflow">
        {pathway.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong>{index < pathway.length - 1 && <i aria-hidden="true">↓</i>}</div>)}
      </section>
    </RouteShell>
  );
}
