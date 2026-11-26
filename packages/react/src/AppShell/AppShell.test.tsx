import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { AppShell } from "./AppShell";

function Example() {
  return (
    <AppShell
      brand="Trailcrew"
      brandHref="/recruit"
      nav={
        <>
          <a href="/recruit" aria-current="page">
            Today
          </a>
          <a href="/recruit/candidates">Candidates</a>
        </>
      }
      topBar={<input aria-label="Search" type="search" />}
      end={<span>Dark switch</span>}
      note={<span>Demo data, all made up.</span>}
      sidebarFooter={<span>Dana Ruiz, recruiter</span>}
    >
      <h1>Today</h1>
    </AppShell>
  );
}

describe("AppShell", () => {
  it("exposes the right landmarks", () => {
    render(<Example />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Today" })).toBeInTheDocument();
  });

  it("links the brand and keeps the current page marked", () => {
    render(<Example />);
    // The brand renders twice: once in the sidebar, once in the phone bar.
    for (const link of screen.getAllByRole("link", { name: "Trailcrew" })) {
      expect(link).toHaveAttribute("href", "/recruit");
    }
    expect(screen.getByRole("link", { name: "Today" })).toHaveAttribute("aria-current", "page");
  });

  it("renders the note and the sidebar footer", () => {
    render(<Example />);
    expect(screen.getByText("Demo data, all made up.")).toBeInTheDocument();
    expect(screen.getByText("Dana Ruiz, recruiter")).toBeInTheDocument();
  });

  it("the phone menu button opens and the nav closes it", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const menu = screen.getByRole("button", { name: "Menu" });
    expect(menu).toHaveAttribute("aria-expanded", "false");
    await user.click(menu);
    expect(menu).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByRole("link", { name: "Candidates" }));
    expect(menu).toHaveAttribute("aria-expanded", "false");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Example />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
