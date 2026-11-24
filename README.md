# Talus

Talus is a design system with two brands on one token foundation.

- **Enterprise**: dense, quiet, built for data-heavy work tools. IBM Plex Sans, small radii, compact controls. Light and dark color modes.
- **Consumer**: bigger, warmer, built for shopping and browsing. Archivo for headlines, sharp corners, heavy control edges. Light mode only for now.

Both brands read from the same token files, and the same files drive the Figma library, so code and design stay in sync.

All product names and data in this repository are fictional. Talus is a portfolio project by John Reese, built with Claude.

## Packages

| Package | What it is |
| --- | --- |
| `packages/tokens` | The W3C format token source plus a Style Dictionary build that writes `dist/talus.css` (CSS variables) and `dist/tokens.ts` (typed values) |
| `packages/react` | React components styled with CSS modules that use only `--talus-*` variables. Behavior comes from React Aria Components |
| `apps/docs` | Storybook: every component in every state, in both brands, with a Foundations section generated from the tokens |

## Getting started

```bash
pnpm install
pnpm build:tokens
pnpm test
pnpm storybook
```

## Theming

Two attributes on `<html>` pick the theme:

```html
<html data-brand="enterprise" data-scheme="dark">
```

- `data-brand`: `enterprise` or `consumer`
- `data-scheme`: `light` or `dark`

Enterprise light is the default when the attributes are missing. Consumer has no dark mode yet, so it stays light whatever `data-scheme` says.

## Accessibility

WCAG 2.1 AA is a build requirement, not a cleanup pass. Every text, icon, border and chart pair in the token set passes contrast checks in all three color modes (see `packages/tokens/CONTRAST.md`). Every component ships with keyboard support, visible focus, real labels, and a jest-axe test that must pass before merge.
