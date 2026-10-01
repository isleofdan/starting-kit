# FIELD REPORT — kit-checks-one — 2 Oct 2026

Session kit-checks-one, Claude Code 2.1.285 on the rented Linux machine
(Fly app `agent-machine-dan`), ran the brief on the wall card `kit-checks`.
Clone: `/data/home/dan/work/starting-kit`, branch `kit-checks-one`.

This session changes nothing on Dan's screen. What it adds shows up as a
green or red "Checks" mark on future pull requests, and as a session being
told, right after an edit, that a check failed.

## What stands

The starting kit now carries checks and permission rules, so every app
copied from it gets both:

- **`npm run check`** (`scripts/check.mjs`, Node only, no new dependency):
  syntax (`node --check` on every JavaScript file), then `npm test`, then
  `npm run screenshots`; stops at the first failure and ends with one line,
  `check: all passed: …` or `check: FAILED at <check> (<s> s): <what>`,
  naming the file, test or screenshot check that failed.
- **After every edit:** a `PostToolUse` hook on `Edit|Write` in
  `.claude/settings.json` runs syntax and tests (about 1.2 s here). Silent
  on a pass; on a failure it shows the output to the session (exit 2).
  Two edits at once do not run the tests side by side (a lock; the second
  skips).
- **On every push and pull request:** the GitHub Actions workflow "Checks"
  (`.github/workflows/checks.yml`) installs Playwright's browser and runs
  the full `npm run check`. It never deploys and never touches Fly.
- **Rules:** `permissions` in `.claude/settings.json` (20 allow, 3 ask,
  19 deny) and the `CLAUDE.md` section "What an agent may and may not
  touch", side by side below.
- **Docs:** `docs/CHECKS.md` (what runs when, measured times, reading a
  failure, pull-only); `docs/NEW-APP.md` (a new app inherits both; which
  lines to narrow for a real audience; how an older app adopts them);
  `README.md` points to both; `PLAN.md` close-out note.

## What the brief got wrong

1. **This machine's GitHub sign-in could not add a workflow file.** The
   first push was refused: "refusing to allow an OAuth App to create or
   update workflow `.github/workflows/checks.yml` without `workflow`
   scope". The brief called the machine "proven for GitHub" (true for
   ordinary files only). The safety check here also refused the session's
   own attempt to add the scope (`gh auth refresh -s workflow`), even after
   Dan's yes. Dan typed the command in the session, the session started
   it, and Dan approved the code at github.com/login/device; the scopes
   now read 'gist', 'read:org', 'repo', 'workflow'.
2. **This machine also has a safety check on `.claude/settings.json`.**
   The brief moved the session here because a cloud session refuses to
   write that file. Here, writing the hook went through, but writing the
   permission rules was refused as "self-modification" until Dan said yes
   in the session.
3. **No browser for the screenshots on this machine.** Playwright's
   Chromium is not installed here, so `npm run screenshots` stops with
   "Executable doesn't exist". Recorded as "not measured here" and left to
   the workflow, as the brief allows.
4. **`npm test`'s summary reads `ℹ pass 8`, not `# pass 8`,** on this
   machine's Node 24 (`docs/NEW-APP.md` quoted Node 22's form). The guide
   now uses `npm run check` and its verdict line.
5. **A hook cannot stop a session.** The brief's close-out line speaks of
   "a session stopping itself when a check fails". Per the hooks page, a
   `PostToolUse` hook runs after the edit has happened; exit code 2 "shows
   stderr to Claude; the tool already ran". The session is told at once,
   and `CLAUDE.md` makes fixing it the next step, but nothing is undone or
   halted. The brief also asked that the hook "must not block", so this is
   the right shape.

## Deliberate divergences

- **Screenshots skip where there is no browser.** Otherwise `npm run
  check` could never pass on this machine, and agents here would learn to
  ignore it. The skip is named in the verdict line; in GitHub Actions
  (`CI` set) a missing browser is a failure, so the pull request always
  runs them.
