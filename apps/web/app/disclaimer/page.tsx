import { RouteShell } from "@/components/route-shell";

export default function DisclaimerPage() {
  return (
    <RouteShell
      eyebrow="Clinical safety"
      title="Decision support is not diagnosis."
      description="SARA-PRAGYA is intended for research and structured clinical support under qualified professional oversight."
    >
      <section className="container disclaimer-page">
        <article><h2>What the platform may do</h2><p>Organize verified observations, identify data patterns, expose missing information, and present appropriately qualified research-oriented considerations.</p></article>
        <article><h2>What it must not do</h2><p>Diagnose disease from Sāratā, invent clinical values, imply causation from correlation, or replace examination and professional judgment.</p></article>
        <article><h2>Required review</h2><p>AI-generated content and extracted document fields must be verified by a qualified healthcare professional before clinical use.</p></article>
      </section>
    </RouteShell>
  );
}
