import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tag } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/Tag",
  component: Tag,
  args: { children: "Referral" },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Group: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--talus-space-2)", flexWrap: "wrap" }}>
      <Tag>React</Tag>
      <Tag>TypeScript</Tag>
      <Tag>Design systems</Tag>
      <Tag>Salida, CO</Tag>
    </div>
  ),
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <div style={{ display: "flex", gap: "var(--talus-space-2)" }}>
        <Tag>Referral</Tag>
        <Tag>Remote</Tag>
      </div>
    </ModeSplit>
  ),
};
