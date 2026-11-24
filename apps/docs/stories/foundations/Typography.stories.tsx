import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { vars, brand as brandTokens, type Brand } from "@talus/tokens";

const meta = {
  title: "Foundations/Typography",
  parameters: {
    docs: {
      description: {
        component:
          "The type scale comes from the brand tokens. Enterprise sets IBM Plex Sans at compact sizes; consumer sets Archivo extrabold display over larger IBM Plex Sans body text. Switch Brand in the toolbar to compare.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const sampleText = "Granite ridge, spruce line, open sky";

const displayRoles = ["display", "h1", "h2", "h3"] as const;
const bodyRoles = ["body", "body-sm", "label", "caption"] as const;

export const TypeScale: Story = {
  render: (_args, context) => {
    const brandName = String(context.globals.brand ?? "enterprise") as Brand;
    const scale = brandTokens[brandName].font.size;
    const families = brandTokens[brandName].font.family;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: vars.space["6"] }}>
        {displayRoles.map((role) => (
          <div key={role}>
            <code
              style={{
                fontFamily: vars.font.family.mono,
                fontSize: vars.font.size.caption,
                color: vars.color.text.secondary,
              }}
            >
              font.size.{role} = {scale[role]} / {families.display.join(", ")}
            </code>
            <div
              style={{
                fontFamily: vars.font.family.display,
                fontWeight: vars.font.weight.display,
                fontSize: `var(--talus-font-size-${role})`,
                lineHeight: vars.font["line-height"].tight,
              }}
            >
              {sampleText}
            </div>
          </div>
        ))}
        {bodyRoles.map((role) => (
          <div key={role}>
            <code
              style={{
                fontFamily: vars.font.family.mono,
                fontSize: vars.font.size.caption,
                color: vars.color.text.secondary,
              }}
            >
              font.size.{role} = {scale[role]} / {families.body.join(", ")}
            </code>
            <div
              style={{
                fontFamily: vars.font.family.body,
                fontSize: `var(--talus-font-size-${role})`,
                lineHeight: vars.font["line-height"].normal,
              }}
            >
              {sampleText}. The quick brown fox jumps over the lazy dog, 0123456789.
            </div>
          </div>
        ))}
        <div>
          <code
            style={{
              fontFamily: vars.font.family.mono,
              fontSize: vars.font.size.caption,
              color: vars.color.text.secondary,
            }}
          >
            font.family.mono = {families.mono.join(", ")}
          </code>
          <div style={{ fontFamily: vars.font.family.mono, fontSize: vars.font.size.body }}>
            pnpm build:tokens writes dist/talus.css
          </div>
        </div>
      </div>
    );
  },
};
