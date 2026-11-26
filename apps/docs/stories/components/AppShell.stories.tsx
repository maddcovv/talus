import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Briefcase, GearSix, Sun, UsersThree } from "@phosphor-icons/react";
import { AppShell, Avatar, Switch } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const nav = (
  <>
    <a href="#today" aria-current="page">
      <Sun aria-hidden />
      Today
    </a>
    <a href="#jobs">
      <Briefcase aria-hidden />
      Jobs
    </a>
    <a href="#candidates">
      <UsersThree aria-hidden />
      Candidates
    </a>
    <a href="#settings">
      <GearSix aria-hidden />
      Settings
    </a>
  </>
);

const meta = {
  title: "Components/AppShell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
  args: {
    brand: "Trailcrew",
    brandHref: "#home",
    nav,
    topBar: <input aria-label="Search" type="search" placeholder="Search" />,
    end: (
      <>
        <Switch>Dark</Switch>
        <Avatar name="Dana Ruiz" />
      </>
    ),
    children: (
      <div style={{ padding: "var(--talus-space-6)" }}>
        <h1 style={{ margin: 0 }}>Today</h1>
        <p>The page content renders in the main landmark.</p>
      </div>
    ),
    style: { minBlockSize: "28rem" },
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutTopBarExtras: Story = {
  args: { topBar: undefined, end: undefined },
};

export const Modes: Story = {
  render: (args) => (
    <ModeSplit>
      <AppShell {...args} style={{ minBlockSize: "20rem" }} />
    </ModeSplit>
  ),
};
