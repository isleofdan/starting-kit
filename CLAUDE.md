# Rules for every Claude Code session on this app

Read `README.md` and `PLAN.md` before changing anything. This app was made
from `isleofdan/starting-kit`; these rules came with it and bind every
session here.

## Replies to Dan

- Every reply ends with a block headed **Needed from you**: numbered items,
  each an action on something Dan can open, or one yes/no on a decision.
  Nothing above the block asks him for anything. When nothing is needed it
  is one line saying so and what he will see next.
- Dan is not a developer: plain words, no repo or tooling nouns unless he
  used them first.
- A wait you can see through (a deploy, a CI run, a build that ends within
  ten minutes) is waited out inside the turn, not narrated.

## A close-out shows Dan something, or says plainly there is nothing to see

- **Nothing on his screen changed** (records, routes, a deploy step; no
  page): the close-out's first line says, in those words, that there is
  nothing for him to see yet, and names what will show it. No walkthrough,
  no request for a reaction. What was built goes in the report.
- **Something on his screen changed:** walk him through that screen, one
  step per round, each step naming where it is (the app, the page, the
  link) and what he will see there.
- **Never ask Dan whether a description matches what he pictures.** Never
  "read item N" or "tell me if this matches".

## Field reports

Every session writes `docs/reports/<session>-report.md` and appends a
close-out note to `PLAN.md` (what stands, what was decided, what the next
session needs), committed before the pull request. The report's sections:
what stands; what the brief got wrong; deliberate divergences; verify
results; numbered asks, each with a recommended answer; what the next
session needs. It never asks when, or whether, the next session runs: Dan
schedules sessions by opening them.

## Building

- **Gate.** The app's own sign-in page (`public/login.html`, `lib/auth.js`),
  never the browser's username-and-password box: phone in-app browsers
  never show it. Every route except `/login`, `/logout`, `/app.css` and
  `/alive` stays behind the cookie.
- **Proofs sign in through the form.** Any claim that a screen works is
  proven by a browser that types the passphrase into the sign-in page.
  Never pre-supply credentials (Playwright `httpCredentials`, injected
  cookies, `user:pass@` addresses): that skips the step being proven.
- **Both sizes.** Every screen is proven at 412×915 and 1280×800, with
  screenshots in the report (`npm run screenshots`).
- **Pull-only.** Nothing pushes at Dan: no notifications, reminders,
  streaks, badges, daily goals. "No data" is a state a screen shows.
- **Outside calls go through `lib/upstream.js`,** so the status page shows
  the last failure with that service's own status and message.
- **Sentences about effects.** Any sentence the app shows asserting an
  effect outside the screen (saved, sent, filed) is spelled by code from
  the record of that effect, never by a model.

## Deploying and money

- Deploying, and anything that spends money, runs only through the
  workflows in `.github/workflows/`, never from a session's shell. No
  `fly` commands by hand.
- "Remove the Fly app" is for a trial copy only. Never run it on an app
  that holds Dan's records unless Dan has asked for exactly that.

## Cloud session limits

Build on your own branch, open a pull request, ask Dan one yes/no to merge,
and merge it yourself on yes. Do not push to `main` directly, delete any
branch, or write `.claude/settings.json`.

## Do not reverse

- **Records.** To add a field to a table that already holds the user's
  data, use `ALTER TABLE … ADD COLUMN` and back-fill. Never drop and
  recreate a table, and never move rows to a new one.
- **The volume's mount path** (`/data`, once an app has one) never changes:
  changing it silently abandons the old disk and every record on it.
- **The passphrase is set on every deploy** from the repository secret.
  Do not go back to setting it only when missing: then changing the secret
  in GitHub would never reach the app.
