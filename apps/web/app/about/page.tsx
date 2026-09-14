import { RouteShell } from "@/components/route-shell";

export default function AboutPage() {
  return (
    <RouteShell
      eyebrow="About SARA-PRAGYA"
      title="Classical description, objective measurement, careful interpretation."
      description="The platform supports research into Dhātu Sāratā alongside clinical history, examination, laboratory, and physiological data."
    >
      <section className="container principle-grid">
        <article><span>Classical</span><h2>Context is preserved</h2><p>Classical concepts are sourced, reviewed, and presented in context.</p></article>
        <article><span>Clinical</span><h2>Inputs are verified</h2><p>Clinicians remain responsible for correcting extracted information before analysis.</p></article>
        <article><span>Research</span><h2>Evidence is explicit</h2><p>Relationships are presented with their evidence status.</p></article>
      </section>
    </RouteShell>
  );
}
