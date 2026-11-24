import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@talus/react";
import { vars } from "@talus/tokens";
import { ArrowRight, Plus } from "@phosphor-icons/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Save changes",
    variant: "primary",
    size: "md",
  },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "danger", "ghost"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = { args: { variant: "secondary" } };

export const Danger: Story = { args: { variant: "danger", children: "Remove listing" } };

export const Ghost: Story = { args: { variant: "ghost", children: "Dismiss" } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: vars.space["3"] }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const Loading: Story = { args: { isLoading: true } };

export const Disabled: Story = { args: { isDisabled: true } };

export const WithIcon: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: vars.space["3"] }}>
      <Button {...args}>
        <Plus aria-hidden style={{ width: vars.size.icon.sm, height: vars.size.icon.sm }} />
        Add product
      </Button>
      <Button {...args} variant="secondary">
        Next step
        <ArrowRight aria-hidden style={{ width: vars.size.icon.sm, height: vars.size.icon.sm }} />
      </Button>
    </div>
  ),
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <div style={{ display: "flex", flexWrap: "wrap", gap: vars.space["2"] }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
        <Button isLoading>Loading</Button>
        <Button isDisabled>Disabled</Button>
      </div>
    </ModeSplit>
  ),
};
