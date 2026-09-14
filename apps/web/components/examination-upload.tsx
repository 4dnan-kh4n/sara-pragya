import type { VerifiedDocument } from "@/lib/api";
import { DocumentUpload } from "./document-upload";

export function ExaminationUpload({ onBack, onContinue, initialDocument }: {
  onBack?: () => void;
  onContinue?: (document: VerifiedDocument) => void;
  initialDocument?: VerifiedDocument;
}) {
  return <DocumentUpload backLabel="← Back to history" continueLabel="Continue to laboratory" initialDocument={initialDocument} kind="examination" onBack={onBack} onContinue={onContinue ?? (() => {})} stageNumber="05" title="Examination Findings" uploadLabel="Upload examination PDF" />;
}
