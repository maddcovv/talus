# 0004: Figma variables sync from the repo's tokens, by hand for now

Date: 2026-11-24. Status: accepted.

## Context

The token JSON in `packages/tokens/src/` and the variables in the Figma
library must never drift: a designer picking
`color.action.primary.bg-hover` in Figma and a developer writing
`--talus-color-action-primary-bg-hover` must get the same value. Figma's
REST API can write variables only on an Enterprise plan, which this project
does not have.

## Decision

The repo is the source of truth. Figma variables are synced from the repo's
token files by the portfolio session (reading the JSON and applying it in
Figma), not by an automated API push. The CSS variable naming rule
(`--talus-` plus the token path joined with hyphens) matches the code syntax
field on every Figma variable, so the mapping needs no lookup table.

## Consequences

A token change is not done until Figma matches. The sync is a manual step and
is listed in the release checklist for any token change. If the project ever
gains Enterprise API access, this decision is revisited in favor of a push
from CI; the naming rule already makes that mechanical.
