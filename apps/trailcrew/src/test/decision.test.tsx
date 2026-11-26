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

  it("previous and next move through the job's candidates", async () => {
    const user = userEvent.setup();
    renderAt("/recruit/candidates/june-halloran");

    // June applied today, so she opens the review queue.
    expect(screen.getByText("1 of 10")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Next candidate" }));
    expect(screen.getByText("2 of 10")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 1, name: "June Halloran" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(
      screen.getByRole("heading", { level: 1, name: "June Halloran" }),
    ).toBeInTheDocument();
  });

  it("a note sticks to the candidate it was written on", async () => {
    const user = userEvent.setup();
    renderAt("/recruit/candidates/june-halloran");

    await user.type(
      screen.getByLabelText("Add a note"),
      "Component library work matches our gap.",
    );
    await user.click(screen.getByRole("button", { name: "Add note" }));
    expect(
      screen.getByText(/"Component library work matches our gap\." Dana Ruiz, Nov 25\./),
    ).toBeInTheDocument();

    // Flip away and back: the note stays with June.
    await user.click(screen.getByRole("button", { name: "Next candidate" }));
    expect(
      screen.queryByText(/Component library work matches our gap/),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(
      screen.getByText(/Component library work matches our gap/),
    ).toBeInTheDocument();
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
