import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("toggles with the mouse and with the space key", async () => {
    const user = userEvent.setup();
    render(<Checkbox>Email me about order updates</Checkbox>);
    const box = screen.getByRole("checkbox", { name: "Email me about order updates" });

    await user.click(box);
    expect(box).toBeChecked();

    box.focus();
    await user.keyboard(" ");
    expect(box).not.toBeChecked();
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    render(<Checkbox isDisabled>Email me</Checkbox>);
    const box = screen.getByRole("checkbox", { name: "Email me" });
    await user.click(box);
    expect(box).not.toBeChecked();
  });

  it("has no axe violations unchecked, checked, indeterminate and disabled", async () => {
    const { container } = render(
      <>
        <Checkbox>Unchecked</Checkbox>
        <Checkbox defaultSelected>Checked</Checkbox>
        <Checkbox isIndeterminate>Indeterminate</Checkbox>
        <Checkbox isDisabled>Disabled</Checkbox>
      </>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
