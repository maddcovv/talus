import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SourceChip, TextField } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/SourceChip",
  component: SourceChip,
  args: {
    source: "your resume, page 1",
    children: "Trail guide, Hogback Gear Works, 2021 to 2024",
  },
} satisfies Meta<typeof SourceChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The chip sits beside the value it explains. */
export const NextToAField: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--talus-space-2)" }}>
      <TextField label="Most recent role" defaultValue="Trail guide, Hogback Gear Works" />
      <SourceChip source="your resume, page 1">
        Trail guide, Hogback Gear Works, 2021 to 2024
      </SourceChip>
    </div>
  ),
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <SourceChip source="your resume, page 1">
        Trail guide, Hogback Gear Works, 2021 to 2024
      </SourceChip>
    </ModeSplit>
  ),
};
