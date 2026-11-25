import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("ties the label to the input", async () => {
    const user = userEvent.setup();
    render(<TextField label="Shop name" />);
    const input = screen.getByLabelText("Shop name");
    await user.type(input, "Juniper Supply");
    expect(input).toHaveValue("Juniper Supply");
  });

  it("ties the hint with aria-describedby", () => {
    render(<TextField label="Shop name" hint="Shown on your public page" />);
    const input = screen.getByLabelText("Shop name");
    expect(input).toHaveAccessibleDescription("Shown on your public page");
  });

  it("marks the field invalid and describes the error", () => {
    render(<TextField label="Shop name" errorMessage="Enter a shop name" />);
    const input = screen.getByLabelText("Shop name");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Enter a shop name");
    expect(screen.getByText("Enter a shop name")).toBeInTheDocument();
  });

  it("renders a labeled textarea when multiline", async () => {
    const user = userEvent.setup();
    render(<TextField label="Kickoff notes" multiline rows={6} />);
    const area = screen.getByLabelText("Kickoff notes");
    expect(area.tagName).toBe("TEXTAREA");
    expect(area).toHaveAttribute("rows", "6");
    await user.type(area, "Two lines\nof notes");
    expect(area).toHaveValue("Two lines\nof notes");
  });

  it("has no axe violations in default, hint, error, disabled and multiline states", async () => {
    const { container } = render(
      <>
        <TextField label="Name" />
        <TextField label="Email" hint="Work email" />
        <TextField label="City" errorMessage="Enter a city" />
        <TextField label="Country" isDisabled />
        <TextField label="Notes" multiline />
      </>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
