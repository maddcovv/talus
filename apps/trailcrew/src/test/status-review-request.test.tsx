import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "./renderAt";

describe("status page review request", () => {
  it("confirms through a dialog and lands a toast", async () => {
    const user = userEvent.setup();
    renderAt("/status/june-halloran");

    expect(screen.getByText("Reviewed by a person on Nov 14 (Dana Ruiz, recruiter).")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ask for a person to review" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Ask for a person to review");

    await user.click(screen.getByRole("button", { name: "Send request" }));
    expect(await screen.findByText("Request sent.")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Notifications" })).toHaveAttribute(
      "aria-live",
      "polite",
    );
    expect(screen.getByRole("button", { name: "Review requested" })).toBeDisabled();
  });

  it("shows a closed application's reason in words", () => {
    renderAt("/status/dev-rao");
    expect(screen.getByText("Location or work authorization")).toBeInTheDocument();
  });
});
