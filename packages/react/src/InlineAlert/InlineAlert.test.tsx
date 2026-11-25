import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { InlineAlert } from "./InlineAlert";

describe("InlineAlert", () => {
  it("renders title and body", () => {
    render(
      <InlineAlert variant="warning" title="Season ending soon">
        Orders placed after Friday ship in spring.
      </InlineAlert>
    );
    expect(screen.getByText("Season ending soon")).toBeInTheDocument();
    expect(screen.getByText("Orders placed after Friday ship in spring.")).toBeInTheDocument();
  });

  it("dismisses", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <InlineAlert variant="info" title="Saved" onDismiss={onDismiss}>
        Your draft is safe.
      </InlineAlert>
    );
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("has no axe violations in any variant", async () => {
    const { container } = render(
      <>
        <InlineAlert variant="info" title="Heads up">Info body.</InlineAlert>
        <InlineAlert variant="success" title="Done">Success body.</InlineAlert>
        <InlineAlert variant="warning" title="Careful">Warning body.</InlineAlert>
        <InlineAlert variant="danger" title="Something broke" onDismiss={() => {}}>
          Danger body.
        </InlineAlert>
      </>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
