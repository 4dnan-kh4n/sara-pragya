import { describe, expect, it } from "vitest";

import { calculateDoshaProfile, classifyPrakriti, prakritiQuestions } from "@/lib/dosha-assessment";

describe("Prakṛti and Vikṛti scoring", () => {
  it("supports the seven broad Prakṛti outcomes", () => {
    const vata = Object.fromEntries(prakritiQuestions.map((question) => [question.id, "vata"]));
    const pitta = Object.fromEntries(prakritiQuestions.map((question) => [question.id, "pitta"]));
    const kapha = Object.fromEntries(prakritiQuestions.map((question) => [question.id, "kapha"]));

    expect(classifyPrakriti(prakritiQuestions, vata)).toBe("Vāta");
    expect(classifyPrakriti(prakritiQuestions, pitta)).toBe("Pitta");
    expect(classifyPrakriti(prakritiQuestions, kapha)).toBe("Kapha");

    const mixed = (choices: string[]) => Object.fromEntries(prakritiQuestions.map((question, index) => [question.id, choices[index]]));
    expect(classifyPrakriti(prakritiQuestions, mixed(["vata", "vata", "vata", "pitta", "pitta", "pitta", "kapha"]))).toBe("Vāta-Pitta");
    expect(classifyPrakriti(prakritiQuestions, mixed(["vata", "vata", "vata", "kapha", "kapha", "kapha", "pitta"]))).toBe("Vāta-Kapha");
    expect(classifyPrakriti(prakritiQuestions, mixed(["pitta", "pitta", "pitta", "kapha", "kapha", "kapha", "vata"]))).toBe("Pitta-Kapha");
    expect(classifyPrakriti(prakritiQuestions, mixed(["vata", "vata", "vata", "pitta", "pitta", "kapha", "kapha"]))).toBe("Sama / Tridoṣa");
  });

  it("keeps unanswered profiles at zero", () => {
    expect(calculateDoshaProfile(prakritiQuestions, {}).every((item) => item.score === 0)).toBe(true);
  });
});
