import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "./renderAt";

describe("apply flow", () => {
  it("gates every step: upload, section confirms, questions, consent", async () => {
    const user = userEvent.setup();
    renderAt("/jobs/senior-frontend/apply");

    // Upload: cannot continue before the resume is read.
    const continueButton = () => screen.getByRole("button", { name: "Continue" });
    expect(continueButton()).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Use the sample resume" }));
    await screen.findByText("Resume read.", undefined, { timeout: 5000 });
    expect(continueButton()).toBeEnabled();
    await user.click(continueButton());

    // Review: continue stays locked until every section is confirmed.
    expect(continueButton()).toBeDisabled();
    expect(screen.getAllByText("Needs your answer").length).toBeGreaterThan(0);

    await user.type(screen.getByLabelText("Phone"), "555 0138");
    await user.click(screen.getByRole("button", { name: "Confirm contact" }));
    expect(continueButton()).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Confirm work history" }));
    await user.click(screen.getByRole("button", { name: "Confirm education" }));
    await user.click(screen.getByRole("button", { name: "Confirm skills" }));

    // Work authorization requires an answer before it can be confirmed.
    expect(screen.getByRole("button", { name: "Confirm work authorization" })).toBeDisabled();
    await user.click(screen.getByRole("radio", { name: "Yes" }));
    await user.click(screen.getByRole("button", { name: "Confirm work authorization" }));

    expect(continueButton()).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Confirm links" }));
    expect(continueButton()).toBeEnabled();
    await user.click(continueButton());

    // Questions: all three must be answered.
    expect(continueButton()).toBeDisabled();
    for (const question of [
      "Tell us about a component API you designed that other people built on.",
      "How do you decide when a pattern belongs in the design system?",
      "What is your approach to accessibility testing?",
    ]) {
      await user.type(screen.getByLabelText(question), "A real answer.");
    }
    expect(continueButton()).toBeEnabled();
    await user.click(continueButton());

    // Submit: consent first.
    const submit = screen.getByRole("button", { name: "Submit application" });
    expect(submit).toBeDisabled();
    await user.click(
      screen.getByRole("checkbox", { name: "This application is accurate, and it is mine to send." }),
    );
    expect(submit).toBeEnabled();
    await user.click(submit);
    expect(await screen.findByText("Application sent")).toBeInTheDocument();
  }, 30000);

  it("unconfirms a section when a field in it is edited", async () => {
    const user = userEvent.setup();
    renderAt("/jobs/senior-frontend/apply");
    await user.click(screen.getByRole("button", { name: "Use the sample resume" }));
    await screen.findByText("Resume read.", undefined, { timeout: 5000 });
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await user.click(screen.getByRole("button", { name: "Confirm work history" }));
    expect(screen.getByRole("button", { name: "Confirmed" })).toBeDisabled();
    await user.type(screen.getByLabelText("Most recent role"), " plus contract work");
    expect(screen.getByRole("button", { name: "Confirm work history" })).toBeEnabled();
  }, 30000);
});
