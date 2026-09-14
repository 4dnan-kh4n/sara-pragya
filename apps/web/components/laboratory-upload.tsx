import type { VerifiedDocument } from "@/lib/api";
import { DocumentUpload } from "./document-upload";

export function LaboratoryUpload({ onBack, onContinue, initialDocument }: {
  onBack?: () => void;
  onContinue?: (document: VerifiedDocument) => void;
  initialDocument?: VerifiedDocument;
}) {
  return <DocumentUpload backLabel="← Back to examination" continueLabel="Continue to physiology" initialDocument={initialDocument} kind="laboratory" onBack={onBack} onContinue={onContinue ?? (() => {})} stageNumber="06" title="Laboratory Parameters" uploadLabel="Upload laboratory PDF" />;
}
