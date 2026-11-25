import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  args: { name: "June Halloran" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--talus-space-3)", alignItems: "center" }}>
      <Avatar name="June Halloran" size="sm" />
      <Avatar name="Dana Ruiz" size="md" />
      <Avatar name="Marcus Lee" size="lg" />
    </div>
  ),
};

export const WithName: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--talus-space-2)", alignItems: "center" }}>
      <Avatar name="Dana Ruiz" />
      <span style={{ fontFamily: "var(--talus-font-family-body)" }}>Dana Ruiz</span>
    </div>
  ),
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <div style={{ display: "flex", gap: "var(--talus-space-3)" }}>
        <Avatar name="June Halloran" />
        <Avatar name="Marcus Lee" />
      </div>
    </ModeSplit>
  ),
};
