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
