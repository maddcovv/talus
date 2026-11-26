import { render, screen } from "@testing-library/react";
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
      end={<span>Dana Ruiz</span>}
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
    expect(screen.getByRole("link", { name: "Trailcrew" })).toHaveAttribute("href", "/recruit");
    expect(screen.getByRole("link", { name: "Today" })).toHaveAttribute("aria-current", "page");
  });

  it("puts the search in the top bar", () => {
    render(<Example />);
    expect(screen.getByRole("searchbox", { name: "Search" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Example />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
