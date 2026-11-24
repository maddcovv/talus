import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select, SelectItem } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/Select",
  component: Select,
  args: {
    label: "Ship from",
    placeholder: "Pick a warehouse",
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem id="north">North Ridge warehouse</SelectItem>
      <SelectItem id="valley">Valley Flats warehouse</SelectItem>
      <SelectItem id="coast">Coast Range warehouse</SelectItem>
      <SelectItem id="closed" isDisabled>
        Old Mill warehouse (closed)
      </SelectItem>
    </Select>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: { defaultSelectedKey: "valley" },
};

export const WithHint: Story = {
  args: { hint: "Orders ship the next business day." },
};

export const WithError: Story = {
  args: { errorMessage: "Pick a warehouse to continue." },
};

export const Disabled: Story = {
  args: { isDisabled: true, defaultSelectedKey: "north" },
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <div style={{ display: "grid", gap: "var(--talus-space-4)" }}>
        <Select label="Ship from" placeholder="Pick a warehouse">
          <SelectItem id="north">North Ridge</SelectItem>
          <SelectItem id="valley">Valley Flats</SelectItem>
        </Select>
        <Select label="Ship from" defaultSelectedKey="valley">
          <SelectItem id="north">North Ridge</SelectItem>
          <SelectItem id="valley">Valley Flats</SelectItem>
        </Select>
      </div>
    </ModeSplit>
  ),
};
