import { RouteShell } from "@/components/route-shell";
import { ResearchDashboard } from "@/components/research-dashboard";

export default function ResearchPage() {
  return (
    <RouteShell
      eyebrow="Research workspace · Presentation preview"
      title="Evidence before inference."
      description="A visual preview of a future cohort workspace. This page uses fictional data only and does not represent clinical findings or research results."
    >
      <ResearchDashboard />
    </RouteShell>
  );
}
