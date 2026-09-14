import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import HomePage from "@/app/page";
import AssessmentPage from "@/app/assessment/page";
import { AppHeader } from "@/components/app-header";
import { SymptomsHistoryForm } from "@/components/symptoms-history-form";
import { ExaminationUpload } from "@/components/examination-upload";

describe("SARA-PRAGYA foundation", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("keeps the essential research story visible on the landing page", () => {
    render(<HomePage />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Classical Sāratā.");
    expect(heading).toHaveTextContent("Evidence-informed research.");
    expect(heading).toHaveTextContent("Careful insight.");
    expect(screen.getByText(/समदोषः समाग्निश्च/i)).toBeVisible();
    expect(screen.getByRole("link", { name: /start assessment/i })).toHaveAttribute(
      "href",
      "/assessment",
    );
    expect(screen.getByRole("heading", { name: /meaningful clinical insight/i })).toBeVisible();
    expect(screen.queryByRole("link", { name: "Classical Sāratā" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /quick answers about sara-pragya/i })).toBeVisible();
    expect(screen.queryByText(/phase [123]/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/disclaimer/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /what is sara-pragya designed to do/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("exposes semantic desktop and mobile navigation", () => {
    render(<AppHeader />);

    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
    const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(mobileNavigation).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /start assessment/i })).toHaveLength(2);

    const details = mobileNavigation.closest("details");
    details?.setAttribute("open", "");
    const aboutLink = within(mobileNavigation).getByRole("link", { name: "About" });
    aboutLink.addEventListener("click", (event) => event.preventDefault(), { once: true });
    fireEvent.click(aboutLink);
    expect(details).not.toHaveAttribute("open");
  });

  it("guides a user through the preliminary Sāratā assessment without calling it diagnostic", () => {
    render(<AssessmentPage />);

    expect(screen.getByRole("heading", { name: /dhātu sāratā observations/i })).toBeVisible();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();

    fireEvent.click(screen.getByLabelText(/generally adequate/i));
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText(/ease and clarity of the person/i)).toBeVisible();
  });

  it("saves and reopens clinical history for editing", () => {
    render(<SymptomsHistoryForm />);

    fireEvent.change(screen.getByLabelText(/chief complaint/i), { target: { value: "Example complaint" } });
    fireEvent.change(screen.getByLabelText(/presenting symptoms/i), { target: { value: "Example symptom details" } });
    fireEvent.click(screen.getByRole("button", { name: /save clinical history/i }));
    expect(screen.getByRole("heading", { name: "Clinical history" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByDisplayValue("Example complaint")).toBeVisible();
  });

  it("validates an examination upload before review", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      document_id: "a".repeat(32), kind: "examination", filename: "exam.pdf",
      extracted_text: "Extracted observation", verified_text: "Extracted observation",
    }), { status: 200, headers: { "Content-Type": "application/json" } })));
    const { container } = render(<ExaminationUpload />);
    const input = container.querySelector('input[type="file"]');
    fireEvent.change(input!, { target: { files: [new File(["report"], "exam.pdf", { type: "application/pdf" })] } });
    await waitFor(() => expect(screen.getByText("exam.pdf")).toBeVisible());
    expect(screen.getByLabelText(/review extracted pdf text/i)).toHaveValue("Extracted observation");
    expect(screen.getByRole("button", { name: /continue to laboratory/i })).toBeVisible();
  });
});
