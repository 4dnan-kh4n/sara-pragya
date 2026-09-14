import { RouteShell } from "@/components/route-shell";
import { ResearchDashboard } from "@/components/research-dashboard";

export default function ResearchPage() {
  return (
    <RouteShell
      eyebrow="Research workspace · Presentation preview"
      title="Evidence before inference."
      description="A visual preview of the cohort workspace using illustrative data."
    >
      <ResearchDashboard />
    </RouteShell>
  );
}
