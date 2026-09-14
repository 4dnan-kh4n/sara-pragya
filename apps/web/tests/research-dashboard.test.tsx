import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResearchDashboard } from "@/components/research-dashboard";

describe("ResearchDashboard", () => {
  it("keeps illustrative data visibly labeled and links to the assessment", () => {
    render(<ResearchDashboard />);

    expect(screen.getByRole("heading", { name: "Research dashboard" })).toBeVisible();
    expect(screen.getByText(/every figure below is fictional sample data/i)).toBeVisible();
    expect(screen.getByRole("row", { name: /SAMPLE-012.*Vāta-Pitta.*3 verified PDFs.*Ready for review/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /open assessment/i })).toHaveAttribute("href", "/assessment");
  });
});
