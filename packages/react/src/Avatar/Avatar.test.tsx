import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("shows the initials of the first and last name", () => {
    render(<Avatar name="June Halloran" withLabel />);
    expect(screen.getByRole("img", { name: "June Halloran" })).toHaveTextContent("JH");
  });

  it("is hidden from assistive tech by default", () => {
    const { container } = render(<Avatar name="Dana Ruiz" />);
    expect(container.querySelector("[aria-hidden='true']")).toHaveTextContent("DR");
  });

  it("handles single names", () => {
    render(<Avatar name="Priya" withLabel />);
    expect(screen.getByRole("img", { name: "Priya" })).toHaveTextContent("P");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <Avatar name="June Halloran" />
        <span>June Halloran</span>
        <Avatar name="Dana Ruiz" withLabel />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
