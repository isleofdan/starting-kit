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

### starting-kit-one — 2 Oct 2026

- **Stands:** the kit, built and proven on a computer in a cloud session:
  sign-in page (30-day cookie, spaces ignored, rate limited), sample screen,
  status page with the alive line and the last outside error, 8 checks
  passing, screenshots at 412×915 and 1280×800 signing in through the form,
  the deploy and remove workflows (their proof steps run against a local
  copy), and `docs/NEW-APP.md`, followed literally to make a working
  `proof-app`. Not yet proven: the deploy on Fly (the first run after the
  merge; the Docker image is first built there, as this sandbox has no
  Docker daemon).
- **Decided:** the shared stack of the three apps with no database and no
  runtime dependencies; the app's name only in `app.json`; deploy by hand
  only; one `shared-cpu-1x` 256 MB machine; `main` created on GitHub from a
  one-file base commit, because the repository was empty and the work
  branch could not be merged into a branch that did not exist.
- **Next session needs:** the repository's default branch set to `main` and
  the repository marked as a template (both are settings this cloud
  session's proxy refuses: https://github.com/isleofdan/starting-kit/settings).
  Until the default is `main`, `docs/NEW-APP.md` clones `--branch main`
  explicitly.

### kit-checks-one — 2 Oct 2026

- **Stands:** checks and permission rules in the kit, so every app copied
  from it gets both. `npm run check` runs syntax (`node --check`), tests
  and screenshots in order and ends with a one-line verdict naming what
  failed. Syntax and tests (about 1.2 s on the rented Linux machine) run by
  themselves after every edit an agent makes (a Claude Code hook in
  `.claude/settings.json`); everything runs on every push and pull request
  (the "Checks" workflow). `.claude/settings.json` also holds the rules for
  what an agent may and may not touch, and `CLAUDE.md` says the same in
  words. `docs/CHECKS.md` says what runs when, with measured times.
  `docs/NEW-APP.md` says a new app inherits both, which lines narrow for a
  real audience, and how an older app adopts them. Proven on a scratch
  `proof-app`: a broken test fails the check by name; the hook fired by
  itself after an edit and showed the failure to the session; `flyctl
  deploy` and `git push origin main` were refused.
- **Decided:** the default rules: an agent may edit, run checks, commit,
  push its own branch and open a pull request; it asks before merging,
  starting a workflow, or a direct GitHub request; it never runs `fly`,
  publishes to npm, pushes to `main`, deletes branches, or changes
  repository secrets or settings. Screenshots are skipped, and said so,
  where a machine has no browser; in GitHub Actions that is a failure.
- **Next session needs:** see `docs/reports/kit-checks-one-report.md`,
  "What the next session needs".

### the-sign-one — 1 Oct 2026

- **Stands:** `SIGN.md` at the kit's root: Dan's one-page statement of
  what his software shop is for, copied byte for byte from the brief on
  the wall card `the-sign`. `README.md` and `CLAUDE.md` each gained one
  line pointing to it. Because the copy step in `docs/NEW-APP.md` copies
  the whole kit, every new app carries `SIGN.md` without further steps.
- **Decided:** the sign is Dan's text and is never edited by a session;
  apps that already exist pick it up only when Dan wants it there.
- **Next session needs:** nothing from this one. See
  `docs/reports/the-sign-one-report.md`.

### checks-stall-one — 2 Oct 2026

- **Stands:** the "Checks" workflow installs Chromium without
  `--with-deps`; the first run on the branch was green in 21 s with all
  three checks.
- **Decided:** the stall was never about `main`: `--with-deps` downloaded
  ~32 MB of fonts from Ubuntu's mirror, which crawled on some runners,
  pull-request runs included. Dropped rather than cached.
- **Next session needs:** see `docs/reports/checks-stall-one-report.md`
  (the runner image moves to Ubuntu 26 from 19 Oct 2026).
