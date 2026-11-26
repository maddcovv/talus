import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, Header, Switch } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/Header",
  component: Header,
  parameters: { layout: "fullscreen" },
  args: {
    brand: "Trailcrew",
    brandHref: "#",
    nav: (
      <>
        <a href="#today" aria-current="page">
          Today
        </a>
        <a href="#pipeline">Pipeline</a>
        <a href="#jobs">Jobs</a>
      </>
    ),
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithEnd: Story = {
  args: {
    end: (
      <>
        <Switch>Dark</Switch>
        <Avatar name="Dana Ruiz" withLabel />
      </>
    ),
  },
};

export const Modes: Story = {
  render: (args) => (
    <ModeSplit>
      <Header {...args} />
    </ModeSplit>
  ),
};
