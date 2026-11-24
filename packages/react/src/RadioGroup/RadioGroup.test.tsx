import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { RadioGroup, Radio } from "./RadioGroup";

function Sizes(props: { errorMessage?: string }) {
  return (
    <RadioGroup label="Pack size" {...props}>
      <Radio value="s">Small</Radio>
      <Radio value="m">Medium</Radio>
      <Radio value="l">Large</Radio>
    </RadioGroup>
  );
}

describe("RadioGroup", () => {
  it("selects with the mouse and moves with arrow keys", async () => {
    const user = userEvent.setup();
    render(<Sizes />);

    await user.click(screen.getByRole("radio", { name: "Small" }));
    expect(screen.getByRole("radio", { name: "Small" })).toBeChecked();

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Medium" })).toBeChecked();

    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("radio", { name: "Small" })).toBeChecked();
  });

  it("names the group with its label", () => {
    render(<Sizes />);
    expect(screen.getByRole("radiogroup", { name: "Pack size" })).toBeInTheDocument();
  });

  it("describes errors on the group", () => {
    render(<Sizes errorMessage="Pick a size" />);
    const group = screen.getByRole("radiogroup", { name: "Pack size" });
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Pick a size")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Sizes />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
