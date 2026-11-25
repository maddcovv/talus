import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Meter } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/Meter",
  component: Meter,
  args: {
    label: "Attachments",
    value: 4,
    maxValue: 5,
    valueText: "4 of 5 attachments used",
  },
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { value: 0, valueText: "No attachments yet, up to 5" },
};

export const OverLimit: Story = {
  args: {
    value: 6,
    valueText: "6 of 5 attachments. Remove one to continue.",
  },
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--talus-space-4)" }}>
        <Meter label="Attachments" value={4} maxValue={5} valueText="4 of 5 attachments used" />
        <Meter
          label="Storage"
          value={12}
          maxValue={10}
          valueText="12 of 10 MB. Over the limit."
        />
      </div>
    </ModeSplit>
  ),
};
