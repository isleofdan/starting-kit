# Field report — the-sign-one — 1 Oct 2026

## What stands

- `SIGN.md` at the root of the starting kit, Dan's text exactly as given
  in the brief (wall card `the-sign`). A check against the text saved from
  the brief prints `identical`.
- `README.md`, line 35: "What the shop is for: `SIGN.md`, copied into every
  app unchanged."
- `CLAUDE.md`, line 3: "Read `SIGN.md` (what Dan's software shop is for)
  before changing anything."
- New apps get `SIGN.md` automatically: `docs/NEW-APP.md` step 2 copies the
  whole kit, and does not remove `SIGN.md`.
- The kit's checks pass here: `check: all passed: syntax, tests,
  screenshots`.

## What the brief got wrong

1. **Branch name.** The brief says to work on a branch named `the-sign`.
   This cloud session was handed its own branch (`ccr-0e0ba195-adcn7t`) and
   is told not to push to any other, so the work is on that branch. The
   result on `main` is the same.
2. **Session date.** The brief is dated 2 Oct 2026; this session ran on
   1 Oct 2026 (the session's own clock). Dates in this report and in
   `PLAN.md` use 1 Oct.
3. **"Exactly three files".** Verify item 4 expects the change to `main` to
   list exactly three files, but the close-out section requires a
   `PLAN.md` note and this report on the same branch. The change lists
   five: `SIGN.md` (new), `README.md` (+1), `CLAUDE.md` (+1), `PLAN.md`
   (close-out note), and this report (new).
4. **"First line removed".** Verify item 1 says to compare `SIGN.md` with
   its first line removed, but the brief's own text begins with that same
   first line ("# The sign"). The whole file was compared with the whole
   text instead; they are identical.
5. **`gh` tooling.** The brief's checks use `gh`; this cloud session has
   no `gh` and uses the GitHub connector for the same steps.

## Deliberate divergences

- None beyond the branch name above.
- Running the screenshots rewrote two images of the status page (its
  "alive since" time changes on every run). They were put back unchanged
  so the change holds only the files above.

## Verify results

1. Text check (before the pull request): `diff SIGN.md brief-sign.txt`
   printed nothing; `identical`. The link to `SIGN.md` on `main` and the
   merged check are recorded on the wall card `the-sign` after the merge.
2. Pointer lines: quoted above, `README.md:35`, `CLAUDE.md:3`.
3. Checks on this machine: `ok syntax (0.29 s)`, `ok tests (0.51 s)`,
   `ok screenshots (3.15 s)`, `check: all passed`. The "Checks" run on the
   pull request and on `main` after the merge are recorded on the wall
   card.
4. Files changed: see "What the brief got wrong", item 3.

## Asks

1. Should apps that already exist get a copy of `SIGN.md`? Recommended
   answer: no, not as a session of its own; each app's next session copies
   it in if Dan names it in that session's brief.

## What the next session needs

Nothing from this one. The Personal Shipyard chat reads this report.
