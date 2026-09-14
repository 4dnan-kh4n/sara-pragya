export const doshas = ["Vāta", "Pitta", "Kapha"] as const;
export type Dosha = (typeof doshas)[number];

export type DoshaOption = { id: string; label: string; scores: Record<Dosha, number> };
export type DoshaQuestion = { id: string; prompt: string; options: DoshaOption[] };
export type DoshaAnswers = Record<string, string | undefined>;

const score = (dosha: Dosha): Record<Dosha, number> => ({
  Vāta: dosha === "Vāta" ? 2 : 0,
  Pitta: dosha === "Pitta" ? 2 : 0,
  Kapha: dosha === "Kapha" ? 2 : 0,
});

export const prakritiQuestions: DoshaQuestion[] = [
  { id: "build", prompt: "Which lifelong body-build tendency fits best?", options: [
    { id: "vata", label: "Light or variable build", scores: score("Vāta") }, { id: "pitta", label: "Moderate, balanced build", scores: score("Pitta") }, { id: "kapha", label: "Broad or steady build", scores: score("Kapha") },
  ] },
  { id: "appetite", prompt: "Which lifelong appetite pattern fits best?", options: [
    { id: "vata", label: "Variable appetite and meal timing", scores: score("Vāta") }, { id: "pitta", label: "Strong, regular appetite", scores: score("Pitta") }, { id: "kapha", label: "Steady appetite with slower hunger", scores: score("Kapha") },
  ] },
  { id: "activity", prompt: "Which lifelong activity style fits best?", options: [
    { id: "vata", label: "Quick, changeable activity", scores: score("Vāta") }, { id: "pitta", label: "Focused, purposeful activity", scores: score("Pitta") }, { id: "kapha", label: "Steady, unhurried activity", scores: score("Kapha") },
  ] },
  { id: "sleep", prompt: "Which lifelong sleep tendency fits best?", options: [
    { id: "vata", label: "Light or easily interrupted sleep", scores: score("Vāta") }, { id: "pitta", label: "Moderate, regular sleep", scores: score("Pitta") }, { id: "kapha", label: "Deep or longer sleep", scores: score("Kapha") },
  ] },
  { id: "temperature", prompt: "Which climate preference has been most consistent over time?", options: [
    { id: "vata", label: "Prefers warmth and dislikes cold", scores: score("Vāta") }, { id: "pitta", label: "Prefers cool conditions and dislikes heat", scores: score("Pitta") }, { id: "kapha", label: "Prefers warmth and dryness", scores: score("Kapha") },
  ] },
  { id: "skin", prompt: "Which long-term skin and hair tendency fits best?", options: [
    { id: "vata", label: "Often dry or rough", scores: score("Vāta") }, { id: "pitta", label: "Often warm or sensitive", scores: score("Pitta") }, { id: "kapha", label: "Often soft or naturally oily", scores: score("Kapha") },
  ] },
  { id: "temperament", prompt: "Which general temperament fits best over the long term?", options: [
    { id: "vata", label: "Quick, imaginative, adaptable", scores: score("Vāta") }, { id: "pitta", label: "Focused, driven, decisive", scores: score("Pitta") }, { id: "kapha", label: "Calm, patient, steady", scores: score("Kapha") },
  ] },
];

export const vikritiQuestions: DoshaQuestion[] = [
  { id: "current-comfort", prompt: "Which current pattern is most noticeable?", options: [
    { id: "vata", label: "Dryness, restlessness, or variability", scores: score("Vāta") }, { id: "pitta", label: "Heat, intensity, or irritability", scores: score("Pitta") }, { id: "kapha", label: "Heaviness, sluggishness, or congestion", scores: score("Kapha") },
  ] },
  { id: "current-digestion", prompt: "Which current digestive tendency is most noticeable?", options: [
    { id: "vata", label: "Irregularity or fluctuation", scores: score("Vāta") }, { id: "pitta", label: "Strong hunger or heat-related discomfort", scores: score("Pitta") }, { id: "kapha", label: "Slowness or heaviness after meals", scores: score("Kapha") },
  ] },
  { id: "current-energy", prompt: "Which current energy pattern fits best?", options: [
    { id: "vata", label: "Variable energy or easy fatigue", scores: score("Vāta") }, { id: "pitta", label: "High drive with difficulty winding down", scores: score("Pitta") }, { id: "kapha", label: "Low drive or prolonged inertia", scores: score("Kapha") },
  ] },
  { id: "current-sleep", prompt: "Which current sleep pattern fits best?", options: [
    { id: "vata", label: "Light, interrupted, or reduced sleep", scores: score("Vāta") }, { id: "pitta", label: "Sleep disrupted by warmth or mental intensity", scores: score("Pitta") }, { id: "kapha", label: "Excessive sleepiness or oversleeping", scores: score("Kapha") },
  ] },
  { id: "current-mood", prompt: "Which current emotional tendency is most noticeable?", options: [
    { id: "vata", label: "Worry, restlessness, or rapid shifts", scores: score("Vāta") }, { id: "pitta", label: "Irritability, frustration, or impatience", scores: score("Pitta") }, { id: "kapha", label: "Low motivation, attachment, or withdrawal", scores: score("Kapha") },
  ] },
  { id: "current-movement", prompt: "Which current movement tendency fits best?", options: [
    { id: "vata", label: "Restless, scattered, or inconsistent", scores: score("Vāta") }, { id: "pitta", label: "Driven, intense, or hurried", scores: score("Pitta") }, { id: "kapha", label: "Slow, heavy, or resistant to movement", scores: score("Kapha") },
  ] },
];

export function calculateDoshaProfile(questions: DoshaQuestion[], answers: DoshaAnswers) {
  const totals = Object.fromEntries(doshas.map((dosha) => [dosha, 0])) as Record<Dosha, number>;
  for (const question of questions) {
    const selected = question.options.find((option) => option.id === answers[question.id]);
    if (!selected) continue;
    for (const dosha of doshas) totals[dosha] += selected.scores[dosha];
  }
  const maximum = questions.length * 2;
  return doshas.map((dosha) => ({ dosha, score: totals[dosha], percentage: Math.round((totals[dosha] / maximum) * 100) }));
}

export function classifyPrakriti(questions: DoshaQuestion[], answers: DoshaAnswers) {
  const profile = calculateDoshaProfile(questions, answers).sort((a, b) => b.score - a.score);
  const [first, second, third] = profile;
  if (first.score - third.score <= 2) return "Sama / Tridoṣa";
  if (first.score - second.score <= 2) return `${first.dosha}-${second.dosha}`;
  return first.dosha;
}
