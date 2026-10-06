# FIELD REPORT — kit-team-rule — 6 Oct 2026

Nothing Dan sees changes. From now on the kit's rules carry the OpenRig team rule, so every app copied from the kit starts with it. No reaction needed.

## What stands — proven versus designed
- **The team did the change (proven).** A fresh team, id `01M487R6R69TGW6YTJ3Z1EWCHC`, was started on the clone `~/work/kit-team-rule`, branch `claude/kit-team-rule`.
  - The builder `dev-owner@first-project-mixed` wrote commit `a45087a`, one section in `CLAUDE.md`. The checker `dev-check@first-project-mixed` passed it on the first round. This session did not redo or change any of the team's work.
  - Queue rows:
    - Owner row `qitem-20261006091524-2745cdde` (handed-off to the checker).
    - Check row `qitem-20261006091633-cb4fbaee` (handed-off to the owner).
    - Return row `qitem-20261006091716-ab29568d` (done, no-follow-on).
  - Checker's recorded verdict: "PASS for candidate a45087a: exact requested section, wording, placement and scope verified independently."
  - Builder's closing note: "Accepted: dev-check PASS for candidate a45087a (no findings). … only CLAUDE.md changed; npm test 8/8 pass."
  - Time: job sent 09:14Z, checker passed 09:17:16Z, builder closed about 09:17:50Z.
- **The new section, verbatim** (`CLAUDE.md`, after "Cloud session limits"; 10 lines with its heading):

  ```
  ## The rented Linux machine and its OpenRig team

  On the rented Linux machine (`agent-machine-dan`) the OpenRig team (builder
  `dev-owner`, checker `dev-check`, rig `first-project-mixed`) is the default.
  Every brief either hands its change to the team or states in its first
  paragraph the reason it runs as plain Claude Code. The two reasons: (i) the
  job only reads or writes records (notes, cards, reports), with no code change
  for a checker to check; (ii) the job must survive the deploy-restart of that
  machine. For the procedure, follow the section "OpenRig team is the default"
  of `/data/home/dan/FACTS.md`.
  ```
- **`docs/CHECKS.md`: no sentence.** That file lists the kit's automated checks (syntax, tests, screenshots) and when they run. It does not list the rules a session is checked against, so rule 3's condition does not hold.
- **This report** is the only file this session added to the pull request. It is a record, with no code for the checker to check.

## What the brief got wrong
1. **Gate "no other Claude Code session running."** Three other sessions were connected to the machine but idle (openrig-setup card brief from 3 Oct, skill-mirror card brief, completed; the old agent-machine session from 1 Oct). None was working and no rig was running, so I went ahead. The same thing happened in openrig-default-one.
2. Nothing else. FACTS.md and the brief agreed on every machine fact this session used.

## Deliberate divergences
- **The seat watcher was fixed during the job, which is outside the brief's scope (the machine).** `~/openrig-setup/tools/seat-watch.sh` line 41 now reads the queue with `-a`. This was done at Dan's direction to treat the stall as an error (see "Error: the stall"). It is a one-flag change to a local file that is in no repository. The old copy is kept in the session scratchpad.
- **No close-out note in `PLAN.md`.** The kit's own `CLAUDE.md` asks for one. Brief rule 3 ("Nothing else in the kit changes") takes precedence for this job.
- **`rig send` without `--wait-for-idle`, as in openrig-default-one.** The job landed and the builder started on it at once.

## Error: the stall (09:17–09:21Z)
- **What happened.** I supervised the team through `seat-watch.sh` under the Monitor tool. It reported the builder's row pending and in progress, then the checker's row pending and in progress, then the builder's return row pending and in progress. It never reported a closed row: not the two handoffs (09:17:16Z and 09:17:19Z) and not the builder's done at about 09:17:50Z. I found the checker's PASS by reading the queue myself. I then ended my turn saying I was waiting for the builder's return row, trusting the watcher to wake me. Nothing woke me. Dan asked "is anything actually happening here?" at about 09:21. The team had finished about 3 minutes earlier, and about 4 minutes passed with nothing happening.
- **Root cause.**
  - Tool behavior. `rig queue list` without `-a` lists only open rows, so a row drops out the moment it closes. The watcher's header says it reports done, blocked, failed and handed-off, but its query could never see them.
  - My own process compliance. The two missed handoff lines were evidence of that gap, earlier in the same run, and I did not act on it. I ended a turn on a wake signal I had never seen fire for that kind of event.
  - It is the same class as Taste constraint `hoowow9z57cyzvj57ej2`: an unverified parameter in my own query fenced out the answer, and the silence was read as "still working".
- **Context fatigue:** not a factor. This happened early in a short session, on the first wait of its kind.
- **Fix applied.** On Dan's question I read the builder's screen and the queue, pushed, and carried on. `seat-watch.sh` now reads `rig queue list -a`. A test run of its parser lists `ab29568d:…:done`, `cb4fbaee:…:handed-off` and `2745cdde:…:handed-off`; the old query listed none of them.
- **Prevention.**
  - Watcher fix: `-a` added (above).
  - Memory file `wait-on-the-end-state.md` (indexed in `MEMORY.md`): before ending a turn to wait on a specific end state, arm a one-shot background wait on that row and state, unless the watcher has already emitted that kind of event in the session.
  - A known-gotchas entry in the error-analysis skill's local copy. This copy is not saved to Dan's account, and the next sync may overwrite it.
  - Check: with either the flag fix or the one-shot wait in place, the builder's done at about 09:17:50Z would have woken this session.
