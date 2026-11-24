import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { vars, primitives, colorModes, type ColorMode } from "@talus/tokens";

const meta = {
  title: "Foundations/Colors",
  parameters: {
    docs: {
      description: {
        component:
          "Every color here comes straight from the token files. Semantic colors are the only ones products use; the ramps underneath feed them. Switch Brand and Scheme in the toolbar to see each mode remap the same token names.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function currentMode(globals: Record<string, unknown>): ColorMode {
  const brand = String(globals.brand ?? "enterprise");
  const scheme = String(globals.scheme ?? "light");
  return brand === "consumer" ? "consumer-light" : (`enterprise-${scheme}` as ColorMode);
}

function flatten(
  node: Record<string, unknown>,
  trail: string[] = []
): Array<{ name: string; value: string }> {
  const out: Array<{ name: string; value: string }> = [];
  for (const [key, child] of Object.entries(node)) {
    if (typeof child === "string") {
      out.push({ name: [...trail, key].join("."), value: child });
    } else if (child && typeof child === "object") {
      out.push(...flatten(child as Record<string, unknown>, [...trail, key]));
    }
  }
  return out;
}

function Swatch({ name, cssVar, hex }: { name: string; cssVar: string; hex: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: vars.space["3"],
        minBlockSize: vars.size["touch-min"],
      }}
    >
      <span
        aria-hidden
        style={{
          inlineSize: vars.space["10"],
          blockSize: vars.space["8"],
          flexShrink: 0,
          borderRadius: vars.radius.control,
          border: `var(--talus-border-width-control) solid ${vars.color.border.default}`,
          background: cssVar,
        }}
      />
      <span style={{ display: "flex", flexDirection: "column" }}>
        <code style={{ fontFamily: vars.font.family.mono, fontSize: vars.font.size.caption }}>
          {name}
        </code>
        <span style={{ fontSize: vars.font.size.caption, color: vars.color.text.secondary }}>
          {hex}
        </span>
      </span>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))",
        gap: vars.space["2"],
      }}
    >
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBlockEnd: vars.space["8"] }}>
      <h3
        style={{
          fontFamily: vars.font.family.body,
          fontSize: vars.font.size.h3,
          fontWeight: vars.font.weight.semibold,
          marginBlockEnd: vars.space["3"],
        }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

export const Semantic: Story = {
  render: (_args, context) => {
    const mode = currentMode(context.globals);
    const resolved = colorModes[mode].color;
    const groups = Object.keys(resolved) as Array<keyof typeof resolved>;
    return (
      <div>
        {groups.map((group) => {
          const entries = flatten(resolved[group] as unknown as Record<string, unknown>);
          return (
            <Section key={group} title={`color.${group}`}>
              <Grid>
                {entries.map((entry) => (
                  <Swatch
                    key={entry.name}
                    name={`color.${group}.${entry.name}`}
                    cssVar={`var(--talus-color-${group}-${entry.name.split(".").join("-")})`}
                    hex={entry.value}
                  />
                ))}
              </Grid>
            </Section>
          );
        })}
      </div>
    );
  },
};

export const Ramps: Story = {
  render: () => {
    const ramps = primitives.color;
    return (
      <div>
        {Object.entries(ramps).map(([rampName, steps]) => (
          <Section key={rampName} title={`color.${rampName}`}>
            <Grid>
              {Object.entries(steps as Record<string, string>).map(([step, hex]) => (
                <Swatch
                  key={step}
                  name={`color.${rampName}.${step}`}
                  cssVar={`var(--talus-color-${rampName}-${step})`}
                  hex={hex}
                />
              ))}
            </Grid>
          </Section>
        ))}
      </div>
    );
  },
};
