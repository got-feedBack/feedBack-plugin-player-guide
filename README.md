# Controls Guide

A [feedBack](https://github.com/got-feedback/feedBack) plugin that explains the player controls. It adds a reference page with one card per control group, plus an interactive tour that highlights each control on the player.

## What it covers

The reference page and the tour walk through:

- **Playback:** play / pause and the 5-second seek buttons
- **Arrangement:** switching between the parts a song has
- **Playback speed:** slowing the song down
- **Difficulty:** the mastery slider that simplifies the chart
- **Stem mixer:** per-stem volume
- **Lyrics:** the lyrics overlay (reference page only)
- **Visualization and quality:** the renderer picker and render resolution
- **A / B loop:** setting, saving and clearing a loop

## Install

```bash
cd /path/to/feedBack/plugins
git clone https://github.com/got-feedBack/feedBack-plugin-player-guide.git player_guide
docker compose restart
```

The directory name must be `player_guide` to match the `id` in `plugin.json`.

## Usage

1. Open **Plugins** in the sidebar and click **Controls Guide**.
2. Read the cards, or click **Take the Tour** for the interactive walkthrough.

The tour is defined in `tour.json` and runs on the core tour engine (`window.feedBackTour`). It is also listed in the core **?** tour menu while the Controls Guide page is open.

## Files

| File | Purpose |
|---|---|
| `plugin.json` | Manifest. The `tour` key points at `tour.json`. |
| `screen.html` | The reference page. |
| `screen.js` | Wires the **Take the Tour** button to the tour engine. |
| `tour.json` | Tour steps: a CSS `selector` per step, plus title and content. |

## Tests

```bash
node tests/screen.test.js
```

`tests/screen.test.js` checks the tour-button wiring and the structure of `tour.json`. CI runs it through the org's reusable workflow.
