export const dhatus = ["Rasa", "Rakta", "Māṃsa", "Meda", "Asthi", "Majjā", "Śukra"] as const;

export type Dhatu = (typeof dhatus)[number];

export type SarataOption = {
  id: string;
  label: string;
  score: number;
};

export type SarataQuestion = {
  id: string;
  dhatu: Dhatu;
  prompt: string;
  helper: string;
  options: SarataOption[];
};

/**
 * Research draft based on the Dhātu Sāratā domains described in classical
 * Ayurvedic literature. This is intentionally a clinician-reviewed instrument,
 * not a validated diagnostic or prognostic scale.
 */
export const sarataQuestions: SarataQuestion[] = [
  {
    id: "rasa-skin-moisture",
    dhatu: "Rasa",
    prompt: "How would you record the observed skin moisture and general suppleness?",
    helper: "Record the observation after routine clinical examination; do not infer a disease state.",
    options: [
      { id: "minimal", label: "Markedly reduced or difficult to assess", score: 0 },
      { id: "variable", label: "Variable or mildly reduced", score: 1 },
      { id: "adequate", label: "Generally adequate", score: 2 },
      { id: "well-maintained", label: "Well maintained and consistent", score: 3 },
    ],
  },
  {
    id: "rasa-voice-comfort",
    dhatu: "Rasa",
    prompt: "How would you record ease and clarity of the person’s voice during the encounter?",
    helper: "Use the current observation only. This is a classical observation domain, not a voice diagnosis.",
    options: [
      { id: "markedly-limited", label: "Markedly limited or not assessable", score: 0 },
      { id: "variable", label: "Variable", score: 1 },
      { id: "usually-clear", label: "Usually clear and comfortable", score: 2 },
      { id: "consistently-clear", label: "Consistently clear and comfortable", score: 3 },
    ],
  },
  {
    id: "rakta-complexion",
    dhatu: "Rakta",
    prompt: "How would you record the observed complexion and colour uniformity?",
    helper: "Record appearance descriptively. Laboratory values are assessed separately later in the pathway.",
    options: [
      { id: "notable-variation", label: "Notable variation or difficult to assess", score: 0 },
      { id: "some-variation", label: "Some variation", score: 1 },
      { id: "generally-even", label: "Generally even", score: 2 },
      { id: "even-lustrous", label: "Even and naturally lustrous", score: 3 },
    ],
  },
  {
    id: "rakta-sensory-comfort",
    dhatu: "Rakta",
    prompt: "How would you record the person’s reported comfort with heat and sun exposure?",
    helper: "This is a contextual history observation. It does not establish sensitivity, allergy, or disease.",
    options: [
      { id: "frequently-uncomfortable", label: "Frequently uncomfortable or not known", score: 0 },
      { id: "occasionally-uncomfortable", label: "Occasionally uncomfortable", score: 1 },
      { id: "usually-comfortable", label: "Usually comfortable", score: 2 },
      { id: "consistently-comfortable", label: "Consistently comfortable", score: 3 },
    ],
  },
  {
    id: "mamsa-muscle-development",
    dhatu: "Māṃsa",
    prompt: "How would you record visible muscle development relative to the individual’s build?",
    helper: "Describe the current observation only; do not substitute this item for strength or nutrition testing.",
    options: [
      { id: "limited", label: "Limited or difficult to assess", score: 0 },
      { id: "modest", label: "Modest", score: 1 },
      { id: "proportionate", label: "Generally proportionate", score: 2 },
      { id: "well-developed", label: "Well developed and proportionate", score: 3 },
    ],
  },
  {
    id: "mamsa-physical-endurance",
    dhatu: "Māṃsa",
    prompt: "How would you record the person’s reported ability to sustain usual daily physical activity?",
    helper: "Record self-report in the present context. Formal functional testing, when available, is captured separately.",
    options: [
      { id: "substantially-limited", label: "Substantially limited or not known", score: 0 },
      { id: "some-limitation", label: "Some limitation", score: 1 },
      { id: "usual-activity", label: "Can sustain usual activity", score: 2 },
      { id: "sustained-activity", label: "Can sustain usual activity with ease", score: 3 },
    ],
  },
  {
    id: "meda-body-fullness",
    dhatu: "Meda",
    prompt: "How would you record body fullness and soft-tissue distribution relative to the individual’s build?",
    helper: "Use neutral descriptive language. This item is not a body-composition measurement.",
    options: [
      { id: "limited", label: "Limited or difficult to assess", score: 0 },
      { id: "slight", label: "Slight", score: 1 },
      { id: "proportionate", label: "Generally proportionate", score: 2 },
      { id: "well-maintained", label: "Well maintained and proportionate", score: 3 },
    ],
  },
  {
    id: "meda-skin-lubrication",
    dhatu: "Meda",
    prompt: "How would you record the observed natural lubrication or softness of the skin?",
    helper: "Record a clinician’s observation; do not infer endocrine, nutritional, or dermatological status.",
    options: [
      { id: "markedly-reduced", label: "Markedly reduced or difficult to assess", score: 0 },
      { id: "variable", label: "Variable or mildly reduced", score: 1 },
      { id: "adequate", label: "Generally adequate", score: 2 },
      { id: "well-maintained", label: "Well maintained and consistent", score: 3 },
    ],
  },
  {
    id: "asthi-frame",
    dhatu: "Asthi",
    prompt: "How would you record the apparent stability of the frame, joints, and teeth on routine observation?",
    helper: "This is not a substitute for dental, musculoskeletal, or bone-density evaluation.",
    options: [
      { id: "concern-or-unknown", label: "Concern noted or not assessable", score: 0 },
      { id: "variable", label: "Variable", score: 1 },
      { id: "generally-stable", label: "Generally stable", score: 2 },
      { id: "consistently-stable", label: "Consistently stable on routine observation", score: 3 },
    ],
  },
  {
    id: "asthi-nail-hair",
    dhatu: "Asthi",
    prompt: "How would you record the general appearance of nails and hair?",
    helper: "Document the observation only. If indicated, use appropriate clinical examination and testing.",
    options: [
      { id: "fragile-or-unknown", label: "Fragile, markedly variable, or not assessable", score: 0 },
      { id: "some-variation", label: "Some variation", score: 1 },
      { id: "generally-maintained", label: "Generally maintained", score: 2 },
      { id: "well-maintained", label: "Well maintained and consistent", score: 3 },
    ],
  },
  {
    id: "majja-vitality",
    dhatu: "Majjā",
    prompt: "How would you record the person’s reported day-to-day sense of vitality?",
    helper: "This is a subjective report, not a neurological, hematological, or mental-health assessment.",
    options: [
      { id: "markedly-reduced", label: "Markedly reduced or not known", score: 0 },
      { id: "variable", label: "Variable", score: 1 },
      { id: "usually-present", label: "Usually present", score: 2 },
      { id: "consistently-present", label: "Consistently present", score: 3 },
    ],
  },
  {
    id: "majja-comfort",
    dhatu: "Majjā",
    prompt: "How would you record general comfort and steadiness in routine activities?",
    helper: "Record current self-report and observation. Escalate relevant symptoms through appropriate clinical care.",
    options: [
      { id: "often-limited", label: "Often limited or not known", score: 0 },
      { id: "occasionally-limited", label: "Occasionally limited", score: 1 },
      { id: "generally-steady", label: "Generally steady", score: 2 },
      { id: "consistently-steady", label: "Consistently steady", score: 3 },
    ],
  },
  {
    id: "shukra-recovery",
    dhatu: "Śukra",
    prompt: "How would you record the person’s self-reported recovery after usual daily exertion?",
    helper: "This broad wellbeing observation is not a fertility, sexual-health, or reproductive assessment.",
    options: [
      { id: "prolonged-or-unknown", label: "Prolonged recovery or not known", score: 0 },
      { id: "variable", label: "Variable recovery", score: 1 },
      { id: "usually-recovers", label: "Usually recovers as expected", score: 2 },
      { id: "consistently-recovers", label: "Consistently recovers with ease", score: 3 },
    ],
  },
  {
    id: "shukra-general-wellbeing",
    dhatu: "Śukra",
    prompt: "How would you record the person’s overall sense of wellbeing in the present period?",
    helper: "Record only what is reported. Do not use this question to infer any diagnosis or reproductive status.",
    options: [
      { id: "markedly-reduced", label: "Markedly reduced or not known", score: 0 },
      { id: "variable", label: "Variable", score: 1 },
      { id: "generally-positive", label: "Generally positive", score: 2 },
      { id: "consistently-positive", label: "Consistently positive", score: 3 },
    ],
  },
];

export type SarataAnswers = Record<string, string | undefined>;

export function calculateSarataProfile(answers: SarataAnswers) {
  const scores = Object.fromEntries(dhatus.map((dhatu) => [dhatu, 0])) as Record<Dhatu, number>;
  const maximums = Object.fromEntries(dhatus.map((dhatu) => [dhatu, 0])) as Record<Dhatu, number>;

  for (const question of sarataQuestions) {
    maximums[question.dhatu] += Math.max(...question.options.map((option) => option.score));
    const option = question.options.find((candidate) => candidate.id === answers[question.id]);
    if (option) scores[question.dhatu] += option.score;
  }

  return dhatus.map((dhatu) => ({
    dhatu,
    score: scores[dhatu],
    maximum: maximums[dhatu],
    percentage: maximums[dhatu] === 0 ? 0 : Math.round((scores[dhatu] / maximums[dhatu]) * 100),
  }));
}
