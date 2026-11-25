import { act, fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "./renderAt";

describe("person check resend", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("locks resend for 30 seconds, then sends a fresh code", async () => {
    const user = userEvent.setup();
    renderAt("/jobs/seasonal-fulfillment/apply");

    // Real timers up to the review step, like a person would get there.
    await user.click(screen.getByRole("button", { name: "Use the sample resume" }));
    await screen.findByText("Resume read.", undefined, { timeout: 8000 });
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await user.type(screen.getByLabelText("Phone"), "555 0138");
    const auth = screen.getByRole("radiogroup", {
      name: "Are you authorized to work in the United States?",
    });
    await user.click(within(auth).getByRole("radio", { name: "Yes" }));
    const visa = screen.getByRole("radiogroup", {
      name: "Will you now or in the future need visa sponsorship?",
    });
    await user.click(within(visa).getByRole("radio", { name: "No" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await user.click(screen.getByRole("button", { name: /Which shift are you available for/ }));
    await user.click(await screen.findByRole("option", { name: "Either works for me" }));
    const pickPack = screen.getByRole("radiogroup", {
      name: "Have you done pick and pack work before?",
    });
    await user.click(within(pickPack).getByRole("radio", { name: "Yes" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(
      screen.getByRole("heading", { level: 1, name: "Review and submit" }),
    ).toBeInTheDocument();

    // Fake timers from here, so the 30 second window passes in milliseconds.
    // fireEvent keeps the clicks synchronous while the clock is fake.
    vi.useFakeTimers();

    fireEvent.click(screen.getByRole("button", { name: "Email me a code" }));
    expect(
      screen.getByText(/We sent a 6 digit code to june.halloran@example.com/),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Resend code (30s)" })).toBeDisabled();

    act(() => {
      vi.advanceTimersByTime(31000);
    });
    const resend = screen.getByRole("button", { name: "Resend code" });
    expect(resend).toBeEnabled();
    fireEvent.click(resend);
    expect(screen.getByRole("button", { name: "Resend code (30s)" })).toBeDisabled();

    // The code still verifies after a resend.
    fireEvent.change(screen.getByLabelText("Enter the 6 digit code"), {
      target: { value: "482913" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Verify code" }));
    expect(screen.getByText("Person check passed")).toBeInTheDocument();
  }, 40000);
});
