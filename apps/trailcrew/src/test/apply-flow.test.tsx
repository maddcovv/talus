import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "./renderAt";

describe("apply flow", () => {
  it("walks the flow and explains every blocker in words", async () => {
    const user = userEvent.setup();
    renderAt("/jobs/senior-frontend/apply");

    // Resume step: continuing without a resume says why, instead of a dead button.
    const continueButton = () => screen.getByRole("button", { name: "Continue" });
    await user.click(continueButton());
    expect(
      await screen.findByText("Upload your resume, or use the sample resume, to continue."),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Use the sample resume" }));
    await screen.findByText("Resume read.", undefined, { timeout: 5000 });
    await user.click(continueButton());

    // Review step: the heading matches the stepper label's step.
    expect(
      screen.getByRole("heading", { level: 1, name: "Review your application" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Needs your answer").length).toBeGreaterThan(0);

    // Continue lists exactly what is missing.
    await user.click(continueButton());
    expect(await screen.findByText("Before you continue")).toBeInTheDocument();
    expect(screen.getByText("Phone, under Contact.")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you authorized to work in the United States?, under Work authorization.",
      ),
    ).toBeInTheDocument();

    // Fixing the problems clears the list; no confirm buttons anywhere.
    await user.type(screen.getByLabelText("Phone"), "555 0138");
    await user.click(screen.getByRole("radio", { name: "Yes" }));
    expect(screen.queryByText("Before you continue")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Confirm/ })).not.toBeInTheDocument();
    await user.click(continueButton());

    // Questions: unanswered required questions are named on the way out.
    expect(
      screen.getByRole("heading", { level: 1, name: "Questions from the hiring team" }),
    ).toBeInTheDocument();
    await user.click(continueButton());
    expect(await screen.findByText("Before you continue")).toBeInTheDocument();
    for (const question of [
      "Tell us about a component API you designed that other people built on.",
      "How do you decide when a pattern belongs in the design system?",
      "What is your approach to accessibility testing?",
    ]) {
      await user.type(screen.getByLabelText(question), "A real answer.");
    }
    await user.click(continueButton());

    // Submit: the person check and the certification both gate, with reasons.
    const submit = () => screen.getByRole("button", { name: "Submit application" });
    await user.click(submit());
    expect(await screen.findByText("Before you submit")).toBeInTheDocument();
    expect(screen.getByText("Finish the person check.")).toBeInTheDocument();
    expect(screen.getByText("Check the certification box.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Start the person check" }));
    await screen.findByText("Person check passed", undefined, { timeout: 5000 });
    await user.click(screen.getByRole("checkbox", { name: /true and complete/ }));
    await user.click(submit());
    expect(await screen.findByText("Application sent")).toBeInTheDocument();
  }, 30000);

  it("keeps work history details collapsed until opened", async () => {
    const user = userEvent.setup();
    renderAt("/jobs/senior-frontend/apply");
    await user.click(screen.getByRole("button", { name: "Use the sample resume" }));
    await screen.findByText("Resume read.", undefined, { timeout: 5000 });
    await user.click(screen.getByRole("button", { name: "Continue" }));

    const trigger = screen.getByRole("button", {
      name: /Senior Frontend Engineer, Blue Mesa Software/,
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByLabelText("What you did at Blue Mesa Software")).not.toBeVisible();

    await user.click(trigger);
    const details = screen.getByLabelText("What you did at Blue Mesa Software");
    expect(details).toBeVisible();
    expect(details).toHaveDisplayValue(/component library used by four product teams/);
  }, 30000);

  it("skips optional questions when gating", async () => {
    const user = userEvent.setup();
    renderAt("/jobs/customer-support/apply");
    await user.click(screen.getByRole("button", { name: "Use the sample resume" }));
    await screen.findByText("Resume read.", undefined, { timeout: 5000 });
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.type(screen.getByLabelText("Phone"), "555 0138");
    await user.click(screen.getByRole("radio", { name: "Yes" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    // Answer the two required questions, leave the optional cover letter empty.
    await user.type(
      screen.getByLabelText("Walk us through answering a customer whose order arrived damaged."),
      "A real answer.",
    );
    await user.type(
      screen.getByLabelText("What makes a support reply feel human?"),
      "A real answer.",
    );
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(
      screen.getByRole("heading", { level: 1, name: "Submit your application" }),
    ).toBeInTheDocument();
  }, 30000);
});
