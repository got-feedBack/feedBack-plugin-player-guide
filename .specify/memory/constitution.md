# Controls Guide Plugin Constitution

The Controls Guide plugin (id: `player_guide`) provides an in-app reference and
interactive tour of the Slopsmith player toolbar.

## Core Principles

### I. Pure Documentation Surface
The plugin must not modify, intercept, or re-wrap any core player behavior. It
is a read-only reference: a static help screen plus a guided tour that points
at existing core DOM ids. If a control disappears from core, the tour entry
referencing it MUST gracefully degrade (skip / continue) rather than break.

### II. Tour Selectors Track Core IDs
Every `selector` in `tour.json` is a contract with the host app's player
DOM (`#btn-play`, `#arr-select`, `#speed-slider`, `#mastery-slider`,
`#btn-stem-mixer`, `#viz-picker`, `#btn-loop-a`). When the host renames or
removes one of these, the tour entry must be updated in lockstep — there is
no fallback inside this plugin.

### III. No Backend, No State
The plugin is frontend-only (`screen.html`, `screen.js`, `tour.json`). It
ships no `routes.py`, no database, no persisted preferences. Any future
need for state must be justified against this principle first.

### IV. Defer to `window.slopsmithTour`
The interactive walkthrough is delegated to the host's tour runner via
`window.slopsmithTour.start('player_guide')`. This plugin does not implement
its own overlay, spotlight, or step engine.

### V. Content Stays Faithful to Player UI
Each card in `screen.html` must describe a real, currently-shipped control.
Aspirational features ("coming soon") do not belong here.

## Inheritance from Slopsmith Core

This plugin inherits all global constraints from the Slopsmith core
constitution and `CLAUDE.md` — Docker-first deployment, plugin-loader
contract (`plugin.json` keys), per-plugin idempotency on script
re-evaluation, and no breaking changes to public selectors without a
deprecation step. Local rules above refine those defaults; they never
override them.

## Governance

Changes to this constitution require updating `tour.json` and
`screen.html` in the same PR if the principle change is observable in
the UI. Version bumps to `plugin.json` accompany any user-facing copy
change.

**Version**: 1.0.0 | **Ratified**: 2026-05-09 | **Last Amended**: 2026-05-09
