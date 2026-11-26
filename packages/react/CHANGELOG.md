# @talus/react

## 0.8.1

### Patch Changes

- BoardCard's move control uses an overflow glyph instead of an arrow, so an arrow no longer sits on every card.

## 0.8.0

### Minor Changes

- BoardCard takes onOpen: the card's title becomes a keyboard-reachable press target that opens the record behind the card.

## 0.7.0

### Minor Changes

- AppShell grows a note bar, a sidebar footer, a sidebarClassName for app theming like an ink sidebar, and a phone menu that opens the sidebar as a full-screen panel. Board columns stretch together and scroll their cards under a fixed header.

## 0.6.0

### Minor Changes

- Two Track consumer look: kraft primitive family, bg.accent, bg.feature, on-feature text, the feature shadow and border width, consumer remapped to olive and kraft with 48px controls. Card gains variant="feature" with tone="accent"; ErrorSummary scrolls itself and its targets into view, smooth unless reduced motion.

## 0.5.0

### Minor Changes

- Add Accordion, AppShell, DescriptionList, ErrorSummary and OneTimeCodeInput, and give BoardColumn a detail line for things like total waiting time.

## 0.4.0

### Minor Changes

- Add Disclosure: a collapsible summary row with a heading-level option, built on React Aria, used for work history entries in apply flows.

## 0.3.0

### Minor Changes

- New components for product pages: DataTable (sortable, selectable, sticky header), Board with BoardColumn and BoardCard (drag and keyboard moves, announced), Avatar (initials only), Tag, and Header (sticky bar with a nav landmark). TextField gains a multiline mode, and BoardColumn headings can set their level.

## 0.2.1

### Patch Changes

- Example content renamed; sidebar order

## 0.2.0

### Minor Changes

- Eight new components for the Trailcrew apply flow: FileUpload (drop area
  with a real picker button, requirements stated up front, progress and
  plain-words errors with retry), Stepper (numbered steps with aria-current
  and clickable completed steps), SourceChip (names the source of a
  machine-filled value and quotes the line in a popover), StatusTracker
  (vertical stage history with done, current, upcoming and closed states, a
  reason on closed), InlineAlert and Toast (four status variants; Toast lives
  in a polite live region and is always dismissible), Card (plain, elevated
  and clickable) and Meter (role meter with words for the numbers and a clear
  over-limit state).

## 0.1.0

### Minor Changes

- First release of the Talus React components: Button, TextField, Checkbox,
  RadioGroup, Select, Switch, Badge, Tabs and Dialog. Behavior comes from React
  Aria Components, styling from CSS modules that use only `--talus-*` variables,
  icons from Phosphor. Every component ships with keyboard coverage and
  jest-axe tests.
