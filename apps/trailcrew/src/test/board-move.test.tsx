import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "./renderAt";

describe("pipeline board keyboard move", () => {
  it("moves a candidate with the card menu and announces it", async () => {
    const user = userEvent.setup();
    renderAt("/recruit/jobs/senior-frontend");

    // June just applied today; Marisol carries the interview-stage story.
    const appliedColumn = screen.getByRole("region", { name: "Applied" });
    expect(within(appliedColumn).getByText("June Halloran")).toBeInTheDocument();
    const interviewColumn = screen.getByRole("region", { name: "Interview" });
    expect(within(interviewColumn).getByText("Marisol Vega")).toBeInTheDocument();

    // The pure keyboard path (tab, Enter, menu) is covered in the Board
    // component's own tests; this exercises the same move inside the app.
    await user.click(screen.getByRole("button", { name: "Move Marisol Vega" }));
    await user.click(await screen.findByRole("menuitem", { name: "Move to Offer" }));

    const offerColumn = screen.getByRole("region", { name: "Offer" });
    expect(within(offerColumn).getByText("Marisol Vega")).toBeInTheDocument();
    expect(screen.getByText("Marisol Vega moved to Offer.")).toBeInTheDocument();
  });

  it("a card's name opens the candidate, with a crumb back to the job", async () => {
    const user = userEvent.setup();
    renderAt("/recruit/jobs/senior-frontend");

    await user.click(screen.getByRole("button", { name: "June Halloran" }));
    expect(
      await screen.findByRole("heading", { level: 1, name: "June Halloran" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Senior Frontend Engineer" }),
    ).toHaveAttribute("href", "/recruit/jobs/senior-frontend");
  });
});
