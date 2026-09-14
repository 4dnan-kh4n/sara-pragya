"use client";

import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  calculateSarataProfile,
  sarataQuestions,
  type SarataAnswers,
} from "@/lib/sarata-questions";
import { returnToAssessmentTop } from "@/lib/assessment-navigation";

const STORAGE_KEY = "sara-pragya:sarata-draft:v1";
const EMPTY_DRAFT: StoredDraft = { answers: {}, currentQuestion: 0 };

type StoredDraft = {
  answers: SarataAnswers;
  currentQuestion: number;
};

function readStoredDraft(): StoredDraft {
  if (typeof window === "undefined") return EMPTY_DRAFT;

  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return EMPTY_DRAFT;

    const draft = JSON.parse(stored) as StoredDraft;
    if (draft.answers && Number.isInteger(draft.currentQuestion)) {
      return {
        answers: draft.answers,
        currentQuestion: Math.min(Math.max(draft.currentQuestion, 0), sarataQuestions.length - 1),
      };
    }
  } catch {
    // An unavailable or malformed draft must never prevent an assessment from starting.
  }

  return EMPTY_DRAFT;
}

export function SarataAssessment({ onContinue }: { onContinue?: (profile: ReturnType<typeof calculateSarataProfile>) => void }) {
  const [draft, setDraft] = useState<StoredDraft>(EMPTY_DRAFT);
  const [isDraftRestored, setIsDraftRestored] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { answers, currentQuestion } = draft;
  const question = sarataQuestions[currentQuestion];
  const completedCount = Object.keys(answers).length;
  const isCurrentAnswered = Boolean(answers[question.id]);
  const profile = useMemo(() => calculateSarataProfile(answers), [answers]);

  useEffect(() => {
    setDraft(readStoredDraft());
    setIsDraftRestored(true);
  }, []);

  useEffect(() => {
    if (!isDraftRestored || showProfile) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // The questionnaire remains usable if the browser declines session storage.
    }
  }, [draft, isDraftRestored, showProfile]);

  const selectAnswer = (optionId: string) => {
    setDraft((current) => ({ ...current, answers: { ...current.answers, [question.id]: optionId } }));
  };

  const next = () => {
    if (!isCurrentAnswered) return;
    if (currentQuestion === sarataQuestions.length - 1) {
      returnToAssessmentTop();
      setShowProfile(true);
      try { window.sessionStorage.removeItem(STORAGE_KEY); } catch {}
      return;
    }
    setDraft((current) => ({ ...current, currentQuestion: current.currentQuestion + 1 }));
  };

  const restart = () => {
    returnToAssessmentTop();
    setDraft({ answers: {}, currentQuestion: 0 });
    setShowProfile(false);
    try { window.sessionStorage.removeItem(STORAGE_KEY); } catch {}
  };

  if (showProfile) {
    return (
      <section aria-labelledby="sarata-profile-title" className="assessment-workspace">
        <div className="assessment-profile-heading">
          <div>
            <h2 id="sarata-profile-title">Preliminary recorded Sāratā profile</h2>
          </div>
          <div className="assessment-profile-actions">
            <button className="assessment-restart" onClick={restart} type="button"><RotateCcw aria-hidden="true" /> Start again</button>
            {onContinue && <button className="button button-primary" onClick={() => onContinue(profile)} type="button">Continue to Prakṛti <ArrowRight aria-hidden="true" /></button>}
          </div>
        </div>

        <div aria-label="Dhātu Sāratā profile" className="sarata-profile-list">
          {profile.map((item) => (
            <article className="sarata-profile-row" key={item.dhatu}>
              <div className="sarata-profile-label"><strong>{item.dhatu}</strong><span>{item.score} of {item.maximum} observed points</span></div>
              <div aria-label={`${item.dhatu}: ${item.percentage}% of observation points`} aria-valuemax={100} aria-valuemin={0} aria-valuenow={item.percentage} className="sarata-score-track" role="progressbar">
                <span style={{ width: `${item.percentage}%` }} />
              </div>
              <output>{item.percentage}%</output>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="sarata-assessment-heading" className="assessment-workspace">
      <div className="assessment-topline">
        <div>
          <span className="assessment-kicker">Assessment 01 of 09</span>
          <h2 id="sarata-assessment-heading">Dhātu Sāratā observations</h2>
        </div>
        <span className="assessment-draft-status">{completedCount} of {sarataQuestions.length} recorded</span>
      </div>
      <p className="assessment-context-note">Record what is observed or reported in this encounter. The selected points are research observations, not diagnostic scores.</p>

      <div aria-label={`Question ${currentQuestion + 1} of ${sarataQuestions.length}`} aria-valuemax={sarataQuestions.length} aria-valuemin={0} aria-valuenow={currentQuestion + 1} className="assessment-progress" role="progressbar">
        <span style={{ width: `${((currentQuestion + 1) / sarataQuestions.length) * 100}%` }} />
      </div>

      <form onSubmit={(event) => { event.preventDefault(); next(); }}>
        <fieldset className="assessment-question">
          <legend><span>{String(currentQuestion + 1).padStart(2, "0")}</span>{question.dhatu} Sāratā</legend>
          <h3>{question.prompt}</h3>
          <p className="question-helper">{question.helper}</p>
          <div className="assessment-options">
            {question.options.map((option) => {
              const checked = answers[question.id] === option.id;
              return (
                <label className={checked ? "assessment-option is-selected" : "assessment-option"} key={option.id}>
                  <input checked={checked} name={question.id} onChange={() => selectAnswer(option.id)} type="radio" value={option.id} />
                  <span className="assessment-option-indicator" aria-hidden="true" />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
          <div className="assessment-actions">
            <button className="button button-secondary" disabled={currentQuestion === 0} onClick={() => setDraft((current) => ({ ...current, currentQuestion: Math.max(0, current.currentQuestion - 1) }))} type="button"><ArrowLeft aria-hidden="true" /> Back</button>
            <button className="button button-primary" disabled={!isCurrentAnswered} type="submit">{currentQuestion === sarataQuestions.length - 1 ? "Review profile" : "Next"}<ArrowRight aria-hidden="true" /></button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
