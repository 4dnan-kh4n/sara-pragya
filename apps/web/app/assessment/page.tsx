import { RouteShell } from "@/components/route-shell";
import { AssessmentWorkspace } from "@/components/assessment-workspace";

export default function AssessmentPage() {
  return (
    <RouteShell
      eyebrow="Clinical workspace · Phase 3"
      contextId="assessment-context"
      title="Dhātu Sāratā Assessment"
    >
      <div className="container"><AssessmentWorkspace /></div>
    </RouteShell>
  );
}
