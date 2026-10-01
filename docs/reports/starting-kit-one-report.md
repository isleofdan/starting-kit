# FIELD REPORT — starting-kit-one — 2 Oct 2026

Session starting-kit-one, a Claude Code cloud session, ran the brief filed
on the wall card `starting-kit` (Personal Shipyard). Pull request:
https://github.com/isleofdan/starting-kit/pull/1. The deploy and removal
results come after the merge, as a separate note on the card.

## What stands

The starting kit exists in `isleofdan/starting-kit`: the folder every new
app of Dan's is copied from. An app made from it shows Dan three screens:
its own sign-in page (a web form, so it works in phone in-app browsers;
one passphrase; signed in for 30 days; spaces around the passphrase
ignored), a sample screen saying "This is <app name>", and a status page
with the line `alive since <UTC time> · <commit>` and the last error from
anything outside the app it called ("Nothing called yet." for the kit).
Behind them: a deploy run by hand that creates the Fly app in Tokyo, sets
the passphrase from GitHub every run, makes the cookie secret once, deploys
and then signs in through the form to prove it; a "Remove the Fly app" run;
`README.md`, `PLAN.md`, `CLAUDE.md` (the rules every session on an app
follows) and `docs/reports/`. `docs/NEW-APP.md` tells a future session how
to start an app from it, and was proven by following it to the letter.
The app's name lives only in `app.json`.

Proven on a computer in the sandbox. Not yet proven: the deploy on Fly,
which runs after the merge.

## What the brief got wrong

1. **French ear's deploy is not the old one.** The brief said French ear
   still set the passphrase only when missing (as of 27 Sep). On 2 Oct its
   `main` sets it every run, like Miwa's. The one still on the old step is
   `hebrew-reader`. Nothing was copied from either old step.
2. **Two of the source apps have no `CLAUDE.md`.** `hebrew-reader` and
   `french-ear` have only `README.md` and `PLAN.md`; the kit's `CLAUDE.md`
   came from Miwa's, agent-machine's and the spine's.
