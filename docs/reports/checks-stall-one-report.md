# Field report: checks-stall-one

2 Oct 2026. The "Checks" workflow stalled in its Install step on `main`
(run 36921837635 cancelled at the 10-minute limit; run 36924913006 took
5 min 15 s) while pull-request runs finished in under a minute.

## What stands

- `.github/workflows/checks.yml` installs Chromium with
  `npx playwright install chromium`, without `--with-deps`. Nothing else in
  the workflow changed: the same three checks (syntax, tests, screenshots)
  run on every push and pull request.
- First run on this branch (36972803507): green in 21 s; all three checks
  passed, the screenshots step in 2.03 s.

## What the brief got wrong

There is no difference between a run on `main` and a run on a pull
request. Both run the same steps. The time went to `--with-deps`, which
runs `apt-get install` for ~32 MB of fonts (`fonts-wqy-zenhei`,
`fonts-freefont-ttf`, `fonts-ipafont-gothic`, `fonts-unifont`, the
`xfonts-*` set) from Ubuntu's mirror, `azure.archive.ubuntu.com`. How fast
that mirror answers depends on the runner, not on the branch:

| Run | Branch, event | Runner region | Font download |
| - | - | - | - |
| 36924568375 | PR branch, pull_request | eastus | 32.1 MB in 1 s |
| 36890595858 | PR branch, pull_request | eastus | 32.1 MB in 6 min 13 s (run took 6 min 50 s) |
| 36891594895 | main, push | westus2 | 32.1 MB in 1 min 31 s |
| 36924913006 | main, push | eastus | 32.1 MB in 4 min 43 s |
| 36921837635 | main, push | westcentralus | stalled; cancelled at 10 min |

So a pull-request run stalled too (36890595858); `main` happened to draw
the slow runs. The index refresh (`apt-get update`, 12.6 MB) was fast in
every run; only the package downloads crawled.

## Deliberate divergences

- No cache, no pinned mirror, no change to which browser the screenshots
  use. Dropping the flag removes the slow download outright; the runner
  image already carries the libraries Chromium needs.
- Screenshots now render with the fonts the runner image ships (it has
  `fonts-liberation` and `fonts-noto-color-emoji`), not the extra
  Japanese, Chinese, Thai and Unicode fallback fonts. The kit's screens
  are English text; the screenshot checks are about signing in and
  fitting the width, which do not depend on those fonts.

## Verify results

- Run 36972803507 (push, this branch): green, 21 s.
  `check: all passed: syntax, tests, screenshots`.
- The pull request's own run is listed on the pull request.
- Not provable from a session: a run on `main` itself, since a session
  never pushes to `main`. The first run after the merge is that proof.

## Asks

1. Merge the pull request? Recommended: yes.

## What the next session needs

- The runner label `ubuntu-latest` moves to Ubuntu 26 from 19 Oct 2026
  (GitHub's notice on every run). If that image lacks a library Chromium
  needs, the screenshots step fails with a missing-library message naming
  it; the fix then is to install that one package, not to restore
  `--with-deps`.
