import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineAlert } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/InlineAlert",
  component: InlineAlert,
  args: {
    variant: "info",
    title: "Applications pause over the holidays",
    children: "Anything sent after Dec 19 gets a first look in the new year.",
  },
  argTypes: {
    variant: { control: "select", options: ["info", "success", "warning", "danger"] },
  },
} satisfies Meta<typeof InlineAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Application sent",
    children: "Two Track Supply has your application. The tracker below shows what happens next.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Your resume is from 2022",
    children: "You can send it as is, or upload a newer one before you submit.",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    title: "The upload did not finish",
    children: "Your draft is saved. Try the upload again from the Resume step.",
  },
};

export const Dismissible: Story = {
  args: { onDismiss: () => {} },
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--talus-space-2)" }}>
        <InlineAlert variant="info" title="Heads up">
          Info body.
        </InlineAlert>
        <InlineAlert variant="danger" title="Something broke">
          Danger body.
        </InlineAlert>
      </div>
    </ModeSplit>
  ),
};
