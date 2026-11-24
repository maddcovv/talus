import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/TextField",
  component: TextField,
  args: {
    label: "Shop name",
    placeholder: "Juniper Supply Co.",
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: "Shown on your public seller page." },
};

export const WithError: Story = {
  args: { errorMessage: "Enter a shop name to continue." },
};

export const Disabled: Story = {
  args: { isDisabled: true, defaultValue: "Juniper Supply Co." },
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <div style={{ display: "grid", gap: "var(--talus-space-4)" }}>
        <TextField label="Shop name" placeholder="Juniper Supply Co." />
        <TextField label="Contact email" hint="Order updates go here." />
        <TextField label="City" errorMessage="Enter a city." />
      </div>
    </ModeSplit>
  ),
};
