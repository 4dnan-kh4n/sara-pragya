import { RouteShell } from "@/components/route-shell";

export default function TermsAndConditionsPage() {
  return (
    <RouteShell
      eyebrow="Legal"
      title="Terms & Conditions"
      description="How SARA-PRAGYA is used."
    >
      <section className="container legal-page">
        <article>
          <h2>Purpose of the platform</h2>
          <p>SARA-PRAGYA organizes research and structured clinical information.</p>
        </article>
        <article>
          <h2>Appropriate use</h2>
          <p>Entered information and generated outputs remain available in their full clinical and research context.</p>
        </article>
        <article>
          <h2>Availability and changes</h2>
          <p>Features, methods, and research outputs evolve as the platform develops.</p>
        </article>
        <article>
          <h2>Contact</h2>
          <p>For questions about these terms, contact support@sarapragya.com.</p>
        </article>
      </section>
    </RouteShell>
  );
}
