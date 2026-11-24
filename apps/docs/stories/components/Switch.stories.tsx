import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/Switch",
  component: Switch,
  args: {
    children: "Vacation mode",
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};

export const On: Story = { args: { defaultSelected: true } };

export const Disabled: Story = { args: { isDisabled: true } };

export const DisabledOn: Story = { args: { isDisabled: true, defaultSelected: true } };

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <div style={{ display: "grid", gap: "var(--talus-space-2)" }}>
        <Switch>Off</Switch>
        <Switch defaultSelected>On</Switch>
        <Switch isDisabled>Disabled</Switch>
      </div>
    </ModeSplit>
  ),
};
