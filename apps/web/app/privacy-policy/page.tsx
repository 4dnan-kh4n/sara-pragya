import { RouteShell } from "@/components/route-shell";

export default function PrivacyPolicyPage() {
  return (
    <RouteShell
      eyebrow="Legal"
      title="Privacy Policy"
      description="How SARA-PRAGYA handles personal and health information."
    >
      <section className="container legal-page">
        <article>
          <h2>Privacy-first development</h2>
          <p>SARA-PRAGYA processes personal and health information only for the purpose shown when it is collected.</p>
        </article>
        <article>
          <h2>Data and consent</h2>
          <p>Data use, retention, consent, and access choices are documented alongside collected information.</p>
        </article>
        <article>
          <h2>Security and review</h2>
          <p>Access to research and clinical information is limited to authorised users with safeguards and audit trails.</p>
        </article>
        <article>
          <h2>Contact</h2>
          <p>For privacy questions, contact support@sarapragya.com.</p>
        </article>
      </section>
    </RouteShell>
  );
}
