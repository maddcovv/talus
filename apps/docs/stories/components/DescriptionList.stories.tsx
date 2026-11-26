import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Briefcase, CalendarBlank, CurrencyCircleDollar, MapPin } from "@phosphor-icons/react";
import { DescriptionList } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const keyFacts = [
  { icon: <CurrencyCircleDollar />, label: "Pay", value: "$150,000 to $175,000 a year" },
  { icon: <MapPin />, label: "Location", value: "Remote (US)" },
  { icon: <Briefcase />, label: "Work type", value: "Full time, remote" },
  { icon: <CalendarBlank />, label: "Application deadline", value: "Closes December 15, 2026" },
];

const meta = {
  title: "Components/DescriptionList",
  component: DescriptionList,
  args: {
    "aria-label": "Key facts",
    items: keyFacts,
  },
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutIcons: Story = {
  args: {
    items: [
      { label: "Department", value: "Engineering" },
      { label: "Posted", value: "November 7, 2026" },
      { label: "Job ID", value: "TTS-26-042" },
    ],
  },
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <DescriptionList aria-label="Key facts" items={keyFacts.slice(0, 2)} />
    </ModeSplit>
  ),
};
