import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Accordion } from "./Accordion";
import { Disclosure } from "../Disclosure/Disclosure";

function Example(props: { allowsMultipleExpanded?: boolean }) {
  return (
    <Accordion {...props}>
      <Disclosure id="first" title="First row">
        <p>First body</p>
      </Disclosure>
      <Disclosure id="second" title="Second row">
        <p>Second body</p>
      </Disclosure>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("lets several rows stay open by default", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "First row" }));
    await user.click(screen.getByRole("button", { name: "Second row" }));
    expect(screen.getByRole("button", { name: "First row" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: "Second row" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("keeps one row open at a time when asked", async () => {
    const user = userEvent.setup();
    render(<Example allowsMultipleExpanded={false} />);
    await user.click(screen.getByRole("button", { name: "First row" }));
    await user.click(screen.getByRole("button", { name: "Second row" }));
    expect(screen.getByRole("button", { name: "First row" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("button", { name: "Second row" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("has no axe violations with a row open", async () => {
    const user = userEvent.setup();
    const { container } = render(<Example />);
    await user.click(screen.getByRole("button", { name: "First row" }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
