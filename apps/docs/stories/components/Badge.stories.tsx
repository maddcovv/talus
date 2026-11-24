import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: {
    children: "Shipped",
    variant: "success",
  },
  argTypes: {
    variant: { control: "select", options: ["success", "warning", "danger", "info", "neutral"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {};

export const Warning: Story = { args: { variant: "warning", children: "Low stock" } };

export const Danger: Story = { args: { variant: "danger", children: "Payment failed" } };

export const Info: Story = { args: { variant: "info", children: "In review" } };

export const Neutral: Story = { args: { variant: "neutral", children: "Draft" } };

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--talus-space-2)" }}>
        <Badge variant="success">Shipped</Badge>
        <Badge variant="warning">Low stock</Badge>
        <Badge variant="danger">Payment failed</Badge>
        <Badge variant="info">In review</Badge>
        <Badge variant="neutral">Draft</Badge>
      </div>
    </ModeSplit>
  ),
};
