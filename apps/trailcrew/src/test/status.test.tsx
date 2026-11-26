import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "./renderAt";

describe("status page", () => {
  it("starts at applied: Dana reads it next, one message", () => {
    renderAt("/status/june-halloran");
    expect(screen.getByText("Dana reads it by Wednesday, December 2")).toBeInTheDocument();
    const current = screen.getByRole("listitem", { current: "step" });
    expect(within(current).getByText("Dana Ruiz reads it")).toBeInTheDocument();
    expect(within(current).getByText("You are here")).toBeInTheDocument();
    expect(screen.getByText("We got your application")).toBeInTheDocument();
    expect(screen.queryByText("Dana would like to talk")).not.toBeInTheDocument();
  });

  it("the stage query param moves the flag down the road", () => {
    renderAt("/status/june-halloran?stage=talk");
    expect(
      screen.getByText("Call with Dana: Monday, December 7, 10:00 AM"),
    ).toBeInTheDocument();
    const current = screen.getByRole("listitem", { current: "step" });
    expect(within(current).getByText("A working session with the team")).toBeInTheDocument();
    // Messages read newest first.
    const titles = screen
      .getAllByRole("listitem")
      .map((item) => item.textContent)
      .join(" ");
    expect(titles).toContain("Call set for Monday at 10:00 AM");
  });

  it("decision stage shows the offer", () => {
    renderAt("/status/june-halloran?stage=decision");
    expect(screen.getByText("You have an offer")).toBeInTheDocument();
    expect(screen.getByText("Dana called with an offer")).toBeInTheDocument();
  });

  it("withdraw confirms inline, never in a modal", async () => {
    const user = userEvent.setup();
    renderAt("/status/june-halloran");
    await user.click(screen.getByRole("button", { name: "Withdraw my application" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    const confirm = screen.getByRole("group", { name: "Withdraw your application?" });
    expect(
      within(confirm).getByText(/This can't be undone for this application/),
    ).toBeInTheDocument();

    // Keeping it closes the confirm without a trace.
    await user.click(within(confirm).getByRole("button", { name: "Keep my application" }));
    expect(screen.queryByRole("group", { name: "Withdraw your application?" })).toBeNull();

    // Withdrawing lands a status message.
    await user.click(screen.getByRole("button", { name: "Withdraw my application" }));
    await user.click(screen.getByRole("button", { name: "Withdraw" }));
    expect(screen.getByRole("status")).toHaveTextContent("Withdrawn. Dana has been told.");
  });

  it("asking for a person answers in words", async () => {
    const user = userEvent.setup();
    renderAt("/status/june-halloran");
    await user.click(screen.getByRole("button", { name: "Ask for a person" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Request sent. A person replies by email, usually the same day.",
    );
  });
});
