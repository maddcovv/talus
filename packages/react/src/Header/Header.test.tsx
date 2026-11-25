import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Header } from "./Header";

describe("Header", () => {
  it("renders a banner with a labeled nav", () => {
    render(
      <Header
        brand="Trailcrew"
        brandHref="/"
        nav={
          <>
            <a href="/today" aria-current="page">
              Today
            </a>
            <a href="/pipeline">Pipeline</a>
          </>
        }
      />,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Today" })).toHaveAttribute("aria-current", "page");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Header
        brand="Trailcrew"
        nav={
          <>
            <a href="/today">Today</a>
            <a href="/pipeline" aria-current="page">
              Pipeline
            </a>
          </>
        }
        end={<span>Dana Ruiz</span>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