- **Refusals name the alternative in `CLAUDE.md`, not in the denial
  itself.** Claude Code's denial reads "Permission to use Bash with command
  flyctl deploy has been denied." and settings JSON has no place for a
  reason. Each never-line in `CLAUDE.md` names what to do instead; a
  second hook just to add reasons would have been a second version of the
  rules.
- **Asks Dan before `gh workflow run` and `gh api`,** beyond the brief's
  list. Starting a workflow includes Deploy and Remove (money, Dan's
  screen); `gh api` can change anything a repository allows. Reading runs
  and pull requests stays free (`gh run view`, `gh pr view`).
- **No rule for dropping tables.** The kit has no database, and an app's
  records live on its Fly volume, reachable only through `fly` commands,
  which are denied. `docs/NEW-APP.md` tells an app with a database to add
  `Bash(sqlite3 *)` to deny; `CLAUDE.md`'s "Do not reverse" already
  forbids drop-and-recreate.
- **The rule file guards itself without a rule:** `.claude/` is a
  protected path in Claude Code, never auto-approved (permission-modes
  page, "Protected paths").
- **The proof copy came from the work branch,** not from GitHub's `main`,
  because the work was not merged yet; otherwise `docs/NEW-APP.md` was
  followed to the letter.

## Rules, side by side

| `.claude/settings.json` | `CLAUDE.md`, "What an agent may and may not touch" |
| - | - |
| allow `Edit(/**)` | May edit files in the app |
| allow `Bash(npm test *)`, `Bash(npm run *)`, `Bash(npm ci *)`, `Bash(npm install *)`, `Bash(node *)` | May run the checks (`npm test`, `npm run …`, `node …`) |
| allow `Bash(git add *)`, `Bash(git commit *)`, `Bash(git checkout *)`, `Bash(git switch *)`, `Bash(git fetch *)`, `Bash(git pull *)` | May commit |
| allow `Bash(git push *)` | May push its own branch |
| allow `Bash(gh pr create *)`, `Bash(gh pr view *)`, `Bash(gh pr checks *)`, `Bash(gh pr list *)`, `Bash(gh run view *)`, `Bash(gh run list *)`, `Bash(gh run watch *)` | May open a pull request, read pull requests and workflow runs |
| ask `Bash(gh pr merge *)` | Asks Dan before merging a pull request |
| ask `Bash(gh workflow run *)` | Asks Dan before starting a workflow (Deploy, Remove) |
| ask `Bash(gh api *)` | Asks Dan before any direct GitHub request; read with `gh run view` / `gh pr view` |
| deny `Bash(fly *)`, `Bash(flyctl *)` | Never `fly`/`flyctl`: deploys and spending go through the Deploy workflow; keeps Fly records out of reach |
| deny `Bash(npm publish *)` | Never `npm publish`: ship only through Deploy |
| deny `Bash(git push * main)`, `Bash(git push * main *)`, `Bash(git push *:main)`, `Bash(git push *:main *)` | Never push to `main`: push your own branch, open a pull request |
| deny `Bash(git push --delete *)`, `Bash(git push * --delete *)`, `Bash(git push * -d *)`, `Bash(git branch -d *)`, `Bash(git branch -D *)`, `Bash(git branch --delete *)` | Never delete a branch: Dan deletes branches |
| deny `Bash(gh secret *)`, `Bash(gh variable *)`, `Bash(gh repo edit *)`, `Bash(gh repo delete *)`, `Bash(gh repo rename *)`, `Bash(gh repo archive *)` | Never change secrets or settings: ask Dan under **Needed from you** |
| (protected path, built in) | This rule file cannot change without a prompt |

## Verify results

1. **Measured times, and the split** (bash `time`, three runs):
   `npm test` 0.87 / 0.79 / 0.72 s; syntax 0.34 / 0.38 / 0.38 s; tests in
   the check 0.61 / 0.67 / 0.68 s; the hook's command 1.17 / 1.19 / 1.20 s;
   full `npm run check` 1.57 / 1.67 / 1.67 s; screenshots not measured here
   (no browser). Hook: syntax and tests. Workflow: syntax, tests,
   screenshots.
