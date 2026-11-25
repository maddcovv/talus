import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { SourceChip } from "./SourceChip";

describe("SourceChip", () => {
  it("reads naturally to a screen reader", () => {
    render(<SourceChip source="your resume, page 1">Trail guide, Hogback Gear Works, 2021 to 2024</SourceChip>);
    expect(
      screen.getByRole("button", { name: "Filled from your resume, page 1. Show source" })
    ).toBeInTheDocument();
  });

  it("opens the source line and closes with Escape, returning focus", async () => {
    const user = userEvent.setup();
    render(<SourceChip source="your resume, page 1">Trail guide, Hogback Gear Works, 2021 to 2024</SourceChip>);
    const chip = screen.getByRole("button");
    await user.tab();
    expect(chip).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Trail guide, Hogback Gear Works, 2021 to 2024")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(chip).toHaveFocus());
  });

  it("has no axe violations closed and open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SourceChip source="your resume, page 1">Trail guide, Hogback Gear Works, 2021 to 2024</SourceChip>
    );
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole("button"));
    await screen.findByRole("dialog");
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
