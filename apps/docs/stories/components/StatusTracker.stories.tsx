import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusTracker, type StatusTrackerStage } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const inFlight: StatusTrackerStage[] = [
  { label: "Application received", date: "Nov 12", state: "done" },
  { label: "Screening call", date: "Nov 18", state: "done" },
  { label: "Working session", state: "current" },
  { label: "Offer", state: "upcoming" },
];

const closed: StatusTrackerStage[] = [
  { label: "Application received", date: "Oct 2", state: "done" },
  { label: "Screening call", date: "Oct 9", state: "done" },
  {
    label: "Position closed",
    date: "Oct 20",
    state: "closed",
    reason: "Two Track Supply filled the role from an internal transfer.",
  },
];

const meta = {
  title: "Components/StatusTracker",
  component: StatusTracker,
  args: {
    label: "Application progress",
    stages: inFlight,
  },
} satisfies Meta<typeof StatusTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Closed: Story = { args: { stages: closed } };

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <StatusTracker label="Application progress" stages={inFlight} />
    </ModeSplit>
  ),
};
