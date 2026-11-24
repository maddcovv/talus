# Talus, for Claude

Talus is a design system with two brands on one token foundation. It exists to show that products built on it, Trailcrew (hiring platform) and Two Track Supply (outdoor gear marketplace), can share components and still look like two different companies. All names and data are fictional. The token files also drive the Figma library, so code and design must stay in sync: change tokens only in `packages/tokens/src/`, never in generated output.

## Layout

- `packages/tokens`: token source (W3C design token JSON) in `src/`, Style Dictionary build in `build.mjs`, output in `dist/` (`talus.css` and `tokens.ts`). `pnpm build:tokens` regenerates. Never edit `dist/` by hand.
- `packages/react`: components in `src/<Name>/`, one folder per component with `<Name>.tsx`, `<Name>.module.css` and `<Name>.test.tsx`.
- `apps/docs`: Storybook. Stories and docs pages in `stories/components/`, token-driven foundation pages in `stories/foundations/`.

## Token layers

1. **Primitives** (`primitives.json`): raw colors, spacing, radius, fonts, durations. Products and components never use these directly.
2. **Brand** (`brand/enterprise.json`, `brand/consumer.json`): type, control sizes, density, radius mapping, control border width. Same keys in both brands.
3. **Color modes** (`color/enterprise-light.json`, `color/enterprise-dark.json`, `color/consumer-light.json`): semantic colors. Same keys in all three.
4. **Global** (`global.json`): easing, motion, z-index, breakpoints, icon sizes, elevation.
5. **Components** (`components.json`): component tokens that alias the layers above.

## Naming rule

A CSS variable is `--talus-` plus the token path joined with hyphens. `color.action.primary.bg-hover` is `--talus-color-action-primary-bg-hover`; `space.4` is `--talus-space-4`; `control.height.md` is `--talus-control-height-md`. This matches the code syntax on every Figma variable exactly. Never invent a variable name; if the token does not exist, add it to the token source and rebuild.

## Styling rules

- **Only use `--talus-*` variables** in component CSS. No hard-coded colors, sizes, fonts, shadows or durations. Derived values are fine as `calc()` over talus variables.
- Semantic tokens only: components use `--talus-color-text-primary`, never `--talus-color-granite-900` and never hex.
- Theme switching is two attributes on `<html>`: `data-brand` (`enterprise` or `consumer`) and `data-scheme` (`light` or `dark`). Enterprise light is the default. Consumer has no dark mode yet and stays light whatever `data-scheme` says. Components never read these attributes; they just use variables.
- Animate with `--talus-motion-duration-*` and `--talus-easing-*`. The motion durations drop to 0ms under `prefers-reduced-motion`; a looping animation also needs its own `@media (prefers-reduced-motion: reduce)` rule to stop.

## Changing a color

Colors live in `packages/tokens/gen.py`, which writes the token JSON and `CONTRAST.md`. After any color change run `python3 gen.py` inside `packages/tokens` and keep all 141 contrast pairs passing, then `pnpm build:tokens`. Do not edit color values directly in the JSON.

## How to add a component

1. Create `packages/react/src/<Name>/` with `<Name>.tsx`, `<Name>.module.css`, `<Name>.test.tsx`. Export from `src/index.ts`.
2. Build behavior on React Aria Components (keyboard, focus, ARIA); style it with CSS modules over `--talus-*` variables only. State styling hangs off the React Aria data attributes (`[data-hovered]`, `[data-selected]`, `[data-focus-visible]`, `[data-disabled]`, `[data-invalid]`).
3. Icons come from `@phosphor-icons/react`, sized with the `size.icon` tokens, colored with the `color.icon` tokens, `aria-hidden` when decorative. Not Lucide.
4. Tests: Vitest with Testing Library and jest-axe. Cover the keyboard path and run axe over every state. `pnpm test` must pass with zero axe violations.
5. Stories: `apps/docs/stories/components/<Name>.stories.tsx` with a story per state plus a `Modes` story using `ModeSplit`, and `<Name>.mdx` with usage notes.

## Accessibility rules (WCAG 2.1 AA, non-negotiable)

- Visible focus ring on everything interactive: `var(--talus-focus-ring-width)` solid `var(--talus-color-border-focus)` with `var(--talus-focus-ring-offset)` offset, on `[data-focus-visible]`.
- Full keyboard paths: Tab everywhere, arrow keys inside radio groups, listboxes and tab lists, Escape closes overlays, focus returns to the trigger.
- Every input has a real visible label. Hints and errors tie in through `aria-describedby` (React Aria wires this when you use its `Label`, `Text slot="description"` and `FieldError` parts).
- Errors and states never rely on color alone: pair color with text, an icon or a shape change.
- Pointer targets at least 24 by 24 px; give label rows `min-block-size: var(--talus-size-touch-min)`.
- Respect `prefers-reduced-motion`.

## Writing rules

No em dashes or en dashes anywhere in the repo. Fictional names and made-up data only. Plain words.
