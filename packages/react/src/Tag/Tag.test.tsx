import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Tag } from "./Tag";

describe("Tag", () => {
  it("renders its text", () => {
    render(<Tag>Referral</Tag>);
    expect(screen.getByText("Referral")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <p>
        Source: <Tag>Job board</Tag>
      </p>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
