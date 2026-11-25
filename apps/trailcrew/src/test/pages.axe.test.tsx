import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { renderAt } from "./renderAt";

// Every page, rendered through the real routes and layouts. Recruiter pages
// run twice: once in light, once after flipping the header's Dark switch.

const candidatePages: Array<[string, string]> = [
  ["jobs index", "/"],
  ["job page", "/jobs/senior-frontend"],
  ["job page, warehouse", "/jobs/warehouse-lead"],
  ["apply", "/jobs/senior-frontend/apply"],
  ["status", "/status/june-halloran"],
  ["status, closed", "/status/dev-rao"],
  ["life", "/life"],
  ["benefits", "/benefits"],
  ["ai notice", "/how-ai-works"],
];

const recruiterPages: Array<[string, string]> = [
  ["today", "/recruit"],
  ["pipeline", "/recruit/jobs/warehouse-lead"],
  ["candidate", "/recruit/candidates/june-halloran"],
  ["candidates", "/recruit/candidates"],
  ["job setup", "/recruit/jobs/new"],
  ["ai log", "/recruit/jobs/senior-frontend/ai-log"],
  ["ai activity", "/recruit/ai-activity"],
  ["settings", "/recruit/settings"],
];

describe("candidate pages have no axe violations", () => {
  it.each(candidatePages)("%s", async (_name, path) => {
    const { container } = renderAt(path);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("recruiter pages have no axe violations in light and dark", () => {
  it.each(recruiterPages)("%s", async (_name, path) => {
    const user = userEvent.setup();
    const { container } = renderAt(path);
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole("switch", { name: "Dark" }));
    expect(document.documentElement.dataset.scheme).toBe("dark");
    expect(await axe(container)).toHaveNoViolations();
  }, 30000);
});

describe("pipeline table view has no axe violations", () => {
  it("table tab", async () => {
    const user = userEvent.setup();
    const { container } = renderAt("/recruit/jobs/warehouse-lead");
    await user.click(screen.getByRole("tab", { name: "Table" }));
    await screen.findByRole("grid");
    expect(await axe(container)).toHaveNoViolations();
  }, 30000);
});
