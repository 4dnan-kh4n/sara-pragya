import type { VerifiedDocument } from "@/lib/api";
import { DocumentUpload } from "./document-upload";

export function PhysiologyUpload({ onBack, onContinue, initialDocument }: {
  onBack?: () => void;
  onContinue?: (document: VerifiedDocument) => void;
  initialDocument?: VerifiedDocument;
}) {
  return <DocumentUpload backLabel="← Back to laboratory" continueLabel="Review assessment" initialDocument={initialDocument} kind="physiology" onBack={onBack} onContinue={onContinue ?? (() => {})} stageNumber="07" title="Physiological Measurements" uploadLabel="Upload physiology PDF" />;
}
