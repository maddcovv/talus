import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Dialog, DialogTrigger } from "./Dialog";
import { Button } from "../Button/Button";

function RemoveItem() {
  return (
    <DialogTrigger>
      <Button variant="danger">Remove item</Button>
      <Dialog title="Remove this item?">
        {({ close }) => (
          <>
            <p>It comes off the order right away.</p>
            <Button onPress={close}>Keep it</Button>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  );
}

describe("Dialog", () => {
  it("opens from the trigger and labels itself with the title", async () => {
    const user = userEvent.setup();
    render(<RemoveItem />);
    await user.click(screen.getByRole("button", { name: "Remove item" }));
    expect(screen.getByRole("dialog", { name: "Remove this item?" })).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<RemoveItem />);
    const trigger = screen.getByRole("button", { name: "Remove item" });

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("closes from a button inside", async () => {
    const user = userEvent.setup();
    render(<RemoveItem />);
    await user.click(screen.getByRole("button", { name: "Remove item" }));
    await user.click(screen.getByRole("button", { name: "Keep it" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("has no axe violations while open", async () => {
    const user = userEvent.setup();
    render(<RemoveItem />);
    await user.click(screen.getByRole("button", { name: "Remove item" }));
    expect(await axe(screen.getByRole("dialog"))).toHaveNoViolations();
  });
});
