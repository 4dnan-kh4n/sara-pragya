import { describe, expect, it } from "vitest";

import { calculateSarataProfile, dhatus, sarataQuestions } from "@/lib/sarata-questions";

describe("Sāratā scoring configuration", () => {
  it("contains two transparent questions for each configured Dhātu domain", () => {
    expect(sarataQuestions).toHaveLength(14);

    for (const dhatu of dhatus) {
      expect(sarataQuestions.filter((question) => question.dhatu === dhatu)).toHaveLength(2);
    }
  });

  it("derives the profile solely from selected option scores", () => {
    const answers = Object.fromEntries(sarataQuestions.map((question) => [question.id, question.options.at(-1)?.id]));
    const profile = calculateSarataProfile(answers);

    expect(profile).toHaveLength(7);
    expect(profile.every((item) => item.score === item.maximum && item.percentage === 100)).toBe(true);
  });

  it("does not assign scores to unanswered questions", () => {
    const profile = calculateSarataProfile({});

    expect(profile.every((item) => item.score === 0 && item.percentage === 0)).toBe(true);
  });
});
