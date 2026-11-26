import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorSummary, TextField } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/ErrorSummary",
  component: ErrorSummary,
  args: {
    title: "There are 2 things to fix",
    autoFocus: false,
    items: [
      { targetId: "demo-phone", label: "Add your phone number." },
      { targetId: "demo-auth", label: "Answer: Are you authorized to work in the United States?" },
    ],
  },
} satisfies Meta<typeof ErrorSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const JumpsToTheField: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--talus-space-5)" }}>
      <ErrorSummary {...args} />
      <div id="demo-phone">
        <TextField label="Phone" errorMessage="Needs your answer." />
      </div>
      <div id="demo-auth">
        <TextField label="Are you authorized to work in the United States?" />
      </div>
    </div>
  ),
};

export const OneThing: Story = {
  args: {
    title: "There is 1 thing to fix",
    items: [{ targetId: "demo-phone", label: "Add your phone number." }],
  },
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <ErrorSummary
        autoFocus={false}
        title="There is 1 thing to fix"
        items={[{ targetId: "demo-phone", label: "Add your phone number." }]}
      />
    </ModeSplit>
  ),
};
