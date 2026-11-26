import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "./renderAt";

describe("pipeline board keyboard move", () => {
  it("moves a candidate with the card menu and announces it", async () => {
    const user = userEvent.setup();
    renderAt("/recruit/jobs/senior-frontend");

    const interviewColumn = screen.getByRole("region", { name: "Interview" });
    expect(within(interviewColumn).getByText("June Halloran")).toBeInTheDocument();

    // The pure keyboard path (tab, Enter, menu) is covered in the Board
    // component's own tests; this exercises the same move inside the app.
    await user.click(screen.getByRole("button", { name: "Move June Halloran" }));
    await user.click(await screen.findByRole("menuitem", { name: "Move to Offer" }));

    const offerColumn = screen.getByRole("region", { name: "Offer" });
    expect(within(offerColumn).getByText("June Halloran")).toBeInTheDocument();
    expect(screen.getByText("June Halloran moved to Offer.")).toBeInTheDocument();
  });
});
