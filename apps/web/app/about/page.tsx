import { RouteShell } from "@/components/route-shell";

export default function AboutPage() {
  return (
    <RouteShell
      eyebrow="About SARA-PRAGYA"
      title="Classical description, objective measurement, careful interpretation."
      description="The platform is designed to support research into Dhātu Sāratā alongside clinical history, examination, laboratory, and physiological data—never as an isolated diagnostic test."
    >
      <section className="container principle-grid">
        <article><span>Classical</span><h2>Context is preserved</h2><p>Classical concepts will be sourced, reviewed, and presented without unsupported modern claims.</p></article>
        <article><span>Clinical</span><h2>Inputs are verified</h2><p>Clinicians remain responsible for correcting extracted information before analysis.</p></article>
        <article><span>Research</span><h2>Evidence is explicit</h2><p>Unknown and unvalidated relationships will be identified rather than filled with conjecture.</p></article>
      </section>
    </RouteShell>
  );
}