3. **Three steps cannot be done from a cloud session.** The proxy refuses
   reading the repository's secrets (`gh secret list`: HTTP 403, "Access to
   this GitHub Actions path is not permitted"), marking the repository as a
   template, and changing its default branch (both HTTP 403, "Repository
   settings writes are not permitted"). The deploy's first step checks the
   two secrets by name instead; the two settings are asks below.
4. **The repository needed a `main` before a pull request could exist.** The
   repo was empty, so there was no branch to merge into, and the first branch
   pushed (this session's) became GitHub's default. The session pushed a
   one-file commit (`.gitignore`) and created `main` from it through the
   GitHub tool's create-branch call, then built everything on its own branch
   and opened the pull request into that `main`. Nothing was pushed to `main`
   directly.
5. **Attaching the repositories needed Dan's word.** The session's safety
   check refused to attach `starting-kit` for writing, and `hebrew-reader`
   and `french-ear` for reading, until Dan said yes in the session.

## Deliberate divergences

- **No database in the kit.** All three apps keep SQLite on a Fly volume,
  but the kit stores nothing, and a volume would cost money and add a step
  for no use. `docs/NEW-APP.md`, "When the app keeps records", gives the
  three apps' exact lines to add.
- **No runtime dependencies.** The server uses only what comes with Node.
  Playwright is there only to take screenshots.
- **Machine:** `shared-cpu-1x` with 256 MB (the apps use 512 MB for their
  database), always on, one machine (`--ha=false`, from agent-machine).
- **The deploy runs by hand only**, as the brief asks. The three apps also
  deploy on every push to `main`; an app can add that in one line.
- **`/alive` is also Fly's health check**, in place of the apps' `/health`.
- **"Remove the Fly app" asks for the app's Fly name typed in** before it
  deletes anything, so it cannot be run by mistake on the wrong app.
- **Screenshots go in `docs/reports/screenshots/`**, inside the reports
  folder as asked, so `npm run screenshots` can refresh them in place.
- **The sign-in page asks for the passphrase only**, like the three apps;
  agent-machine also asks for a username.
- **The cookie lasts 30 days** (French ear, Hebrew reader, agent-machine);
  Miwa's lasts 90.

## Verify results

1. **Screenshots, both sizes:** six images in `docs/reports/screenshots/`:
   `signin-phone.png`, `signin-computer.png`, `sample-phone.png`,
   `sample-computer.png`, `status-phone.png`, `status-computer.png`. Taken
   by `npm run screenshots`, which signs in by typing into the form; all 16
   of its checks passed, including no sideways scrolling on any screen.
2. **Local sign-in:** a wrong passphrase (`open sesame!`) answered 401, set
   no cookie, and the page said "That passphrase is not right. Try again."
   The right one with spaces and a line break around it was accepted
   (303) and set `Max-Age=2592000` with
   `Expires=Sat, 31 Oct 2026 15:23:09 GMT`, 30 days out. A forged cookie
   was refused. `npm test`: 8 pass, 0 fail.
3. **Alive and status:** `/alive` without a cookie answered 200,
   `alive since 2026-10-01T15:24:05Z · 5da9e56`. `/status` without a
   cookie answered 303 to `/login?next=%2Fstatus`.
4. **`NEW-APP.md` followed literally:** in a scratch folder, its steps made
   `proof-app`; `npm test` passed 8 of 8; the running copy landed on the
   sign-in page titled "Proof app", the passphrase typed into the form
   showed "This is Proof app", and Status showed the alive line and
   "Nothing called yet."; `npm run screenshots` passed. Two places where the
   session had to guess were fixed in the guide: the copy step's order (so
   the kit's own git folder never lands on the new app's), and the commit
   in the alive line, which reads `unknown` until the copy's first commit.
   The kit is copied from `main` explicitly while the default branch is
   not yet `main`. The proof cloned the work branch, as `main` held only
   the base commit before the merge. Not proven here: the Docker image
   build (the sandbox has no Docker daemon); Fly's builder builds it on the
   first deploy.
5. **Secret names:** not readable from this session (HTTP 403 from the
   proxy). The deploy's step "Refuse to run without the secrets" checks
   both by name and stops before touching Fly if either is missing, so the
   first deploy run is that check.
7. **Before the pull request:** `git status --short` empty;
   `git log origin/claude/starting-kit-brief-8lacbq..HEAD` empty.

## Asks

1. **Merge the pull request?** Recommended: yes. Dan answers this one in
   the session.
2. **Set the default branch to `main` and mark the repository as a
   template.** Recommended: the Personal Shipyard chat sends a session that
   can change repository settings (the agent-machine's Claude Code, signed
   in to GitHub as Dan) to run
   `gh repo edit isleofdan/starting-kit --default-branch main --template`.
   Settings page: https://github.com/isleofdan/starting-kit/settings.
   Never Dan by hand.
3. **Should the kit's deploy also run on every push to `main`**, as the
   three apps' do? Recommended: no for the kit (it has no live copy); yes
   for each app, added by that app's first session.

## For the next session that starts an app

To start a new app of Dan's, copy `isleofdan/starting-kit` by following
`docs/NEW-APP.md` in that repository: Dan creates the empty repository; you
clone the kit's `main`, remove its `.git` folder and its own docs (the
guide gives the exact lines), copy it in, and set `name` and `title` in
`app.json`, the only place the name lives. You get a plain Node server with
no runtime dependencies; the app's own sign-in page (passphrase from
`APP_PASSWORD`, 30-day cookie, never the browser's password box); a sample
screen to replace; a status page with the "alive since" line and the last
outside error (route every outside call through `lib/upstream.js`); `npm
test` and `npm run screenshots` (phone and computer, signing in through the
form); a "Deploy" workflow run by hand that creates `<name>-dan` on Fly in
Tokyo and proves itself by signing in; a "Remove the Fly app" workflow; and
`CLAUDE.md` with the rules you must follow, including close-outs and field
reports. Dan adds two repository secrets, `FLY_API_TOKEN` (a Fly org token)
and `APP_PASSWORD`; `COOKIE_SECRET` is made by the first deploy. If the
app keeps records, add SQLite on a volume with the guide's "When the app
keeps records" lines.

## What the next session needs

- The repository's default branch set to `main` and the template mark
  (ask 2). Until then the guide's explicit `--branch main` covers copying.
- The two repository secrets in `isleofdan/starting-kit` are needed only
  for the kit's own proof deploy; each new app needs its own two.
- The deploy note on the card `starting-kit` (after the merge) says
  whether the Fly deploy, the live sign-in and the removal worked.
