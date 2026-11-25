import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Card } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const posting = (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--talus-space-2)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--talus-space-3)" }}>
      <strong>Gear repair technician</strong>
      <Badge variant="info">New</Badge>
    </div>
    <span style={{ color: "var(--talus-color-text-secondary)", fontSize: "var(--talus-font-size-body-sm)" }}>
      Two Track Supply, Fort Collins. Full time, on site.
    </span>
  </div>
);

const meta = {
  title: "Components/Card",
  component: Card,
  args: { children: posting },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Elevated: Story = { args: { elevated: true } };

/** One press target with a visible focus ring. */
export const Clickable: Story = { args: { onPress: () => {} } };

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <Card onPress={() => {}}>{posting}</Card>
    </ModeSplit>
  ),
};