2. **`npm run check` on `proof-app`:** clean: `check: all passed: syntax,
   tests; skipped screenshots (no browser on this machine; the Checks
   workflow runs them)`, exit 0. Broken (`401` changed to `400` in one
   test): `check: FAILED at tests (0.68 s): failed: a wrong passphrase is
   refused and sets no cookie`, exit 1. Fixed: passes again, exit 0. Also
   checked in the kit: a broken file gives
   `check: FAILED at syntax (0.39 s): does not parse: lib/auth.js`.
3. **The hook fired by itself, proven, not just listed.** A headless
   Claude Code run in `proof-app` (`claude -p`, `--include-hook-events`)
   made the same breaking edit with the Edit tool; the stream showed
   `hook_started` / `hook_response` for `PostToolUse:Edit`, and the
   session received "PostToolUse:Edit hook blocking error from command:
   "node ${CLAUDE_PROJECT_DIR}/scripts/check.mjs --hook" … ✖ a wrong
   passphrase is refused and sets no cookie … AssertionError
   [ERR_ASSERTION]: 401 == 400".
4. **"Checks" on the pull request branch:** see the second card note, and
   the pull request.
5. **Claude Code loads the file without complaint.** Its debug log in the
   same run: "Adding 19 deny rule(s) to destination 'projectSettings':
   ["Bash(fly *)", …]" and "Adding 3 ask rule(s) …"; `claude doctor`: "No
   installation issues found." One notice: "Ignoring 20 permissions.allow
   entries from .claude/settings.json: this workspace has not been
   trusted", which the permissions page says is expected: allow rules wait
   for the folder's trust dialog, deny and ask rules apply at once.
   `flyctl deploy` and `git push origin main` were both refused: "Permission
   to use Bash with command flyctl deploy has been denied." and the same
   for the push. **Asserted, not proven: that the deny rules, and not the
   untrusted folder, refused them.** In that run anything needing a prompt
   was refused too, and the log does not name the rule. A control run in
   the mode where only deny rules apply was refused by this machine's
   safety check.
6. **Documentation relied on:**
   https://code.claude.com/docs/en/settings (`$schema`, `permissions`,
   project settings and trust),
   https://code.claude.com/docs/en/hooks (`PostToolUse`, matcher
   `Edit|Write`, exec form `command` + `args`, `${CLAUDE_PROJECT_DIR}`,
   `timeout` default 600 s, exit code 2 for `PostToolUse`),
   https://code.claude.com/docs/en/permissions (rule syntax, deny → ask →
   allow order, wildcards, compound commands, the limits of Bash rules,
   path anchoring, project allow rules and workspace trust),
   https://code.claude.com/docs/en/permission-modes ("Protected paths"),
   and the installed tool: `claude --help`, `claude doctor`, the debug log.
   All fetched from this machine (`HTTP/2 200`).
7. **Before the pull request:** see the pull request; `git status --short`
   clean and `git log origin/kit-checks-one..HEAD` empty were checked
   before opening it.

## Asks

1. **Merge the pull request?** Recommended: yes. Answered in the session.
2. **Add Playwright's browser to this machine?** Recommended: no for now.
   The pull request runs the screenshots anyway; add it only when a long
   unattended build here needs screenshots mid-run (step 6), through
   `isleofdan/agent-machine`'s own way of adding tools.

## What the next session needs

- **Proof still owed:** that the deny rules themselves, not the untrusted
  folder, refuse `flyctl deploy` and `git push origin main`. The first
  session that opens a trusted app copied from the kit can try both and
  read the denial.
- **This machine's GitHub sign-in now carries the `workflow` scope**
  (added 2 Oct 2026), so sessions here can add or change workflow files.
- **This machine's safety check refuses** a session writing permission
  rules into `.claude/settings.json`, or changing its own GitHub sign-in,
  without Dan's word in the session; briefs that need either should say
  so up front.
- **Rules are a bound, not a lock.** A deny rule matches the command as
  usually typed, not `sh -c '…'` or a full path (permissions page, "What a
  Bash rule doesn't match"). Branch protection on `main` in GitHub would
  back up "never push to `main`"; that is a repository setting, so Dan's.
