import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Disclosure } from "./Disclosure";

function subject() {
  return render(
    <Disclosure title="Senior Frontend Engineer, Blue Mesa Software" detail="2022 to now">
      <p>Led the component library used by four product teams.</p>
    </Disclosure>,
  );
}

describe("Disclosure", () => {
  it("hides the panel until the trigger is pressed", async () => {
    const user = userEvent.setup();
    subject();
    const trigger = screen.getByRole("button", { name: /Blue Mesa Software/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText(/component library/)).not.toBeVisible();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/component library/)).toBeVisible();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles from the keyboard", async () => {
    const user = userEvent.setup();
    subject();
    await user.tab();
    expect(screen.getByRole("button", { name: /Blue Mesa Software/ })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByText(/component library/)).toBeVisible();
    await user.keyboard(" ");
    expect(screen.getByText(/component library/)).not.toBeVisible();
  });

  it("renders the summary row at the given heading level", () => {
    render(
      <Disclosure title="Education" headingLevel={2}>
        <p>BS Computer Science.</p>
      </Disclosure>,
    );
    expect(screen.getByRole("heading", { level: 2, name: /Education/ })).toBeInTheDocument();
  });

  it("can start expanded", () => {
    render(
      <Disclosure title="Skills" defaultExpanded>
        <p>React, TypeScript.</p>
      </Disclosure>,
    );
    expect(screen.getByText("React, TypeScript.")).toBeVisible();
  });

  it("has no axe violations closed or open", async () => {
    const user = userEvent.setup();
    const { container } = subject();
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole("button", { name: /Blue Mesa Software/ }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
