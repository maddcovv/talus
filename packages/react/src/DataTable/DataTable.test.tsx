import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { vi } from "vitest";
import { DataTable, type DataTableColumn } from "./DataTable";

const columns: DataTableColumn[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "stage", label: "Stage" },
];

const items = [
  { id: "1", name: "June Halloran", stage: "Interview" },
  { id: "2", name: "Priya Natarajan", stage: "Applied" },
];

function renderCell(item: (typeof items)[number], key: string) {
  return item[key as "name" | "stage"];
}

describe("DataTable", () => {
  it("renders rows and column headers", () => {
    render(
      <DataTable aria-label="Candidates" columns={columns} items={items} renderCell={renderCell} />,
    );
    expect(screen.getByRole("grid", { name: "Candidates" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Name/ })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "June Halloran" })).toBeInTheDocument();
  });

  it("asks for a sort when a sortable header is pressed", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <DataTable
        aria-label="Candidates"
        columns={columns}
        items={items}
        renderCell={renderCell}
        onSortChange={onSortChange}
      />,
    );
    await user.click(screen.getByRole("columnheader", { name: /Name/ }));
    expect(onSortChange).toHaveBeenCalledWith({ column: "name", direction: "ascending" });
  });

  it("selects all rows from the header checkbox", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        aria-label="Candidates"
        columns={columns}
        items={items}
        renderCell={renderCell}
        selectionMode="multiple"
        onSelectionChange={onSelectionChange}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Select all rows" }));
    expect(onSelectionChange).toHaveBeenCalled();
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });

  it("shows the empty state and the loading state", () => {
    const { rerender } = render(
      <DataTable
        aria-label="Candidates"
        columns={columns}
        items={[]}
        renderCell={renderCell}
        emptyState="No candidates match."
      />,
    );
    expect(screen.getByText("No candidates match.")).toBeInTheDocument();
    rerender(
      <DataTable
        aria-label="Candidates"
        columns={columns}
        items={items}
        renderCell={renderCell}
        isLoading
        loadingLabel="Loading candidates"
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading candidates");
  });

  it("has no axe violations, with and without selection", async () => {
    const plain = render(
      <DataTable aria-label="Candidates" columns={columns} items={items} renderCell={renderCell} />,
    );
    expect(await axe(plain.container)).toHaveNoViolations();
    plain.unmount();
    const selectable = render(
      <DataTable
        aria-label="Candidates"
        columns={columns}
        items={items}
        renderCell={renderCell}
        selectionMode="multiple"
        selectedKeys={new Set(["1"])}
      />,
    );
    expect(await axe(selectable.container)).toHaveNoViolations();
  });
});
