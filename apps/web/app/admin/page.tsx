import { RouteShell } from "@/components/route-shell";

export default function AdminPage() {
  return (
    <RouteShell
      eyebrow="Administration · Restricted foundation"
      title="Governance is part of the product."
      description="Role management, configuration versioning, and audit review will be added behind authenticated authorization boundaries in later phases."
    >
      <section className="container phase-panel access-panel">
        <span className="status-chip">No patient data available</span>
        <h2>Administrative access is not active in Phase 1.</h2>
        <p>This route intentionally contains no sign-in simulation, default credentials, or unsecured administrative controls.</p>
      </section>
    </RouteShell>
  );
}
