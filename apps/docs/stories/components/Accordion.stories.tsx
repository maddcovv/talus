import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, Disclosure } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const rows = (
  <>
    <Disclosure id="blue-mesa" title="Senior Frontend Engineer, Blue Mesa Software" detail="2022 to now">
      <p style={{ margin: 0 }}>Led the component library used by four product teams.</p>
    </Disclosure>
    <Disclosure id="cairn" title="Frontend Engineer, Cairn Analytics" detail="2018 to 2022">
      <p style={{ margin: 0 }}>Built dashboard views in React and TypeScript.</p>
    </Disclosure>
    <Disclosure id="hogback" title="Trail guide, Hogback Gear Works" detail="2016 to 2018">
      <p style={{ margin: 0 }}>Led day trips of up to twelve guests.</p>
    </Disclosure>
  </>
);

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  args: { children: rows },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OneAtATime: Story = {
  args: { allowsMultipleExpanded: false },
};

export const StartsOpen: Story = {
  args: { defaultExpandedKeys: ["blue-mesa"] },
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <Accordion defaultExpandedKeys={["one"]}>
        <Disclosure id="one" title="First row" detail="open">
          <p style={{ margin: 0 }}>The first row's detail.</p>
        </Disclosure>
        <Disclosure id="two" title="Second row">
          <p style={{ margin: 0 }}>The second row's detail.</p>
        </Disclosure>
      </Accordion>
    </ModeSplit>
  ),
};
