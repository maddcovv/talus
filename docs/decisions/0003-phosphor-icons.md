# 0003: Phosphor icons, not Lucide

Date: 2026-11-24. Status: accepted.

## Context

The system needs one icon set that reads well at 16 to 24 px, covers both a
buttoned-up enterprise product and a warmer consumer one, and ships as React
components with a tree-shakeable import.

## Decision

Icons come from `@phosphor-icons/react`. They are sized with the `size.icon`
tokens, colored with the `color.icon` tokens, and marked `aria-hidden` when
decorative. Phosphor's duotone and fill weights give the consumer brand room
to warm up later without changing sets.

## Consequences

No mixing: a screen with one Lucide icon in it is a bug. Any icon need that
Phosphor cannot cover becomes a proposal for a custom icon drawn to
Phosphor's grid, not a second library.
