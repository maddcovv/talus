import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "./renderAt";

async function answerRadio(user: ReturnType<typeof userEvent.setup>, group: string, answer: string) {
  const radiogroup = screen.getByRole("radiogroup", { name: group });
  await user.click(within(radiogroup).getByRole("radio", { name: answer }));
}

describe("apply flow", () => {
  it("names every blocker in a summary that jumps to the field", async () => {
    const user = userEvent.setup();
    renderAt("/jobs/senior-frontend/apply");

    // Step 1: the stepper, the count and the heading all say the same thing.
    expect(screen.getByText("Step 1 of 4")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Upload your resume" }),
    ).toBeInTheDocument();

    const continueButton = () => screen.getByRole("button", { name: "Continue" });
    await user.click(continueButton());
    const summary = await screen.findByRole("alert");
    expect(summary).toHaveFocus();
    expect(within(summary).getByText("There is 1 thing to fix")).toBeInTheDocument();
    expect(
      within(summary).getByRole("link", {
        name: "Upload your resume, or use the sample resume.",
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Use the sample resume" }));
    await screen.findByText("Resume read.", undefined, { timeout: 8000 });
    await user.click(continueButton());

    // Step 2: no confirm buttons, and missing answers are named as links.
    expect(screen.getByText("Step 2 of 4")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Your details" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Confirm/ })).not.toBeInTheDocument();

    await user.click(continueButton());
    const detailsSummary = await screen.findByRole("alert");
    expect(within(detailsSummary).getByText("There are 3 things to fix")).toBeInTheDocument();

    // The link moves focus straight to the field it names.
    await user.click(
      within(detailsSummary).getByRole("link", { name: "Add your phone number." }),
    );
    expect(screen.getByLabelText("Phone")).toHaveFocus();

    await user.type(screen.getByLabelText("Phone"), "555 0138");
    await answerRadio(user, "Are you authorized to work in the United States?", "Yes");
    await answerRadio(user, "Will you now or in the future need visa sponsorship?", "No");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    await user.click(continueButton());

    // Step 3: unanswered required questions are named on the way out.
    expect(screen.getByRole("heading", { level: 1, name: "Job questions" })).toBeInTheDocument();
    await user.click(continueButton());
    const questionSummary = await screen.findByRole("alert");
    expect(
      within(questionSummary).getByRole("link", {
        name: "Answer: What is your approach to accessibility testing?",
      }),
    ).toBeInTheDocument();
    for (const question of [
      "Tell us about a component API you designed that other people built on.",
      "How do you decide when a pattern belongs in the design system?",
      "What is your approach to accessibility testing?",
    ]) {
      await user.type(screen.getByLabelText(question), "A real answer.");
    }
    await user.click(continueButton());

    // Step 4: the person check and both boxes gate, each with a reason.
    expect(screen.getByText("Step 4 of 4")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Review and submit" }),
    ).toBeInTheDocument();
    const submit = () => screen.getByRole("button", { name: "Submit application" });
    await user.click(submit());
    const submitSummary = await screen.findByRole("alert");
    expect(within(submitSummary).getByText("Finish the person check.")).toBeInTheDocument();
    expect(within(submitSummary).getByText("Check the certification box.")).toBeInTheDocument();
    expect(
      within(submitSummary).getByText("Confirm you have read how Trailcrew uses AI."),
    ).toBeInTheDocument();

    // Person check: wrong code fails in words, the demo code passes.
    await user.click(screen.getByRole("button", { name: "Text me a code" }));
    const codeInput = screen.getByLabelText("Enter the 6 digit code");
    await user.click(codeInput);
    await user.keyboard("111111");
    await user.click(screen.getByRole("button", { name: "Verify code" }));
    expect(
      await screen.findByText("That code did not match. Check the newest message, or resend the code."),
    ).toBeInTheDocument();
    await user.clear(codeInput);
    await user.click(codeInput);
    await user.keyboard("482913");
    await user.click(screen.getByRole("button", { name: "Verify code" }));
    expect(await screen.findByText("Person check passed")).toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: /true and complete/ }));
    await user.click(
      screen.getByRole("checkbox", { name: /read how Trailcrew uses AI/ }),
    );
    await user.click(submit());
    expect(await screen.findByText("Application sent")).toBeInTheDocument();
  }, 40000);

  it("keeps work history collapsed and editable field by field", async () => {
    const user = userEvent.setup();
    renderAt("/jobs/senior-frontend/apply");
    await user.click(screen.getByRole("button", { name: "Use the sample resume" }));
    await screen.findByText("Resume read.", undefined, { timeout: 8000 });
    await user.click(screen.getByRole("button", { name: "Continue" }));

    const trigger = screen.getByRole("button", {
      name: /Senior Frontend Engineer, Blue Mesa Software/,
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByLabelText("What you did at Blue Mesa Software")).not.toBeVisible();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const details = screen.getByLabelText("What you did at Blue Mesa Software");
    expect(details).toBeVisible();
    expect(details).toHaveDisplayValue(/component library used by four product teams/);
    expect(screen.getByDisplayValue("Blue Mesa Software")).toBeVisible();
    // The current job hides its end date behind "I work here now"; the only
    // end dates in the form belong to the two older, still collapsed jobs.
    for (const endYear of screen.getAllByLabelText("End year")) {
      expect(endYear).not.toBeVisible();
    }

    // Removing and adding entries is one click each.
    expect(screen.getAllByRole("button", { name: "Remove this job" }).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "Add a job" }));
    expect(screen.getByRole("button", { name: /New job/ })).toBeInTheDocument();
  }, 40000);

  it("skips optional questions when gating", async () => {
    const user = userEvent.setup();
    renderAt("/jobs/seasonal-fulfillment/apply");
    await user.click(screen.getByRole("button", { name: "Use the sample resume" }));
    await screen.findByText("Resume read.", undefined, { timeout: 8000 });
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await user.type(screen.getByLabelText("Phone"), "555 0138");
    await answerRadio(user, "Are you authorized to work in the United States?", "Yes");
    await answerRadio(user, "Will you now or in the future need visa sponsorship?", "No");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    // A select and a yes or no question; the optional follow-up stays empty.
    await user.click(screen.getByRole("button", { name: /Which shift are you available for/ }));
    await user.click(await screen.findByRole("option", { name: "Either works for me" }));
    await answerRadio(user, "Have you done pick and pack work before?", "Yes");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(
      screen.getByRole("heading", { level: 1, name: "Review and submit" }),
    ).toBeInTheDocument();
  }, 40000);
});
