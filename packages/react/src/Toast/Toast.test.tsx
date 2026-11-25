import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { Toast, ToastRegion } from "./Toast";

describe("Toast", () => {
  it("announces politely through a named live region", () => {
    render(
      <ToastRegion>
        <Toast variant="success" title="Application sent" onDismiss={() => {}}>
          Two Track Supply has your application.
        </Toast>
      </ToastRegion>
    );
    const region = screen.getByRole("region", { name: "Notifications" });
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText("Application sent")).toBeInTheDocument();
  });

  it("dismisses from the keyboard", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <ToastRegion>
        <Toast variant="info" title="Draft saved" onDismiss={onDismiss} />
      </ToastRegion>
    );
    const dismiss = screen.getByRole("button", { name: "Dismiss" });
    await user.tab();
    expect(dismiss).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("has no axe violations in any variant", async () => {
    const { container } = render(
      <ToastRegion>
        <Toast variant="info" title="Heads up" onDismiss={() => {}} />
        <Toast variant="success" title="Done" onDismiss={() => {}} />
        <Toast variant="warning" title="Careful" onDismiss={() => {}} />
        <Toast variant="danger" title="Upload failed" onDismiss={() => {}}>
          The error also shows next to the field.
        </Toast>
      </ToastRegion>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
