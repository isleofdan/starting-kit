# Local report: Checks runner compatibility

## What stands
Local-only correction on published draft head 7831b662d3afef81f5d3613b1949a4bbdf340667: pin Checks to ubuntu-24.04. Tests, dependency versions, triggers, permissions, timeout and commands are unchanged. No publication, workflow dispatch, merge, deployment or restart performed for this correction.

## What the brief got wrong
No discrepancy found. Diagnosis was verified against source and historical execution, not just matching error text.

## Evidence and verify results
- Refreshed main remains 4ec08445cce46ee4ff81ca06e2f57bd23871da31.
- Latest successful Checks run https://github.com/isleofdan/starting-kit/actions/runs/40274108870 used that exact main commit, Ubuntu 24.04.5, image ubuntu-24.04 version 20261012.334. Job 121413063106 installed Chromium build 1194 and reported all passed: syntax, tests, screenshots.
- Draft PR run https://github.com/isleofdan/starting-kit/actions/runs/41017082551 used Ubuntu 26.04.1, image ubuntu-26.04 version 20261025.179.1. Job 123935753077 completed npm ci, then Playwright rejected chromium on ubuntu26.04-x64; checks were skipped.
- Workflow, package.json, lockfile, scripts and tests are unchanged between that successful main commit and the published draft head. Lockfile pins playwright and playwright-core 1.56.1.
- The already-installed locked playwright-core 1.56.1 in the companion Spine workspace has ubuntu24.04-x64 Chromium and headless-shell download entries, no ubuntu26.04 entries, and the unsupported-platform error at registry/index.js:1114. This is supporting source evidence; no dependency install was performed for this correction.
- Local assertions confirm only the runner scalar changes in the workflow, and all commands/triggers/tests/dependencies remain unchanged. git diff --check passes.
- No claim of a new Ubuntu 24.04 hosted pass: that requires reviewed publication. Historical success supports the chosen runner but does not prove the current runner image.

## Deliberate divergences
No package upgrade, --with-deps restoration, test weakening or deployment workflow edit. Existing report from checks-stall-one warned of ubuntu-latest migration; its missing-library hypothesis is superseded by the observed unsupported-platform error.

## Asks
1. Independent reviewer: review the exact local patch before parent confirms publication scope. Recommended: approve the runner pin if evidence and unchanged-scope checks hold. No merge or deployment approval requested.

## What the next session needs
On authorized branch publication, existing push and pull_request triggers each run the same ordinary Checks job (npm install, Chromium download, syntax, tests and local browser screenshots). No new trigger, machine session, semantic reviewer or deployment effect is introduced. Deploy and Remove remain manual only. Publishing can cancel an earlier Checks run on the same ref under unchanged concurrency settings. Keep the PR draft; observe both hosted results before any release-readiness claim.
