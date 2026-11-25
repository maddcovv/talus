# Contributing to Talus

Talus is small on purpose. Every component in it earns its place. This page
says how something gets in, how it changes, and how it leaves.

## How a new component gets in

1. **Proposal.** Open an issue that answers three questions: what problem does
   this solve, where will it be used (name the product and the screen), and
   what exists already? If a current component or a composition of two covers
   the need, the answer is to use that, not to add a new one.
2. **Review.** The proposal is checked against two rule sets before any code:
   the token rules (can it be built from semantic `--talus-*` tokens with no
   new primitives?) and the accessibility rules in CLAUDE.md (keyboard path,
   labels, focus ring, no color-only meaning, 24px targets). If it needs new
   tokens, those are proposed first and land in `packages/tokens/src/`.
3. **Build.** One folder in `packages/react/src/<Name>/` with the component,
   its CSS module, and its tests. Behavior on React Aria Components. A story
   per state plus a Modes story, and an MDX page with usage notes in
   `apps/docs/stories/components/`. `pnpm test` must pass with zero axe
   violations.
4. **Release.** Add a changeset (`pnpm changeset`) that names the package,
   the bump and the change in plain words. Versions and changelogs are
   generated from changesets at release time with `pnpm changeset version`.

## Versioning

Both packages follow semver and version independently:

- **patch**: a fix that changes no API and no token name.
- **minor**: a new component, prop, or token.
- **major**: a removal or a change in meaning (a renamed token, a prop that
  behaves differently).

Every change to `packages/tokens` or `packages/react` ships with a changeset.
No changeset, no merge.

## Deprecation

Nothing disappears without warning. A token or a component prop that is going
away is marked deprecated for at least one minor version before removal:

- The docs page and the changelog both say it is deprecated and name the
  replacement.
- The old name keeps working during the deprecation window.
- The removal lands in the next major or, for pre-1.0, no sooner than the
  next minor after the deprecation notice.

## Decisions

Choices that shape the system are written down in `docs/decisions/`, one
short file per decision: the context, the choice, and what it commits us to.
Read them before proposing a change that crosses one.

## Colors

Color values are generated. Change them in `packages/tokens/gen.py`, run
`python3 gen.py` inside `packages/tokens`, and keep all 141 contrast pairs
passing. Never edit a color hex in the JSON by hand.
