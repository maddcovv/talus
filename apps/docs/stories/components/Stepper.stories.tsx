import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const steps = [{ label: "Your details" }, { label: "Resume" }, { label: "Questions" }, { label: "Review" }];

const meta = {
  title: "Components/Stepper",
  component: Stepper,
  args: {
    label: "Application steps",
    steps,
    current: 1,
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FirstStep: Story = { args: { current: 0 } };

export const LastStep: Story = { args: { current: 3 } };

/** With onStepClick, completed steps are buttons that go back. */
export const Interactive: Story = {
  render: (args) => {
    const [current, setCurrent] = useState(2);
    return <Stepper {...args} current={current} onStepClick={setCurrent} />;
  },
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <Stepper label="Application steps" steps={steps} current={1} onStepClick={() => {}} />
    </ModeSplit>
  ),
};
