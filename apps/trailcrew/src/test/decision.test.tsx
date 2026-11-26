import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "./renderAt";

describe("recruiter decision dialog", () => {
  it("requires a reason category before a decision is confirmed", async () => {
    const user = userEvent.setup();
    renderAt("/recruit/candidates/marisol-vega");

    await user.click(screen.getByRole("button", { name: "Move forward" }));
    await screen.findByRole("dialog");

    const confirm = screen.getByRole("button", { name: "Confirm decision" });
    expect(confirm).toBeDisabled();
    expect(screen.getByText(/Decided by Dana Ruiz, recruiter/)).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Meets the requirements with evidence" }));
    expect(confirm).toBeEnabled();
    await user.click(confirm);

    expect(await screen.findByText(/Moved to Offer/)).toBeInTheDocument();
  });

  it("closing says the reason and never auto-rejects", async () => {
    const user = userEvent.setup();
    renderAt("/recruit/candidates/priya-natarajan");

    await user.click(screen.getByRole("button", { name: "Not moving forward" }));
    await screen.findByRole("dialog");
    expect(screen.getByRole("button", { name: "Confirm decision" })).toBeDisabled();
    await user.click(screen.getByRole("radio", { name: "Timing or availability" }));
    await user.click(screen.getByRole("button", { name: "Confirm decision" }));

    expect(await screen.findByText(/Closed: Timing or availability/)).toBeInTheDocument();
  });
});
