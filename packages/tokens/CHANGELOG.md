# @talus/tokens

## 0.2.0

### Minor Changes

- Two Track consumer look: kraft primitive family, bg.accent, bg.feature, on-feature text, the feature shadow and border width, consumer remapped to olive and kraft with 48px controls. Card gains variant="feature" with tone="accent"; ErrorSummary scrolls itself and its targets into view, smooth unless reduced motion.

## 0.1.0

### Minor Changes

- First release of the Talus token foundation. W3C token source for primitives,
  two brands (enterprise and consumer), three color modes (enterprise light,
  enterprise dark, consumer light), global scales and component tokens. The
  Style Dictionary build writes `dist/talus.css` (CSS variables named to match
  the Figma variable code syntax) and `dist/tokens.ts` (typed values). All 141
  documented contrast pairs pass WCAG AA.
