import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { Stepper } from "./Stepper";

const steps = [{ label: "Your details" }, { label: "Resume" }, { label: "Review" }];

describe("Stepper", () => {
  it("marks the current step with aria-current", () => {
    render(<Stepper label="Application steps" steps={steps} current={1} />);
    const current = screen.getByText("Resume").closest("li");
    expect(current).toHaveAttribute("aria-current", "step");
    expect(screen.getByText("Your details").closest("li")).not.toHaveAttribute("aria-current");
  });

  it("lets the keyboard go back to a completed step", async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(<Stepper label="Application steps" steps={steps} current={1} onStepClick={onStepClick} />);
    const back = screen.getByRole("button", { name: /Completed: Your details/ });
    await user.tab();
    expect(back).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onStepClick).toHaveBeenCalledWith(0);
    expect(screen.queryByRole("button", { name: /Review/ })).not.toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Stepper label="Application steps" steps={steps} current={1} onStepClick={() => {}} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
