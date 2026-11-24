import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its text", () => {
    render(<Badge variant="success">Shipped</Badge>);
    expect(screen.getByText("Shipped")).toBeInTheDocument();
  });

  it("has no axe violations in any variant", async () => {
    const { container } = render(
      <>
        <Badge variant="success">Shipped</Badge>
        <Badge variant="warning">Low stock</Badge>
        <Badge variant="danger">Failed</Badge>
        <Badge variant="info">In review</Badge>
        <Badge variant="neutral">Draft</Badge>
      </>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
