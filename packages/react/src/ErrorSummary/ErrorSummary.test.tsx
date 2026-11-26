import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { ErrorSummary } from "./ErrorSummary";

function Example() {
  return (
    <>
      <ErrorSummary
        title="There are 2 things to fix"
        items={[
          { targetId: "field-phone", label: "Phone" },
          { targetId: "field-plain", label: "Plain container" },
        ]}
      />
      <div id="field-phone">
        <label htmlFor="phone">Phone</label>
        <input id="phone" />
      </div>
      <div id="field-plain">No focusable child here.</div>
    </>
  );
}

describe("ErrorSummary", () => {
  it("takes focus when it appears, so the list is read aloud", () => {
    render(<Example />);
    expect(screen.getByRole("alert")).toHaveFocus();
    expect(
      screen.getByRole("heading", { name: "There are 2 things to fix" }),
    ).toBeInTheDocument();
  });

  it("moves focus to the field a link names", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("link", { name: "Phone" }));
    expect(screen.getByLabelText("Phone")).toHaveFocus();
  });

  it("falls back to focusing the container itself", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("link", { name: "Plain container" }));
    expect(document.getElementById("field-plain")).toHaveFocus();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Example />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
