import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Badge,
  DataTable,
  type DataTableColumn,
  type Selection,
  type SortDescriptor,
} from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

interface Candidate {
  id: string;
  name: string;
  role: string;
  stage: string;
  applied: string;
}

const candidates: Candidate[] = [
  { id: "1", name: "June Halloran", role: "Senior Frontend Engineer", stage: "Interview", applied: "Nov 12" },
  { id: "2", name: "Priya Natarajan", role: "Warehouse Lead", stage: "Applied", applied: "Nov 18" },
  { id: "3", name: "Cole Bratton", role: "Customer Support Specialist", stage: "Offer", applied: "Nov 3" },
  { id: "4", name: "Mara Odell", role: "Warehouse Lead", stage: "In review", applied: "Nov 16" },
];

const columns: DataTableColumn[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "role", label: "Role" },
  { key: "stage", label: "Stage" },
  { key: "applied", label: "Applied", sortable: true, align: "end" },
];

function renderCell(item: Candidate, key: string) {
  if (key === "stage") return <Badge>{item.stage}</Badge>;
  return item[key as keyof Candidate];
}

const meta = {
  title: "Components/DataTable",
  component: DataTable,
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [sort, setSort] = useState<SortDescriptor>({ column: "name", direction: "ascending" });
    const sorted = [...candidates].sort((a, b) => {
      const col = String(sort.column) as keyof Candidate;
      const order = a[col].localeCompare(b[col]);
      return sort.direction === "descending" ? -order : order;
    });
    return (
      <DataTable
        aria-label="Candidates"
        columns={columns}
        items={sorted}
        renderCell={renderCell}
        sortDescriptor={sort}
        onSortChange={setSort}
      />
    );
  },
};

export const WithSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState<Selection>(new Set(["1"]));
    return (
      <DataTable
        aria-label="Candidates"
        columns={columns}
        items={candidates}
        renderCell={renderCell}
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      />
    );
  },
};

export const Empty: Story = {
  render: () => (
    <DataTable
      aria-label="Candidates"
      columns={columns}
      items={[]}
      renderCell={renderCell}
      emptyState="No candidates match these filters."
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <DataTable
      aria-label="Candidates"
      columns={columns}
      items={[]}
      renderCell={renderCell}
      isLoading
      loadingLabel="Loading candidates"
    />
  ),
};

export const StickyHeader: Story = {
  render: () => (
    <DataTable
      aria-label="Candidates"
      columns={columns}
      items={[...candidates, ...candidates.map((c) => ({ ...c, id: `${c.id}b` })), ...candidates.map((c) => ({ ...c, id: `${c.id}c` }))]}
      renderCell={renderCell}
      style={{ maxBlockSize: "240px" }}
    />
  ),
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <DataTable
        aria-label="Candidates"
        columns={columns.slice(0, 2)}
        items={candidates.slice(0, 2)}
        renderCell={renderCell}
      />
    </ModeSplit>
  ),
};
