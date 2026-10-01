# Plan

## Decisions (starting-kit-one, 2 Oct 2026)

- **What the kit is.** A floor, not a framework: the smallest folder that
  carries a sign-in page, a deploy, a status page, the notes files and the
  reports folder. Every new app of Dan's is copied from it.
- **Stack.** The one the three live apps share (`isleofdan/miwa-english`,
  `isleofdan/hebrew-reader`, `isleofdan/french-ear`): one plain Node 22
  server, plain HTML and CSS, no build step, no web framework, a
  `node:22-slim` Docker image, one Fly machine in Tokyo (`nrt`). No
  runtime dependencies at all; Playwright only for screenshots.
- **The app's name** lives in `app.json` (`name`, `title`) and nowhere else.
  The Fly app is `<name>-dan`. The cookie's name comes from it too.
- **Gate.** One passphrase (`APP_PASSWORD`), a signed 30-day cookie
  (`COOKIE_SECRET`), spaces and line breaks at either end ignored, five
  wrong tries lock that address for 15 minutes. Fail closed when either is
  unset. Never HTTP basic auth.
- **Deploy.** By hand only (Actions tab, "Deploy"). Creates the app if
  missing; sets `APP_PASSWORD` from the repository secret every run; makes
  `COOKIE_SECRET` once and keeps it; one machine, `shared-cpu-1x`, 256 MB,
  always on. Then proves itself: `/alive` answers, and signing in through
  the form reaches the sample screen.
- **No database in the kit.** The kit stores nothing. An app that keeps
  records adds SQLite on a volume exactly as the three apps do
  (`docs/NEW-APP.md`, "When the app keeps records").
- **Pull-only.** Nothing pushes at Dan: no notifications, reminders,
  streaks, badges, daily goals.

## Close-out notes

(Each session appends its own, in order.)
