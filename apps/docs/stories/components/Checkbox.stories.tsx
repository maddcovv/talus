import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: {
    children: "Email me about order updates",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const Checked: Story = { args: { defaultSelected: true } };

export const Indeterminate: Story = {
  args: { isIndeterminate: true, children: "Select all line items" },
};

export const Disabled: Story = { args: { isDisabled: true } };

export const DisabledChecked: Story = {
  args: { isDisabled: true, defaultSelected: true },
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <div style={{ display: "grid", gap: "var(--talus-space-2)" }}>
        <Checkbox>Unchecked</Checkbox>
        <Checkbox defaultSelected>Checked</Checkbox>
        <Checkbox isIndeterminate>Indeterminate</Checkbox>
        <Checkbox isDisabled>Disabled</Checkbox>
      </div>
    </ModeSplit>
  ),
};
