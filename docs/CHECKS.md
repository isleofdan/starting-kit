# Checks

What checks the app has, when each runs, and how long each takes.

## The checks today (kit-checks-one, step 1 baseline)

Measured on the rented Linux machine (`agent-machine-dan`, Node 24.21.0),
2 Oct 2026, with bash's `time`:

| Check | Command | What it proves | Time here |
| - | - | - | - |
| Tests | `npm test` | The gate, the alive line, the status page and `lib/upstream.js`, against a real server (8 tests) | 0.87 s, 0.79 s, 0.72 s (three runs) |
| Screenshots | `npm run screenshots` | Every screen at phone and computer size, signing in through the form; no sideways scrolling (16 checks) | not measured here: this machine has no Playwright browser |
