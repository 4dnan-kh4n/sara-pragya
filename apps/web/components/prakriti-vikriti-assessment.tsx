"use client";

import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

import { calculateDoshaProfile, classifyPrakriti, prakritiQuestions, vikritiQuestions, type DoshaAnswers, type DoshaQuestion } from "@/lib/dosha-assessment";
import { returnToAssessmentTop } from "@/lib/assessment-navigation";

type Stage = "prakriti" | "vikriti" | "result";
type DoshaAnalysisInput = { prakritiPattern: string; vikritiProfile: ReturnType<typeof calculateDoshaProfile> };

export function PrakritiVikritiAssessment({ onBack, onContinue }: { onBack?: () => void; onContinue?: (result: DoshaAnalysisInput) => void }) {
  const [stage, setStage] = useState<Stage>("prakriti");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [prakritiAnswers, setPrakritiAnswers] = useState<DoshaAnswers>({});
  const [vikritiAnswers, setVikritiAnswers] = useState<DoshaAnswers>({});
  const questions = stage === "prakriti" ? prakritiQuestions : vikritiQuestions;
  const answers = stage === "prakriti" ? prakritiAnswers : vikritiAnswers;
  const setAnswers = stage === "prakriti" ? setPrakritiAnswers : setVikritiAnswers;
  const question = questions[questionIndex];
  const profile = useMemo(() => calculateDoshaProfile(vikritiQuestions, vikritiAnswers), [vikritiAnswers]);

  const next = () => {
    if (!answers[question.id]) return;
    if (questionIndex < questions.length - 1) { setQuestionIndex((current) => current + 1); return; }
    if (stage === "prakriti") { returnToAssessmentTop(); setStage("vikriti"); setQuestionIndex(0); return; }
    returnToAssessmentTop();
    setStage("result");
  };

  const restart = () => { returnToAssessmentTop(); setStage("prakriti"); setQuestionIndex(0); setPrakritiAnswers({}); setVikritiAnswers({}); };

  if (stage === "result") {
    return <section className="assessment-workspace" aria-labelledby="dosha-results-title">
      <div className="assessment-profile-heading"><h2 id="dosha-results-title">Recorded observation profile</h2><div className="assessment-profile-actions">{onBack && <button className="assessment-restart" onClick={onBack} type="button"><ArrowLeft aria-hidden="true" /> Back to Sāratā</button>}<button className="assessment-restart" onClick={restart} type="button"><RotateCcw aria-hidden="true" /> Start again</button>{onContinue && <button className="button button-primary" onClick={() => onContinue({ prakritiPattern: classifyPrakriti(prakritiQuestions, prakritiAnswers), vikritiProfile: profile })} type="button">Continue to symptoms <ArrowRight aria-hidden="true" /></button>}</div></div>
      <p className="assessment-context-note">This is a transparent record of selected patterns. It is not a diagnosis or a validated clinical classification.</p>
      <div className="dosha-result-summary"><span>Preliminary Prakṛti pattern</span><strong>{classifyPrakriti(prakritiQuestions, prakritiAnswers)}</strong></div>
      <h3 className="dosha-results-heading">Current Vikṛti observation profile</h3>
      <div className="sarata-profile-list" aria-label="Current Vikṛti score profile">{profile.map((item) => <article className="sarata-profile-row" key={item.dosha}><div className="sarata-profile-label"><strong>{item.dosha}</strong><span>{item.score} points</span></div><div aria-label={`${item.dosha}: ${item.percentage}%`} aria-valuemax={100} aria-valuemin={0} aria-valuenow={item.percentage} className="sarata-score-track" role="progressbar"><span style={{ width: `${item.percentage}%` }} /></div><output>{item.percentage}%</output></article>)}</div>
    </section>;
  }

  const isPrakriti = stage === "prakriti";
  const title = isPrakriti ? "Long-term Prakṛti observations" : "Current Vikṛti observations";
  const guidance = isPrakriti
    ? "Choose the pattern most consistent across adult life. Do not base this section on temporary symptoms."
    : "Choose the pattern most noticeable in the current period. Record the closest observation without inferring a diagnosis.";
  const count = Object.keys(answers).length;
  return <section className="assessment-workspace" aria-labelledby="dosha-assessment-heading">
    <div className="assessment-topline"><div><span className="assessment-kicker">Assessment {isPrakriti ? "02" : "03"} of 09</span><h2 id="dosha-assessment-heading">{title}</h2></div><span className="assessment-draft-status">{count} of {questions.length} recorded</span></div>
    <p className="assessment-context-note">{guidance}</p>
    <div aria-label={`Question ${questionIndex + 1} of ${questions.length}`} aria-valuemax={questions.length} aria-valuemin={0} aria-valuenow={questionIndex + 1} className="assessment-progress" role="progressbar"><span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div>
    <QuestionCard answers={answers} backLabel={questionIndex === 0 && stage === "prakriti" ? "Back to Sāratā" : "Back"} canBack={questionIndex > 0 || stage === "vikriti" || Boolean(onBack)} onBack={() => {
      if (questionIndex > 0) { setQuestionIndex((current) => current - 1); return; }
      if (stage === "vikriti") { setStage("prakriti"); setQuestionIndex(prakritiQuestions.length - 1); return; }
      onBack?.();
    }} onNext={next} onSelect={(optionId) => setAnswers((current) => ({ ...current, [question.id]: optionId }))} question={question} questionIndex={questionIndex} total={questions.length} />
  </section>;
}

function QuestionCard({ answers, backLabel, canBack, onBack, onNext, onSelect, question, questionIndex, total }: { answers: DoshaAnswers; backLabel: string; canBack: boolean; onBack: () => void; onNext: () => void; onSelect: (optionId: string) => void; question: DoshaQuestion; questionIndex: number; total: number }) {
  const answered = Boolean(answers[question.id]);
  return <form onSubmit={(event) => { event.preventDefault(); onNext(); }}><fieldset className="assessment-question"><legend><span>{String(questionIndex + 1).padStart(2, "0")}</span>Question {questionIndex + 1}</legend><h3>{question.prompt}</h3><p className="question-helper">Select the closest documented pattern. If information is uncertain, use the option that explicitly says it is not known or not assessable.</p><div className="assessment-options">{question.options.map((option) => <label className={answers[question.id] === option.id ? "assessment-option is-selected" : "assessment-option"} key={option.id}><input checked={answers[question.id] === option.id} name={question.id} onChange={() => onSelect(option.id)} type="radio" value={option.id} /><span className="assessment-option-indicator" aria-hidden="true" /><span>{option.label}</span></label>)}</div><div className="assessment-actions"><button className="button button-secondary" disabled={!canBack} onClick={onBack} type="button"><ArrowLeft aria-hidden="true" /> {backLabel}</button><button className="button button-primary" disabled={!answered} type="submit">{questionIndex === total - 1 ? "Review profile" : "Next observation"}<ArrowRight aria-hidden="true" /></button></div></fieldset></form>;
}
