# Changesets

Every change to `@talus/tokens` or `@talus/react` ships with a changeset: a
small file in this folder that names the package, the bump (major, minor,
patch) and what changed in plain words.

- Add one with `pnpm changeset` and answer the prompts.
- At release time `pnpm changeset version` turns pending changesets into
  version bumps and CHANGELOG entries.

The docs app (`talus-docs`) is not versioned; it always tracks the latest
packages.
