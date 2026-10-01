# Checks

What checks the app has, when each runs, and how long each takes.

## The checks today (kit-checks-one, step 1 baseline)

Measured on the rented Linux machine (`agent-machine-dan`, Node 24.21.0),
2 Oct 2026, with bash's `time`:

| Check | Command | What it proves | Time here |
| - | - | - | - |
| Tests | `npm test` | The gate, the alive line, the status page and `lib/upstream.js`, against a real server (8 tests) | 0.87 s, 0.79 s, 0.72 s (three runs) |
| Screenshots | `npm run screenshots` | Every screen at phone and computer size, signing in through the form; no sideways scrolling (16 checks) | not measured here: this machine has no Playwright browser |

## One command (step 2)

`npm run check` runs every check in order (syntax, tests, screenshots),
stops at the first failure, and ends with one line: `check: all passed: …`
or `check: FAILED at <check> (<seconds> s): <what failed>`. The syntax
check is `node --check` on every `.js`, `.mjs` and `.cjs` file outside
`node_modules`. Measured here, three runs each:

| Run | Time here |
| - | - |
| `npm run check` (syntax, tests; screenshots skipped, no browser here) | 1.57 s, 1.67 s, 1.67 s |
| syntax alone, inside it | 0.34 s, 0.38 s, 0.38 s |
| tests alone, inside it | 0.61 s, 0.67 s, 0.68 s |
| `npm run check -- --fast` (syntax and tests) | 1.34 s, 1.39 s, 1.67 s |
