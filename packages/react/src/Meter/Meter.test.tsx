import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Meter } from "./Meter";

describe("Meter", () => {
  it("exposes role meter with the value range", () => {
    render(<Meter label="Attachments" value={4} maxValue={5} valueText="4 of 5 attachments used" />);
    const meter = screen.getByRole("meter", { name: "Attachments" });
    expect(meter).toHaveAttribute("aria-valuenow", "4");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "5");
    expect(screen.getByText("4 of 5 attachments used")).toBeInTheDocument();
  });

  it("shows the over-limit state in words, not color alone", () => {
    render(
      <Meter
        label="Attachments"
        value={6}
        maxValue={5}
        valueText="6 of 5 attachments. Remove one to continue."
      />
    );
    expect(screen.getByText("6 of 5 attachments. Remove one to continue.")).toBeInTheDocument();
    expect(screen.getByRole("meter")).toHaveAttribute("data-over");
    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "5");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Meter label="Attachments" value={4} maxValue={5} valueText="4 of 5 attachments used" />
        <Meter label="Storage" value={12} maxValue={10} valueText="12 of 10 MB. Over the limit." />
      </>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
