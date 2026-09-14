import { RouteShell } from "@/components/route-shell";

export default function PrivacyPolicyPage() {
  return (
    <RouteShell
      eyebrow="Legal"
      title="Privacy Policy"
      description="A starter privacy page for SARA-PRAGYA. It should be legally reviewed before the platform collects or processes personal or health information."
    >
      <section className="container disclaimer-page legal-page">
        <article>
          <h2>Privacy-first development</h2>
          <p>SARA-PRAGYA is being developed for responsible research and clinical decision support. The platform must not process personal or health information beyond the purpose clearly communicated to the user.</p>
        </article>
        <article>
          <h2>Data and consent</h2>
          <p>Before collecting personal or health information in production, SARA-PRAGYA will publish a legally reviewed notice explaining what is collected, why it is used, how long it is retained, and the available consent and access choices.</p>
        </article>
        <article>
          <h2>Security and review</h2>
          <p>Access to research and clinical information should be limited to authorised users, with appropriate safeguards and auditability. This starter policy must be completed against the deployed technical and operational controls.</p>
        </article>
        <article>
          <h2>Contact</h2>
          <p>For privacy questions, contact support@sarapragya.com.</p>
        </article>
      </section>
    </RouteShell>
  );
}
