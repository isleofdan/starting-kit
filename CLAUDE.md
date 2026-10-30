# Rules for every coding session on this app

Read `SIGN.md` (what Dan's software shop is for) before changing anything.
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

When the session merges and deploys, the order is fixed: the change's pull
request first (the report links it); after the deploy result, a notes-only
close-out pull request carrying the field report and the `PLAN.md` note.
That order is the rule, not a divergence. A brief's "nothing else changes"
never covers the report and the `PLAN.md` note, and a count of changed
files in a brief includes them.

## Building

- **Gate.** The app's own sign-in page (`public/login.html`, `lib/auth.js`),
  never the browser's username-and-password box: phone in-app browsers
  never show it. Every route except `/login`, `/logout`, `/app.css`,
  `/alive`, the five install files below and crash reporting's
  `/sentry.min.js` and `/crash.js` stays behind the cookie.
- **Installable on the phone, by default.** Every screen links
  `/manifest.webmanifest`, the theme color, the icon and `/install.js`, so
  Chrome on Dan's phone offers **Install app** and the app opens full
  screen from its own icon. The manifest (named from `app.json`),
  `/sw.js`, `/install.js`, `/icon-192.png` and `/icon-512.png` are open,
  because Chrome fetches them without the cookie. A new screen copies the
  four head lines from `public/index.html`; a new app replaces the two
  icons with its own. The service worker keeps nothing: the app is the
  live site. Dropping this needs a stated reason in the brief and in
  `PLAN.md` (Dan's rule, 23 Oct 2026: "all web apps we create in all
  Claude projects [are] installable as Chrome phone apps by default,
  except when there's a reason they shouldn't be").
- **One site is one installed app; extra icons are shortcuts.** Chrome on
  Android does not install several apps from one site side by side: after
  the first installs, the others only offer to open it, whatever their
  `id` and `scope` (web.dev, "Build multiple Progressive Web Apps on the
  same domain": "the browser won't fully consider these to be distinct
  apps"; recommended instead: separate origins). So every app has one
  manifest, `id`, `start_url` and `scope` all `/`. When Dan wants a page
  as its own icon, add it to the manifest's `shortcuts` (name, url, a 192
  icon): a long press on the app icon lists them, and dragging one to the
  home screen makes its own icon that opens the app at that page. A page
  that must be a truly separate app goes on its own origin (its own Fly
  app). Changing an installed app's manifest needs an uninstall and
  reinstall on the phone; say so. Claims about how a browser installs or
  matches apps come from a cited doc or a test on a phone, never from
  memory. (Origin: Spine, 23 Oct 2026: one manifest per page, then one
  scope per page; both times only the first page installed on Dan's
  phone, two wasted rounds.)
- **Crash reporting on by default:** every app reports unexpected errors
  to Sentry through `lib/crash.js` and `public/crash.js`; only the error
  and its code location leave the app; a session turns it off only with a
  stated reason. `/sentry.min.js` and `/crash.js` are open, because the
  sign-in page loads them too; every page loads them, in that order,
  before its own scripts. Reporting is on only when `SENTRY_DSN` is set
  (`fly.toml`, `[env]`; empty in the kit). A new app's DSN:
  `docs/NEW-APP.md`, "Crash reporting".
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

## What an agent may and may not touch

These rules bind every harness. Claude Code enforces them from `.claude/settings.json` (`permissions`);
other harnesses must verify their own sandbox and approval controls before work, without treating Claude allow rules as authority. This section states the shared boundaries, with why. The line between them is
the cost of a wrong move: who sees it, and what it costs to undo.

- **May, without asking:** edit files in the app, run the checks (`npm
  test`, `npm run …`, `node …`), commit, push its own branch, open a pull
  request, read pull requests and workflow runs. A wrong move here is seen
  by nobody until a pull request, and is undone by another commit.
- **Asks Dan one yes/no first:** merging a pull request (`gh pr merge`),
  starting a workflow (`gh workflow run`, which includes Deploy and Remove),
  and any direct GitHub request (`gh api`). These reach what Dan sees, or
  can change things a commit cannot undo. For reading runs and pull
  requests, use `gh run view` and `gh pr view`, which need no asking.
- **Never, from its own shell:**
  - `fly` / `flyctl`: deploying and anything that costs money run only
    through the Deploy workflow, after Dan's yes. This also keeps the app's
    records on Fly out of a session's reach: a table holding Dan's data is
    never dropped or rebuilt (see "Do not reverse").
  - `npm publish`: nothing of Dan's is published; the app ships only
    through Deploy.
  - Pushing to `main`: push your own branch and open a pull request.
  - Deleting a branch, here or on GitHub: leave it; Dan deletes branches.
  - `gh secret`, `gh variable`, `gh repo edit`/`delete`/`rename`/`archive`:
    repository secrets and settings are Dan's; ask him under **Needed from
    you**, naming the setting and the value.
- **This rule file itself** is a protected path in Claude Code: an agent
  cannot change `.claude/settings.json` without a prompt, and any change
  reaches `main` only through a pull request Dan says yes to.

These rules stop the commands an agent normally types, not every way of
spelling them (Claude Code's own permissions page says so). They bound
mistakes; they are not a lock against someone determined.

## Hosted session limits

Build on your own branch, open a pull request, ask Dan one yes/no to merge,
and merge it yourself on yes. Do not push to `main` directly, delete any
branch, or write `.claude/settings.json`.

## Choosing an executor and review lane

D-Dot leads model-neutral production. Default new coding work to a verified native ChatGPT/Codex cloud environment. Record a specific reason for laptop, 4090, Fly or another executor (hardware, local-only app/browser access or special runtime needs, for example). Do not invent an exception or force an unverified cloud route. Preserve ongoing tasks until safe handoff. This preference grants no additional access, credentials, security, merge or deploy authority.
Cloud is the default for suitable new work; cloud means a hosted coding environment, not specifically
Claude Code. The brief names executor/location, harness, builder model (or how
to read it), independent checker and rationale. Verify access, actual permissions,
tools, isolated work and recovery before depending on that route. Reports name
the actual route, rationale, exact candidate and independent checker's verdict.
Self-review alone is not independent review. Records-only work can state its
no-code reason for no separate checker.

Claude/OpenRig on agent-machine-dan remains supported when selected. Follow
the section "OpenRig team is the default" (legacy heading) of
`/data/home/dan/FACTS.md`, including clone/session coordination, fresh seats,
permission checks, queue evidence, snapshot and same-job restore restrictions.
The previous mandatory Fly/OpenRig defaults are superseded by Dan's accepted
production direction; the safety and authorization rules are not.

A machine session never merges any pull request, even on a relayed yes; the
originating thread handles an authorized merge outside the machine. Elsewhere,
merge and deploy still require Dan's explicit authorization for the action and
target. An executor choice, checker PASS or changed factual state is not
permission. Agent-machine changes disclose their restart impact before approval
and preserve its busy-session wait/fail guard. No implicit force restart.

## Do not reverse

- **Records.** To add a field to a table that already holds the user's
  data, use `ALTER TABLE … ADD COLUMN` and back-fill. Never drop and
  recreate a table, and never move rows to a new one.
- **The volume's mount path** (`/data`, once an app has one) never changes:
  changing it silently abandons the old disk and every record on it.
- **The passphrase is set on every deploy** from the repository secret.
  Do not go back to setting it only when missing: then changing the secret
  in GitHub would never reach the app.
