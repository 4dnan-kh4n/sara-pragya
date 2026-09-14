"use client";

import { useState } from "react";

import type { AnalysisRequest, DocumentKind, VerifiedDocument } from "@/lib/api";
import { returnToAssessmentTop } from "@/lib/assessment-navigation";
import { PrakritiVikritiAssessment } from "./prakriti-vikriti-assessment";
import { SarataAssessment } from "./sarata-assessment";
import { SymptomsHistoryForm, type History } from "./symptoms-history-form";
import { ExaminationUpload } from "./examination-upload";
import { LaboratoryUpload } from "./laboratory-upload";
import { PhysiologyUpload } from "./physiology-upload";
import { InputReview } from "./input-review";
import { AnalysisWorkspace } from "./analysis-workspace";
import { AnalysisReport } from "./analysis-report";

type AssessmentStage = "sarata" | "dosha" | "symptoms" | "examination" | "laboratory" | "physiology" | "review" | "analysis" | "report";

export function AssessmentWorkspace() {
  const [stage, setStage] = useState<AssessmentStage>("sarata");
  const [analysisRequest, setAnalysisRequest] = useState<Partial<AnalysisRequest>>({ documents: [] });
  const [analysisResult, setAnalysisResult] = useState<import("@/lib/api").AnalysisResponse | null>(null);
  const moveTo = (nextStage: AssessmentStage) => {
    returnToAssessmentTop();
    setStage(nextStage);
  };
  const saveHistory = (history: History) => {
    setAnalysisRequest((current) => ({
      ...current,
      clinical_history: {
        chief_complaint: history.chiefComplaint,
        duration: history.duration,
        presenting_symptoms: history.presentingSymptoms,
        associated_symptoms: history.associatedSymptoms,
        relevant_history: history.relevantHistory,
        notes: history.notes,
      },
    }));
    moveTo("examination");
  };
  const saveDocument = (document: VerifiedDocument, nextStage: AssessmentStage) => {
    returnToAssessmentTop();
    setAnalysisRequest((current) => ({
      ...current,
      documents: [...(current.documents ?? []).filter((item) => item.kind !== document.kind), document],
    }));
    setStage(nextStage);
  };
  const documentFor = (kind: DocumentKind) => analysisRequest.documents?.find((item) => item.kind === kind);
  if (stage === "sarata") return <SarataAssessment onContinue={(profile) => { returnToAssessmentTop(); setAnalysisRequest((current) => ({ ...current, sarata_profile: profile })); setStage("dosha"); }} />;
  if (stage === "dosha") return <PrakritiVikritiAssessment onBack={() => moveTo("sarata")} onContinue={(result) => { returnToAssessmentTop(); setAnalysisRequest((current) => ({ ...current, prakriti_pattern: result.prakritiPattern, vikriti_profile: result.vikritiProfile })); setStage("symptoms"); }} />;
  if (stage === "symptoms") return <SymptomsHistoryForm onBack={() => moveTo("dosha")} onContinue={saveHistory} />;
  if (stage === "examination") return <ExaminationUpload initialDocument={documentFor("examination")} onBack={() => moveTo("symptoms")} onContinue={(document) => saveDocument(document, "laboratory")} />;
  if (stage === "laboratory") return <LaboratoryUpload initialDocument={documentFor("laboratory")} onBack={() => moveTo("examination")} onContinue={(document) => saveDocument(document, "physiology")} />;
  if (stage === "physiology") return <PhysiologyUpload initialDocument={documentFor("physiology")} onBack={() => moveTo("laboratory")} onContinue={(document) => saveDocument(document, "review")} />;
  if (stage === "review") return <InputReview documents={analysisRequest.documents ?? []} onContinue={() => moveTo("analysis")} onEdit={moveTo} />;
  if (stage === "analysis") return <AnalysisWorkspace assessment={isAnalysisRequest(analysisRequest) ? analysisRequest : null} onBack={() => moveTo("review")} onViewReport={(result) => { returnToAssessmentTop(); setAnalysisResult(result); setStage("report"); }} />;
  return isAnalysisRequest(analysisRequest) && analysisResult
    ? <AnalysisReport assessment={analysisRequest} onBack={() => moveTo("analysis")} result={analysisResult} />
    : <AnalysisWorkspace assessment={isAnalysisRequest(analysisRequest) ? analysisRequest : null} onBack={() => moveTo("review")} onViewReport={(result) => { returnToAssessmentTop(); setAnalysisResult(result); setStage("report"); }} />;
}

function isAnalysisRequest(value: Partial<AnalysisRequest>): value is AnalysisRequest {
  return Boolean(value.sarata_profile && value.prakriti_pattern && value.vikriti_profile && value.clinical_history && value.documents);
}
