import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("toggles with the mouse and with the space key", async () => {
    const user = userEvent.setup();
    render(<Switch>Order updates</Switch>);
    const toggle = screen.getByRole("switch", { name: "Order updates" });

    await user.click(toggle);
    expect(toggle).toBeChecked();

    toggle.focus();
    await user.keyboard(" ");
    expect(toggle).not.toBeChecked();
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    render(<Switch isDisabled>Order updates</Switch>);
    const toggle = screen.getByRole("switch", { name: "Order updates" });
    await user.click(toggle);
    expect(toggle).not.toBeChecked();
  });

  it("has no axe violations off, on and disabled", async () => {
    const { container } = render(
      <>
        <Switch>Off</Switch>
        <Switch defaultSelected>On</Switch>
        <Switch isDisabled>Disabled</Switch>
      </>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
