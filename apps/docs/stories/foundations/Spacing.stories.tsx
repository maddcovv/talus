import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { vars, primitives } from "@talus/tokens";

const meta = {
  title: "Foundations/Spacing",
  parameters: {
    docs: {
      description: {
        component:
          "The spacing scale and radius steps come straight from the primitive tokens. Radius is the one place the brands differ in shape: enterprise maps radius.control to 4px, consumer to 2px.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const label: React.CSSProperties = {
  fontFamily: vars.font.family.mono,
  fontSize: vars.font.size.caption,
  color: vars.color.text.secondary,
  inlineSize: "8rem",
  flexShrink: 0,
};

export const Scale: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: vars.space["2"] }}>
      {Object.entries(primitives.space).map(([step, value]) => (
        <div key={step} style={{ display: "flex", alignItems: "center", gap: vars.space["3"] }}>
          <code style={label}>
            space.{step} = {value}
          </code>
          <span
            aria-hidden
            style={{
              display: "inline-block",
              inlineSize: `var(--talus-space-${step})`,
              blockSize: vars.space["4"],
              background: vars.color.bg["brand-subtle"],
              border: `var(--talus-border-width-control) solid ${vars.color.border.selected}`,
            }}
          />
        </div>
      ))}
    </div>
  ),
};

export const Radius: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: vars.space["4"] }}>
      {Object.entries(primitives.radius).map(([step, value]) => (
        <div key={step} style={{ textAlign: "center" }}>
          <span
            aria-hidden
            style={{
              display: "inline-block",
              inlineSize: vars.space["16"],
              blockSize: vars.space["12"],
              borderRadius: `var(--talus-radius-${step})`,
              background: vars.color.bg.subtle,
              border: `var(--talus-border-width-control) solid ${vars.color.border.strong}`,
            }}
          />
          <div>
            <code style={{ fontFamily: vars.font.family.mono, fontSize: vars.font.size.caption }}>
              radius.{step} = {value}
            </code>
          </div>
        </div>
      ))}
    </div>
  ),
};