- **Persisted:** a NEW INSTANCE paragraph and a detection line were appended to Taste constraint `hoowow9z57cyzvj57ej2` (provenance event `vnjqfsfnfw76ozfzvy4w`). Severity stays "material".

## Verify — numbers
- **Mode at start:** `get_session` → `permission_mode: acceptEdits`.
- **Environment:**
  - `FLY_APP_NAME=agent-machine-dan`; `/data/home/dan/FACTS.md` present.
  - `gh`: "Logged in to github.com account isleofdan".
  - `rig --version` → `0.6.4 (63428628)`, as FACTS.md names.
  - Codex: "Logged in using ChatGPT".
  - `get_thread starting-kit` worked.
- **`rig ps`:**
  - Before: "0 rigs · 0 seats · 0 need attention", "not shown: 3 stopped · 5 archived".
  - During: both seats `run`.
  - After: "0 rigs · 0 seats · 0 need attention", "not shown: 3 stopped · 6 archived".
- **Team start:** `rig up ~/openrig-setup/rig/first-project-mixed.rig.yaml --cwd ~/work/kit-team-rule` printed "Rig: 01M487R6R69TGW6YTJ3Z1EWCHC" and "Archived the stopped earlier "first-project-mixed" rig 01M45YWWGMXYSZKJRZVE5H7X13; its records are kept. Restore it with: rig unarchive 01M45YWWGMXYSZKJRZVE5H7X13". There was no folder-trust question.
- **Queue ids and verdict:** as in "What stands".
- **Prompts: 2, both from the builder; 0 from the checker.** Each was answered once with "Yes" (option 1). There was no "don't ask again" and no mode change.
  1. 09:14:43Z, `grep -n "OpenRig team is the default" -A 30 /data/home/dan/FACTS.md` (reading outside the project folder). The dialog showed no reason line, only "Bash command" and the option "Yes, allow reading from /data/home/dan from this project".
  2. 09:16:01Z, a read-only `grep -n "^## " CLAUDE.md; awk …; git diff --stat; git diff --numstat`. Reason: "This command requires approval".
  - The builder's commit raised no prompt this time. The one-line-commit guidance holds.
- **Pull request:** https://github.com/isleofdan/starting-kit/pull/10. Checks: "checks" passed in 25 s (run 37442428528) and 16 s (run 37442631779).
- **Snapshot:** `rig down first-project-mixed --snapshot` printed "Snapshot: 01M488CS6ENNHV0TZ18PPK7ZNA" and "To restore: rig restore 01M488CS6ENNHV0TZ18PPK7ZNA --rig 01M487R6R69TGW6YTJ3Z1EWCHC".
- **FACTS.md (machine copy) updated:** new team id, earlier id archived, new snapshot and restore line.

## Asks
1. Merge pull request #10? Recommended: yes.

## What the next session needs
- The machine copy of FACTS.md has today's team id and snapshot. The repo copy (`docs/FACTS.md` in `isleofdan/agent-machine`) still has 5 Oct's. The boot installer replaces the machine copy only when the repo copy changes, so the machine copy holds until the next session that edits the repo copy, which should carry these two lines.
- `~/openrig-setup/tools/seat-watch.sh` is in no repository. Its `-a` fix lives only on the volume. Whichever session next works on the agent-machine repo can add the tool there, so a rebuilt volume gets the fixed copy.

## Fly machine and OpenRig lessons
- **`rig queue list` without `-a` hides closed rows, so seat-watch never reported done or handed-off.**
  - What happened: about 4 minutes idle after the team finished, until Dan asked; he called it an error.
  - Fix: `-a` in seat-watch.sh; a one-shot background wait on the exact row before ending a turn to wait (memory `wait-on-the-end-state`).
- **The seat-watch QUEUE ids are the last 8 characters, not the timestamp.**
  - What happened: I first queried `qitem-20261006091719-ab29568d` (the watcher's event time) and got nothing; the row was created at `…091716…`. One wasted read.
  - Fix: take full ids from `rig queue list -a -A --destination <seat> --json`.
- **`rig queue list` without `--json` prints a JSON-ish tail that cut off in `tail`.**
  - Fix: `--json` and parse it.
- **A fresh builder's job raised only 2 prompts, both read-only checks; the commit raised none.**
  - What happened: last time a job of this kind raised 8.
  - Fix: one-line commits in the builder's guidance (from openrig-default-one) are holding.
- **The clone shows the seats' own files as untracked** (`.agents/`, `.claude/plugins/`, `.claude/settings.local.json`, `.claude/skills/`, `.codex/`, `.openrig/`, `AGENTS.md`, `CLAUDE.local.md`).
  - Fix: leave them out of commits; stage only named files.
