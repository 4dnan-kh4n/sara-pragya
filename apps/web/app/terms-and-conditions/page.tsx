import { RouteShell } from "@/components/route-shell";

export default function TermsAndConditionsPage() {
  return (
    <RouteShell
      eyebrow="Legal"
      title="Terms & Conditions"
      description="A starter terms page for SARA-PRAGYA. It should be reviewed and approved by legal counsel before public production use."
    >
      <section className="container disclaimer-page legal-page">
        <article>
          <h2>Purpose of the platform</h2>
          <p>SARA-PRAGYA provides research and structured clinical decision-support information. It does not provide a diagnosis, prescribe treatment, or replace examination and judgment by a qualified healthcare professional.</p>
        </article>
        <article>
          <h2>Appropriate use</h2>
          <p>Users must use the platform responsibly, maintain the accuracy of information they enter, and ensure that any output is reviewed in its full clinical and research context.</p>
        </article>
        <article>
          <h2>Availability and changes</h2>
          <p>Features, methods, and research outputs may change as the platform develops. This starter notice does not create a clinical, professional, or contractual guarantee.</p>
        </article>
        <article>
          <h2>Contact</h2>
          <p>For questions about these terms, contact support@sarapragya.com.</p>
        </article>
      </section>
    </RouteShell>
  );
}
