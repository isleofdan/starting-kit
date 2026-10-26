# FIELD REPORT — kit-crash-one — 26 Oct 2026

There is nothing for Dan to see yet. The kit is a template and its trial copy is not an app he uses. What will show it: the first app made from the kit with a DSN, whose test crash becomes a Wall card.

## What stands
- **The OpenRig team did the work (proven).** Rig `kit-crash-one-mixed` (a copy of the team spec with only `name:` changed), on the clone `/data/home/dan/work/kit-crash-one`, branch `claude/kit-crash-one`. Builder `dev-owner@kit-crash-one-mixed` (Claude Code, auto mode) wrote the commits. Checker `dev-check@kit-crash-one-mixed` (Codex) checked them in two rounds. This session did not change the team's code.
  - Team ids: first start `01M5V2WJH601R1VPTNYGTZD58X`, lost when the agent-machine deploy of 03:13Z restarted the machine; restarted on the same clone as a fresh team, which archived the first.
  - Queue rows, in order:
    - `qitem-20261026031019-7cd4f90a`: first job, canceled, superseded by the next row after the restart.
    - `qitem-20261026042759-4ea912ac`: owner row for the continuation job, handed off to the checker.
    - `qitem-20261026043030-2cb79cb9`: check round 1, handed back to the owner with FINDINGS.
    - `qitem-20261026043636-29d29297`: owner's repair, handed off to the checker.
    - `qitem-20261026044200-9d53372f`: check round 2, handed back to the owner with PASS.
    - `qitem-20261026044631-3c7bbf11`: owner's close, done, no follow-on.
  - Checker's verdict lines, verbatim: round 1 "Independent QA: ed5d85c — FINDINGS"; round 2 "Independent recheck: 82daeae — PASS".
  - Commits: `7d03e6c` (crash reporting), `ed5d85c` (report screenshots restored to main's after the check rewrote them), `82daeae` (the repair that answers round 1).
- **Server side.** `@sentry/node` ^11 is a dependency. `lib/crash.js` is required first in `server.js`. With `SENTRY_DSN` empty it loads nothing and exports no-op `captureException` and `flush`. The `handle(...).catch` calls `crash.captureException(e)` beside the kept `console.error` when the status is 500 or above. SIGTERM and SIGINT flush for up to 2 s, then close.
- **Browser side.** `@sentry/browser` ^11 is a dependency and `esbuild` a dev dependency. `scripts/build-sentry.mjs` is copied from the reader; `npm run build` writes the committed `public/sentry.min.js`. `public/crash.js` reads `<meta name="sentry-dsn">` and does nothing without it. `lib/http.js` writes that tag after `<head>` only when `SENTRY_DSN` is set. All three pages load `/sentry.min.js` then `/crash.js` before their own scripts. Both files are open without the cookie, in `server.js` and in `CLAUDE.md` "Building".
- **Privacy, after round 1.** The scrub in `public/crash.js`, shared by server and page, now builds each event from a keep-list instead of deleting named fields. An event keeps its id, time, level, platform, environment, release, the SDK's name and version, and its exceptions: type, message, how it was caught, and frames with only file, module, function, line, column and in_app. The query and fragment are cut from frame paths. The http, fetch, xhr, console, navigation and ui.* breadcrumbs are dropped. Settings: `environment: 'production'`, `sendDefaultPii: false`, `tracesSampleRate: 0`, replay off, `includeServerName: false`, `includeLocalVariables: false`, and Sentry 11's `dataCollection` with every switch off. The integrations ContextLines, LocalVariables, LocalVariablesAsync, Context, CultureContext and Modules are not run.
- **`POST /crash-test`**, behind the cookie, throws `crash-test: this app reports crashes` and answers 500. It is documented in README.
- **Deploy workflow.** A new step, "Check a crash reaches Sentry", runs after "Sign in through the sign-in form". It signs in the same way, posts to `/crash-test`, prints `crash-test: <code>`, and prints a `::warning::` without failing when the code is not 500.
- **`fly.toml`** has `SENTRY_DSN = ""` in `[env]` with the two-line comment.
- **`Dockerfile`** now runs `npm ci --omit=dev` before copying the source, since the kit has runtime packages for the first time.
- **Docs.**
  - README has the paragraph "Crash reports".
  - `docs/NEW-APP.md` has step "4. Crash reporting": Dan's taps in Sentry, then the session's token check and DSN fetch.
  - `CLAUDE.md` "Building" has the crash-reporting rule and the two open routes.
  - The "no runtime dependencies" sentence in `docs/NEW-APP.md` and `PLAN.md` now names the two Sentry packages as the only runtime dependencies. An old report keeps its own wording.
  - `docs/CHECKS.md` gives the test count, 10 before and 21 after.
- No chain proof in this session: the kit has no DSN, so the deploy's crash step answers 500 and no Sentry issue results.

## What the brief got wrong
1. `docs/CHECKS.md` said 8 tests. `main` had 10, as the brief said. The team corrected the line.
2. The brief's privacy settings, copied from the reader, do not keep source or machine data out. Check round 1 captured a real server event from the reader's recipe on a stand-in collector on this machine. Each frame carried the five source lines before and after the failing line. The event also carried the machine, operating system, device, locale and installed-module lists. Sentry 11 gathers these through its integrations and its `dataCollection` defaults whatever `sendDefaultPii` says, and the field-deleting scrub did not remove them. The Hebrew reader (hebrew-reader pull request #28) and the Spine (spine pull request #33) use the same recipe, so they are expected to send the same data. This session did not check them.
3. The brief lists `scripts/crash-smoke.mjs` among the files to copy. The team used it only as the model for the bundle test in `test/crash.test.js`, which the brief's item 6 allows. The kit has no separate smoke script.

## Deliberate divergences
1. **Keep-list scrub instead of the reader's copy** (`public/crash.js`), plus `dataCollection` off and six integrations skipped. Reason: check round 1's evidence (item 2 above). The brief's promise is "only the error and its code location leave the app", and the reader's copy does not keep it.
2. **`Dockerfile` changed**, which the brief did not name. Reason: the image had no install step, and an app without its two runtime packages would not start.
3. **The checker's evidence files are left uncommitted** in `docs/reports/kit-crash-one-qa/`: two probe scripts, captured events and two review notes. Reason: they hold this machine's paths and are outside the brief's scope. Their findings are summarized in this report.

## Verify results
- `npm test` on `main` `ac40b39`: 10 tests, 10 pass, 0 fail.
- `npm test` on `82daeae`, run by this session: 21 tests, 21 pass, 0 fail.
- `npm run check` on `82daeae`, run by this session: "check: all passed: syntax, tests, screenshots".
- The checker's round 2 ran `npm test` (21 passed, 0 failed) and two local probes; both used a stand-in collector on 127.0.0.1:8958 and sent nothing to Sentry.
  - The server probe signed in through the form and posted to `/crash-test`. The event had no contexts and no module list. The `server.js` frame held only filename, module, function, line number, column and in_app, with no source lines or variables.
  - The browser probe ran Chromium, typed the passphrase into the sign-in form, then threw a deliberate error. The event had no contexts, no private query or fragment, no console text, and `infer_ip` was "never".
- Each item 6 test is in `test/crash.test.js` (15 tests), one per point:
  - off with no DSN;
  - the scrub's dropped fields and breadcrumbs;
  - pages load the two scripts in order;
  - both files answer 200 signed out;
  - `POST /crash-test` answers 303 signed out and 500 signed in;
  - the committed bundle matches a fresh build.
- Not verified here: a real delivery to Sentry, a Wall card, a Fly deploy, a Docker build, a phone, the shutdown flush path.

## Asks for the origin chat
1. **Fix the same leak in the Hebrew reader and the Spine?** Both use the recipe that check round 1 found sending five source lines per frame, plus machine, locale and module data. Recommended: yes. Give each app one machine session that copies the kit's `public/crash.js` (the keep-list, `dataCollection` off, the skipped integrations) and proves it with the checker's local probe. The kit's version is the model.

## What the next session needs
- This pull request merged by the origin thread on Dan's line. Merging deploys only the kit's trial copy.
- For the first app made from the kit: Dan's Sentry project named as `app.json` spells it, then the session follows `docs/NEW-APP.md` step 4. The DSN goes into `fly.toml`, and the deploy's crash step then makes the first Wall card for that app.
- The probe scripts in `docs/reports/kit-crash-one-qa/` on this machine's clone, if a session wants to prove the reader or Spine fix the same way.

## Fly machine and OpenRig lessons
1. **A machine deploy ends a team mid-job.** The agent-machine deploy of 03:13Z restarted the machine about four minutes into the builder's work. It cost about 70 minutes of wall time until the restart was noticed on Dan's "continue". It also wiped the session scratchpad, which held the job text. What fixed it: the uncommitted work survived in the clone. The team was started fresh on the same clone with a continuation job that said to read the diff first and commit as it goes. Lasting fix: the agent-machine deploy should hold while a team or session is working. That is for the steward thread.
2. **The OpenRig daemon starved twice.** It did not respond at 03:10Z and again at 04:48Z, which delayed the builder's queue claim and this session's reads. What fixed it each time: `rig daemon stop` then `rig daemon start`. The seats were kept.
3. **Seat prompts.** This session answered seven of the checker's prompts with a one-time yes. Two were to run the clone's `npm test` outside its sandbox and five were to run its own local probes. Each probe was read first and contacted only 127.0.0.1. Dan was asked about none of them.
4. **`npm run check` rewrites the two status screenshots** in `docs/reports/screenshots/`. The builder committed main's copies back once (`ed5d85c`), and this session restored them with `git checkout` after each of its own runs.
