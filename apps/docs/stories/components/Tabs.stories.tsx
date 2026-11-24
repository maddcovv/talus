import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabList, Tab, TabPanel } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs>
      <TabList aria-label="Order details">
        <Tab id="items">Items</Tab>
        <Tab id="shipping">Shipping</Tab>
        <Tab id="history">History</Tab>
      </TabList>
      <TabPanel id="items">Three items: one tent, two sleeping pads.</TabPanel>
      <TabPanel id="shipping">Ships from the Valley Flats warehouse tomorrow.</TabPanel>
      <TabPanel id="history">Placed Tuesday. Payment settled Wednesday.</TabPanel>
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs>
      <TabList aria-label="Candidate review">
        <Tab id="profile">Profile</Tab>
        <Tab id="interview">Interview notes</Tab>
        <Tab id="offer" isDisabled>
          Offer
        </Tab>
      </TabList>
      <TabPanel id="profile">Six years of trail crew leadership.</TabPanel>
      <TabPanel id="interview">Panel scheduled for Friday morning.</TabPanel>
      <TabPanel id="offer">No offer yet.</TabPanel>
    </Tabs>
  ),
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <Tabs>
        <TabList aria-label="Order details">
          <Tab id="items">Items</Tab>
          <Tab id="shipping">Shipping</Tab>
        </TabList>
        <TabPanel id="items">Three items in this order.</TabPanel>
        <TabPanel id="shipping">Ships tomorrow.</TabPanel>
      </Tabs>
    </ModeSplit>
  ),
};
