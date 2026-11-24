import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("fires onPress on click and on keyboard Enter", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });

    await user.click(button);
    expect(onPress).toHaveBeenCalledTimes(1);

    button.focus();
    await user.keyboard("{Enter}");
    expect(onPress).toHaveBeenCalledTimes(2);
  });

  it("blocks presses when disabled", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(
      <Button onPress={onPress} isDisabled>
        Save
      </Button>
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("blocks presses while loading and keeps the label readable", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(
      <Button onPress={onPress} isLoading>
        Save
      </Button>
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("data-loading");
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("has no axe violations in any variant", async () => {
    const { container } = render(
      <>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
        <Button isLoading>Loading</Button>
        <Button isDisabled>Disabled</Button>
      </>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
