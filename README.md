# Starting kit

The folder every new app of Dan's is copied from, so a new app starts with
its plumbing already right instead of rebuilding it each time. Dan never
opens the kit itself. What he sees is an app made from it:

- **A sign-in page** of the app's own (a plain web form, never the
  browser's username-and-password box), so it works inside the phone's
  in-app browsers: a link opened from the Claude app, Gmail or Slack. One
  passphrase; signing in once keeps that browser signed in for 30 days.
  Spaces typed before or after the passphrase are ignored.
- **The app's screens**, laid out for a phone (412×915) and for a computer
  (1280×800 and wider). The kit carries one sample screen that says
  "This is <the app's name>".
- **A status page** (`/status`) with an "alive since" line (when this copy
  of the app started, and which version of the code it runs) and the last
  error from anything outside the app it called, with that service's own
  status and message, so a failure can be read on screen.

Behind that, for the Claude Code sessions that build apps:

- **One-press deploy.** A GitHub Actions workflow run by hand ("Deploy")
  creates the app on Fly.io in Tokyo if it does not exist, sets the
  passphrase from the repository secret every time, deploys, then signs in
  through the sign-in page as a person would and prints the result.
  A second workflow ("Remove the Fly app") deletes the app, for a trial
  copy that should stop costing.
- **Notes that travel with every app:** this `README.md` (what the app is,
  for a stranger), `PLAN.md` (state and decisions, a close-out note per
  session), `CLAUDE.md` (the rules every session on the app follows), and
  `docs/reports/` (one field report per session).

## Routes

- `/login` (the sign-in page and its form), `/logout`, `/alive` (the alive
  line, plain text), `/app.css`: open.
- `/manifest.webmanifest`, `/sw.js`, `/install.js`, `/icon-192.png`,
  `/icon-512.png`: open, because Chrome fetches them without the cookie to
  install the app on the phone.
- `/sentry.min.js`, `/crash.js`: open, because the sign-in page loads them
  too (crash reporting, below).
- `/` (the sample screen), `/status` (the status page): behind the cookie,
  like every route an app adds.
- `POST /crash-test`: behind the cookie. It throws
  `Error('crash-test: this app reports crashes')`, which the server reports
  like any unexpected error and answers 500. Signed out it sends the
  browser to the sign-in page (303). The deploy calls it.

## Crash reports

Every app made from the kit reports its unexpected errors to Sentry: a
server error that answers 500, and an error thrown in a page.
Only the error and where in the code it happened leave the app: the
error's type and message, how it was caught, and its stack frames with
file, function, line and column. The same rule runs on the server and in
the page (`public/crash.js`, which `lib/crash.js` also uses), and it keeps
a short list rather than removing a few things: an event keeps its id,
time, level, platform, environment, the SDK's name and version, and those
exceptions; everything else is dropped. So nothing is sent of the request
(address, query, headers, cookie, body), the user or the IP address (the
page tells Sentry not to record it), the transaction name, extra data,
tags, the server's name, the machine, operating system, device, locale or
time zone, the installed modules, the source lines around each frame, local
variables, the breadcrumbs that carry addresses, logs or page text (http,
fetch, xhr, console, navigation, ui.*), or the query and fragment of any
address in a stack frame. Sentry 11 gathers most of that by default
whatever `sendDefaultPii` says, so `public/crash.js` also turns off its
`dataCollection` options and the integrations that gather source lines,
variables, contexts and modules. Two limits: an error's own message is
sent as written, so code should not put what Dan typed into one; and a
page's report travels as an ordinary request from his browser, which tells
Sentry the app's address and the browser's name, as any request to another
site does. Reporting is on only when the environment
variable `SENTRY_DSN` is set; the server then writes it into every page as
`<meta name="sentry-dsn">`. The DSN is public by Sentry's design: it only
lets anyone send new events
(https://docs.sentry.io/concepts/key-terms/dsn-explainer/). In the kit it
is empty (`fly.toml`, `[env]`), so the kit, `npm test` and a local run send
nothing. A new app's session puts the app's own DSN there
(`docs/NEW-APP.md`, "Crash reporting"). The deploy then signs in and calls
`POST /crash-test` to prove the chain; each Sentry issue becomes a card on
Dan's Wall in the Spine (Sentry's alert calls the Spine). The browser part
is Sentry's own SDK, built into one file served from the app
(`public/sentry.min.js`, `npm run build`, committed), so a page loads
scripts only from its own site.

How to start a new app from the kit: `docs/NEW-APP.md`.
Where each piece came from: `docs/SOURCES.md`.
What the shop is for: `SIGN.md`, copied into every app unchanged.

## Running it on a computer

    npm install
    APP_PASSWORD=try-me COOKIE_SECRET=any-long-text npm run dev

Then open http://localhost:8080 and sign in with `try-me`.
`npm run check` runs every check (`npm test`, then `npm run screenshots`,
which saves the screens at both sizes into `docs/reports/`). They also run
by themselves after every edit an agent makes and on every push and pull
request: `docs/CHECKS.md`. What an agent may and may not touch:
`CLAUDE.md`.
