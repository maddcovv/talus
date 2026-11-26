import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "./renderAt";

async function reachReview(user: ReturnType<typeof userEvent.setup>) {
  renderAt("/jobs/senior-frontend/apply");
  await user.click(screen.getByRole("button", { name: "Use June's sample resume" }));
  await screen.findByRole("heading", { level: 1, name: "Your details" }, { timeout: 8000 });
  await user.type(screen.getByLabelText("Phone"), "9705550173");
  const auth = screen.getByRole("group", { name: /Are you authorized to work/ });
  await user.click(within(auth).getByRole("button", { name: "Yes" }));
  const visa = screen.getByRole("group", { name: /visa sponsorship/ });
  await user.click(within(visa).getByRole("button", { name: "No" }));
  await user.click(screen.getByRole("button", { name: "Continue to job questions" }));
  await user.click(screen.getByRole("button", { name: "Fill June's answers" }));
  await user.click(screen.getByRole("button", { name: "Continue to review" }));
  await screen.findByRole("heading", { level: 1, name: "Check it and send" });
}

describe("person check", () => {
  it("texts and calls with a fresh code, in words", async () => {
    const user = userEvent.setup();
    await reachReview(user);

    expect(
      screen.getByText(/We texted a 6-digit code to \(970\) 555-0173/),
    ).toBeInTheDocument();
    expect(screen.getByText("Demo: the code is 482913.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Text me a new code" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "New code sent to (970) 555-0173. It can take a minute to arrive.",
    );

    await user.click(screen.getByRole("button", { name: "Call me with the code instead" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "We're calling (970) 555-0173 now. A recording reads the code twice.",
    );
  }, 40000);

  it("explains a short code and a wrong code differently", async () => {
    const user = userEvent.setup();
    await reachReview(user);

    const send = () => screen.getByRole("button", { name: "Send my application" });
    const codeInput = screen.getByLabelText("Code from the text");

    await user.click(codeInput);
    await user.keyboard("482");
    await user.click(send());
    expect(await screen.findByText("Enter all 6 digits from the text.")).toBeInTheDocument();

    await user.click(codeInput);
    await user.keyboard("999");
    await user.click(send());
    expect(
      await screen.findByText(
        "That code doesn't match. Check the latest text from Two Track Supply, or get a new code.",
      ),
    ).toBeInTheDocument();
  }, 40000);
});
