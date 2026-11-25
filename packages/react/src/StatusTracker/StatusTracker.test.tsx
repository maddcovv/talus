import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { StatusTracker, type StatusTrackerStage } from "./StatusTracker";

const stages: StatusTrackerStage[] = [
  { label: "Application received", date: "Nov 12", state: "done" },
  { label: "Screening call", date: "Nov 18", state: "done" },
  { label: "Working session", state: "current" },
  { label: "Offer", state: "upcoming" },
];

describe("StatusTracker", () => {
  it("marks the current stage and announces states in words", () => {
    render(<StatusTracker label="Application progress" stages={stages} />);
    const current = screen.getByText("Working session").closest("li");
    expect(current).toHaveAttribute("aria-current", "step");
    expect(screen.getAllByText("Done:").length).toBe(2);
  });

  it("shows a reason on a closed stage", () => {
    render(
      <StatusTracker
        label="Application progress"
        stages={[
          { label: "Application received", date: "Oct 2", state: "done" },
          { label: "Position closed", date: "Oct 20", state: "closed", reason: "The role was filled." },
        ]}
      />
    );
    expect(screen.getByText("The role was filled.")).toBeInTheDocument();
    expect(screen.getByText("Closed:")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<StatusTracker label="Application progress" stages={stages} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
