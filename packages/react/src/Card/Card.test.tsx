import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders as a plain container by default", () => {
    render(<Card>Base camp duffel, 90 liters</Card>);
    expect(screen.getByText("Base camp duffel, 90 liters")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("becomes one press target with a keyboard path when onPress is given", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Card onPress={onPress}>Open the posting</Card>);
    const button = screen.getByRole("button", { name: "Open the posting" });
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("has no axe violations in any variant", async () => {
    const { container } = render(
      <>
        <Card>Plain</Card>
        <Card elevated>Elevated</Card>
        <Card onPress={() => {}}>Clickable</Card>
      </>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
