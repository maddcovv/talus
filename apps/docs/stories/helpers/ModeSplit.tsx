import React from "react";
import { vars } from "@talus/tokens";

const modes = [
  { label: "Enterprise light", brand: "enterprise", scheme: "light" },
  { label: "Enterprise dark", brand: "enterprise", scheme: "dark" },
  { label: "Consumer", brand: "consumer", scheme: "light" },
] as const;

/**
 * Renders the same content three times, once per color mode, by scoping the
 * theme attributes to a wrapper. The talus.css selectors match any element
 * carrying data-brand and data-scheme, not just <html>.
 */
export function ModeSplit({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: vars.space["4"] }}>
      {modes.map((mode) => (
        <section
          key={mode.label}
          data-brand={mode.brand}
          data-scheme={mode.scheme}
          style={{
            flex: "1 1 16rem",
            padding: vars.space["6"],
            borderRadius: vars.radius.container,
            background: vars.color.bg.canvas,
            color: vars.color.text.primary,
            fontFamily: vars.font.family.body,
          }}
        >
          <p
            style={{
              margin: 0,
              marginBlockEnd: vars.space["4"],
              fontSize: vars.font.size.caption,
              fontWeight: vars.font.weight.medium,
              color: vars.color.text.secondary,
            }}
          >
            {mode.label}
          </p>
          {children}
        </section>
      ))}
    </div>
  );
}
