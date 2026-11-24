import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Select, SelectItem } from "./Select";

function Region(props: { errorMessage?: string }) {
  return (
    <Select label="Region" placeholder="Pick a region" {...props}>
      <SelectItem id="north">North Ridge</SelectItem>
      <SelectItem id="valley">Valley Flats</SelectItem>
      <SelectItem id="coast">Coast Range</SelectItem>
    </Select>
  );
}

describe("Select", () => {
  it("opens with the mouse and selects an option", async () => {
    const user = userEvent.setup();
    render(<Region />);
    const trigger = screen.getByRole("button", { name: /Region/ });

    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "Valley Flats" }));

    expect(trigger).toHaveTextContent("Valley Flats");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("works with the keyboard alone", async () => {
    const user = userEvent.setup();
    render(<Region />);
    const trigger = screen.getByRole("button", { name: /Region/ });

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent("Coast Range");
  });

  it("describes errors", () => {
    render(<Region errorMessage="Choose one of the regions" />);
    expect(screen.getByText("Choose one of the regions")).toBeInTheDocument();
  });

  it("has no axe violations closed and open", async () => {
    const user = userEvent.setup();
    const { container } = render(<Region />);
    expect(await axe(container)).toHaveNoViolations();

    await user.click(screen.getByRole("button", { name: /Region/ }));
    expect(await axe(screen.getByRole("listbox"))).toHaveNoViolations();
  });
});
