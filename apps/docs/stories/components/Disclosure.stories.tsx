import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Disclosure } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/Disclosure",
  component: Disclosure,
  args: {
    title: "Senior Frontend Engineer, Blue Mesa Software",
    detail: "2022 to now",
    children: (
      <p style={{ margin: 0 }}>
        Led the component library used by four product teams. Shipped the accessibility pass that
        took dashboards to WCAG 2.1 AA.
      </p>
    ),
  },
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Expanded: Story = {
  args: { defaultExpanded: true },
};

export const Group: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--talus-space-2)" }}>
      <Disclosure title="Senior Frontend Engineer, Blue Mesa Software" detail="2022 to now">
        <p style={{ margin: 0 }}>Led the component library used by four product teams.</p>
      </Disclosure>
      <Disclosure title="Frontend Engineer, Cairn Analytics" detail="2018 to 2022">
        <p style={{ margin: 0 }}>Built dashboard views in React and TypeScript.</p>
      </Disclosure>
      <Disclosure title="Trail guide, Hogback Gear Works" detail="2016 to 2018">
        <p style={{ margin: 0 }}>Led day trips of up to twelve guests.</p>
      </Disclosure>
    </div>
  ),
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <Disclosure title="Frontend Engineer, Cairn Analytics" detail="2018 to 2022" defaultExpanded>
        <p style={{ margin: 0 }}>Built dashboard views in React and TypeScript.</p>
      </Disclosure>
    </ModeSplit>
  ),
};
