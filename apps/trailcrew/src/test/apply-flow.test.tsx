import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "./renderAt";

async function pressChoice(user: ReturnType<typeof userEvent.setup>, group: RegExp, label: string) {
  const fieldset = screen.getByRole("group", { name: group });
  await user.click(within(fieldset).getByRole("button", { name: label }));
}

describe("apply flow", () => {
  it("walks the flow with every blocker named in a summary that jumps", async () => {
    const user = userEvent.setup();
    renderAt("/jobs/senior-frontend/apply");

    // Upload: the design's header has no step counter text.
    expect(
      screen.getByRole("heading", { level: 1, name: "Start with your resume" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Step 1 of 4/)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Use June's sample resume" }));
    // The reading pass runs about three seconds, then lands on details.
    await screen.findByRole("heading", { level: 1, name: "Your details" }, { timeout: 8000 });
    expect(screen.getByText("AI filled 14 of 17 answers.")).toBeInTheDocument();
    expect(screen.getAllByText("From your resume, page 1").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Continue to job questions" }));
    const summary = await screen.findByRole("alert");
    expect(summary).toHaveFocus();
    expect(within(summary).getByText("There are 3 things to fix")).toBeInTheDocument();

    await user.click(within(summary).getByRole("link", { name: "Add your phone number" }));
    expect(screen.getByLabelText("Phone")).toHaveFocus();
    await user.type(screen.getByLabelText("Phone"), "9705550173");

    await pressChoice(user, /Are you authorized to work in the United States/, "Yes");
    await pressChoice(user, /Will you now or in the future need visa sponsorship/, "No");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Continue to job questions" }));

    // Questions: the demo shortcut fills June's answers and the summary clears.
    expect(
      screen.getByRole("heading", { level: 1, name: "Three questions from the team" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Continue to review" }));
    const qSummary = await screen.findByRole("alert");
    expect(
      within(qSummary).getByRole("link", {
        name: "Answer the question about a component you built",
      }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Fill June's answers" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Continue to review" }));

    // Review: the formatted phone, then the code and the attestation gate.
    expect(
      screen.getByRole("heading", { level: 1, name: "Check it and send" }),
    ).toBeInTheDocument();
    expect(screen.getByText("(970) 555-0173")).toBeInTheDocument();

    const send = () => screen.getByRole("button", { name: "Send my application" });
    await user.click(send());
    const rSummary = await screen.findByRole("alert");
    expect(
      within(rSummary).getByText("Enter the 6-digit code from the text"),
    ).toBeInTheDocument();
    expect(
      within(rSummary).getByText("Check the box to confirm your application"),
    ).toBeInTheDocument();

    const codeInput = screen.getByLabelText("Code from the text");
    await user.click(codeInput);
    await user.keyboard("111111");
    await user.click(send());
    expect(
      await screen.findByText(
        "That code doesn't match. Check the latest text from Two Track Supply, or get a new code.",
      ),
    ).toBeInTheDocument();

    await user.click(codeInput);
    await user.keyboard("{Control>}a{/Control}{Backspace}482913");
    await user.click(
      screen.getByRole("checkbox", { name: /true and complete as far as I know/ }),
    );
    await user.click(send());
    expect(
      await screen.findByRole("heading", { name: /Sent\. Nice work, June\./ }),
    ).toBeInTheDocument();
    expect(screen.getByText("What happens next")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "See where you stand" })).toBeInTheDocument();
  }, 40000);

  it("opens one work history job at a time, sourced to page 1", async () => {
    const user = userEvent.setup();
    renderAt("/jobs/senior-frontend/apply");
    await user.click(screen.getByRole("button", { name: "Use June's sample resume" }));
    await screen.findByRole("heading", { level: 1, name: "Your details" }, { timeout: 8000 });

    // The first job starts open, with its bullets and source chip.
    const blueMesa = screen.getByRole("button", { name: /Blue Mesa Software/ });
    expect(blueMesa).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText("Cut the checkout bundle by a third and wrote up how."),
    ).toBeInTheDocument();

    // Opening another closes the first.
    const cairn = screen.getByRole("button", { name: /Cairn Analytics/ });
    await user.click(cairn);
    expect(cairn).toHaveAttribute("aria-expanded", "true");
    expect(blueMesa).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Owned the charting layer and its tests.")).toBeInTheDocument();

    // And the Hogback row carries the line John asked for, once opened.
    await user.click(screen.getByRole("button", { name: /Hogback Gear Works/ }));
    expect(
      screen.getByText("Kept the gear inventory and the booking calendar."),
    ).toBeInTheDocument();
  }, 40000);

  it("takes a real file and says June's sample stands in", async () => {
    const { container } = renderAt("/jobs/senior-frontend/apply");
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    const file = new File(["resume"], "my-real-resume.pdf", { type: "application/pdf" });
    fireEvent.change(input, { target: { files: [file] } });

    // The reading pass runs, and the demo is honest about the swap.
    expect(
      await screen.findByText(/my-real-resume\.pdf stays on your computer/),
    ).toBeInTheDocument();
    await screen.findByRole("heading", { level: 1, name: "Your details" }, { timeout: 8000 });
    expect(screen.getByText(/June's sample resume stands in/)).toBeInTheDocument();
  }, 40000);

  it("lets a person skip AI and fill the form themselves", async () => {
    const user = userEvent.setup();
    renderAt("/jobs/senior-frontend/apply");
    await user.click(screen.getByRole("button", { name: "Fill in the form yourself" }));
    expect(
      screen.getByRole("heading", { level: 1, name: "Your details" }),
    ).toBeInTheDocument();
    // No AI claims anywhere when AI did not fill anything.
    expect(screen.queryByText("AI filled 14 of 17 answers.")).not.toBeInTheDocument();
    expect(screen.queryByText("From your resume, page 1")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toHaveValue("");
  }, 40000);
});
