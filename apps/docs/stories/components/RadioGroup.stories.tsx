import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup, Radio } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  args: {
    label: "Pack size",
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="s">Small, 18 liters</Radio>
      <Radio value="m">Medium, 28 liters</Radio>
      <Radio value="l">Large, 40 liters</Radio>
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: "Measured by main compartment volume." },
};

export const WithSelection: Story = {
  args: { defaultValue: "m" },
};

export const WithError: Story = {
  args: { errorMessage: "Pick a size to continue." },
};

export const Disabled: Story = {
  args: { isDisabled: true, defaultValue: "m" },
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <RadioGroup label="Pack size" defaultValue="m">
        <Radio value="s">Small</Radio>
        <Radio value="m">Medium</Radio>
        <Radio value="l">Large</Radio>
      </RadioGroup>
    </ModeSplit>
  ),
};
