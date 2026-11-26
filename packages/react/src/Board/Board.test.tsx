import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { vi } from "vitest";
import { Board, BoardColumn, BoardCard } from "./Board";

const columns = [
  { id: "applied", title: "Applied" },
  { id: "interview", title: "Interview" },
];

function Demo({ onMove = () => {} }: { onMove?: (cardId: string, toColumnId: string) => void }) {
  return (
    <Board aria-label="Pipeline" columns={columns} onMove={onMove}>
      <BoardColumn id="applied" title="Applied" count={1}>
        <BoardCard id="c1" title="June Halloran">
          <span>Senior Frontend Engineer</span>
        </BoardCard>
      </BoardColumn>
      <BoardColumn id="interview" title="Interview" count={0} />
    </Board>
  );
}

describe("Board", () => {
  it("renders labeled columns with counts", () => {
    render(<Demo />);
    expect(screen.getByRole("group", { name: "Pipeline" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Applied" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Interview" })).toBeInTheDocument();
  });

  it("moves a card with the keyboard and announces it", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    render(<Demo onMove={onMove} />);
    await user.tab();
    expect(screen.getByRole("button", { name: "Move June Halloran" })).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.click(await screen.findByRole("menuitem", { name: "Move to Interview" }));
    expect(onMove).toHaveBeenCalledWith("c1", "interview");
    expect(screen.getByText("June Halloran moved to Interview.")).toBeInTheDocument();
  });

  it("does not offer the card's own column as a target", async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByRole("button", { name: "Move June Halloran" }));
    const items = await screen.findAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual(["Move to Interview"]);
  });

  it("has no axe violations, closed and with the menu open", async () => {
    const user = userEvent.setup();
    const { container } = render(<Demo />);
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole("button", { name: "Move June Halloran" }));
    await screen.findByRole("menu");
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
