# 0002: React Aria Components for behavior

Date: 2026-11-24. Status: accepted.

## Context

Keyboard support, focus management and screen reader wiring are the hardest
parts of a component library to get right and the easiest to get subtly
wrong. Writing them by hand for every component multiplies that risk.

## Decision

Every interactive component builds on React Aria Components (Adobe). Talus
adds the visual layer only: CSS modules over `--talus-*` variables, with
state styling hung off React Aria's data attributes (`[data-hovered]`,
`[data-selected]`, `[data-focus-visible]`, `[data-disabled]`,
`[data-invalid]`).

## Consequences

Arrow keys, Escape, focus return, labels and descriptions come from a
library that tests them across browsers and assistive tech. The cost is a
dependency on React Aria's component shapes and prop names; wrappers keep
Talus's public API small so that cost stays contained. jest-axe tests still
run on every state because a correct base does not excuse a broken
composition.
