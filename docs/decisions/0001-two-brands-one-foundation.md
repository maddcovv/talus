# 0001: Two brands on one token foundation, with separate color modes

Date: 2026-11-24. Status: accepted.

## Context

Talus serves two fictional products that must not look alike: Trailcrew, an
enterprise hiring platform, and Two Track Supply, a consumer outdoor gear
marketplace. One component library has to carry both without forks.

## Decision

One set of primitives feeds two brand layers (type, density, radius, control
sizes) and three color modes (enterprise light, enterprise dark, consumer
light). Brands and modes switch with two attributes on `<html>`: `data-brand`
and `data-scheme`. Components read only semantic tokens and never know which
brand they are in. Consumer has no dark mode yet and stays light whatever
`data-scheme` says.

## Consequences

Every brand layer must define the same keys, and every color mode the same
semantic names, or a component breaks in one brand only. Adding a brand means
adding one brand file and one or more color mode files, not touching
components. Contrast is proven per mode: all 141 documented pairs pass AA in
every mode that exists.
