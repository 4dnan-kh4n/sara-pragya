import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AnalysisReport } from "@/components/analysis-report";

describe("research report", () => {
  it("keeps recorded scores separate from unestablished correlations", () => {
    render(<AnalysisReport assessment={{
      sarata_profile: [{ dhatu: "Rasa", score: 2, maximum: 4, percentage: 50 }],
      prakriti_pattern: "Vata",
      vikriti_profile: [{ dosha: "Vata", score: 2, percentage: 50 }],
      clinical_history: { chief_complaint: "Example", duration: "One week", presenting_symptoms: "Example", associated_symptoms: "", relevant_history: "", notes: "" },
      documents: [],
    }} onBack={() => undefined} result={{
      model: "gpt-5",
      result: { summary: "Research summary", observations: ["Observed pattern"], research_focus: ["Review context"] },
    }} />);

    expect(screen.getByRole("heading", { name: "Assessment insight" })).toBeVisible();
    expect(screen.getByRole("cell", { name: "2 / 4" })).toBeVisible();
    expect(screen.getByText(/correlation evidence is not established/i)).toBeVisible();
    expect(screen.getByText(/no validated risk thresholds/i)).toBeVisible();
    expect(screen.getByRole("button", { name: "Download PDF" })).toBeVisible();
  });
});
