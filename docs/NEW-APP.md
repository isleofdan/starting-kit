# Starting a new app from the kit

For a Claude Code session whose brief is to start a new app of Dan's.
Follow the steps in order; each says what you should see. The example app
is called `proof-app`; use your app's name wherever that appears.

## What you get

A plain Node server whose only runtime dependencies are the two Sentry
packages (`@sentry/node`, `@sentry/browser`): Dan's sign-in page
(passphrase, 30-day cookie), one sample screen, crash reports to Sentry
(off until the app's DSN is in `fly.toml`; step 4), installable on the phone
as an app (Chrome's **Install app**; manifest named from `app.json`, a
service worker that keeps nothing, two icons), a status page with the
"alive since" line and the last outside error, checks (`npm test`), a
screenshot run at phone and computer size that signs in through the form
(`npm run screenshots`), one command that runs every check in order
(`npm run check`), checks that run by themselves after every edit an agent
makes and on every push and pull request (`docs/CHECKS.md`), the rules for
what an agent may and may not touch (`.claude/settings.json`, and in words
in `CLAUDE.md`), a deploy workflow run by hand that creates the Fly app and
proves it, a workflow that removes the Fly app, and the notes files with
the rules every session follows (`CLAUDE.md`).

## 1. The new repository

Dan creates the repository, `isleofdan/proof-app`, empty, on GitHub. (If
the kit is marked as a template on GitHub, he can instead press **Use this
template** on https://github.com/isleofdan/starting-kit and skip step 2's
copy; you then start at step 3.) Your session needs it attached for
writing.

## 2. Copy the kit into it

From the folder that holds your clone of the new repository (`proof-app`):

    git clone --depth 1 --branch main https://github.com/isleofdan/starting-kit kit-copy
    rm -rf kit-copy/.git kit-copy/docs/SOURCES.md kit-copy/docs/NEW-APP.md kit-copy/docs/reports/screenshots
    find kit-copy/docs/reports -name '*-report.md' -delete
    cp -r kit-copy/. proof-app/
    rm -rf kit-copy
    cd proof-app
    git checkout -b <your branch>

The kit's own `.git` folder is removed before copying, so your clone keeps
its own history.

You should now have `app.json`, `server.js`, `lib/`, `public/`, `test/`,
`scripts/`, `.claude/settings.json`, `.github/workflows/checks.yml`,
`.github/workflows/deploy.yml`, `.github/workflows/remove.yml`,
`Dockerfile`, `fly.toml`, `README.md`, `PLAN.md`, `CLAUDE.md`,
`docs/CHECKS.md` and `docs/reports/.gitkeep`.
You also have `ABOUT.md`, the one page that describes the app to a stranger under six fixed headings.
Fill in `ABOUT.md` before the first deploy (step 8), following the line under each heading.

## 3. Name it, in one place

Edit `app.json`:

    {
      "name": "proof-app",
      "title": "Proof app"
    }

`name` is lowercase letters, digits and hyphens; the Fly app becomes
`proof-app-dan` and the site `https://proof-app-dan.fly.dev`. `title` is
what the screens show. Nothing else in the kit carries the name.

Replace `public/icon-192.png` and `public/icon-512.png` with the app's own
icon (PNG, square, the mark inside the middle 60% so Android's rounded
mask does not cut it), and set `theme_color` in `server.js`'s `manifest()`
and the `theme-color` line in each screen to the app's accent. The app
stays installable on the phone: that is the default for every app of
Dan's, dropped only for a reason stated in the brief and in `PLAN.md`.

## 4. Crash reporting

The app reports its unexpected errors to Sentry once its DSN is in
`fly.toml` (`README.md`, "Crash reports"). One Sentry project per app.

**Dan, in Chrome on his Windows computer:**

1. He opens https://shulman-advisory.sentry.io/projects/new/. He sees
   the heading **Choose your platform**, with a tile per platform.
2. Under **Choose your platform** he clicks the tile **Node.js**.
3. In the field **Project name** he types the app's name exactly as
   `app.json` spells it (for example `proof-app`).
4. In the **Team** box he leaves `#shulman-advisory` as it is.
5. He clicks **Create Project**. Sentry shows the page **Configure Node.js
   SDK**, with code to copy. He taps nothing on it and closes the tab: the
   session writes the configuration.

Nothing else in Sentry needs changing: the Sentry integration that calls
the Spine (one Wall card per issue) is one for the whole organisation and
is already in place.

**Then the session** (it never prints the token):

1. `test -f /data/home/dan/.config/sentry/auth-token` succeeds. (The token
   was placed there through the Spine secrets page.)
2. `GET https://sentry.io/api/0/projects/shulman-advisory/<app>/keys/`,
   with the token as `Authorization: Bearer <token>`, answers 200 (and
   only 200 counts), with `<app>` the name in `app.json`.
3. `dsn.public` of the active key (`isActive: true`) goes into `fly.toml`
   `[env]` as `SENTRY_DSN = "<dsn.public>"`, replacing the empty value.

If the file is missing, or the call answers anything but 200, the session
says exactly what answered (the status and Sentry's message) and asks the
origin thread, never Dan in the session.

After the first deploy (step 8), the step "Check a crash reaches Sentry"
prints `crash-test: 500`, and a card for
`Error: crash-test: this app reports crashes` reaches Dan's Wall.

## 5. Make the notes the app's own

- `README.md`: replace the kit's text with what this app is, for a
  stranger. Keep the "Running it on a computer" section.
- `PLAN.md`: rename the heading "Decisions (starting-kit-one, …)" to this
  app's first session and add the app's own decisions; keep the kit's lines
  that still hold.
- `CLAUDE.md`: keep it as it is; add the app's own rules below it.

## 6. Run it on this computer

    npm install
    npm run check
    APP_PASSWORD=try-me COOKIE_SECRET=any-long-text npm run dev

`npm run check` ends with `check: all passed: syntax, tests, screenshots`
(on a machine without Playwright's browser: `…; skipped screenshots (no
browser on this machine; …)`, and the Checks workflow runs them). With the server running,
open http://localhost:8080: you land on the sign-in page with the app's
title. Type `try-me` and press **Sign in**: you see "This is Proof app".
**Status** shows `alive since <time> · <commit>` (the commit reads
`unknown` until the new repository has its first commit) and "Nothing
called yet."
Stop the server, then:

    npm run screenshots

It ends with `all checks passed` and saves six images into
`docs/reports/screenshots/` (sign-in, sample, status, each at phone and
computer size). Commit.

## 7. The two secrets Dan adds

On GitHub, in the new repository: **Settings → Secrets and variables →
Actions → New repository secret**, twice:

- `FLY_API_TOKEN`: a Fly org token for his personal org (made with
  `fly tokens create org`; the same token his other apps use works). A
  deploy token cannot create the app.
- `APP_PASSWORD`: the passphrase for the sign-in page.

`COOKIE_SECRET` is made by the deploy the first time and kept on Fly;
nobody adds it. Your session cannot read the secrets: the deploy's step
"Refuse to run without the secrets" is the check.

## 8. Deploy once

After the pull request is merged into `main`: **Actions → Deploy → Run
workflow** on `main` (or the GitHub tool's "run workflow" with
`deploy.yml` on `main`). The run must be green and print, in order:

    Both repository secrets are present: FLY_API_TOKEN, APP_PASSWORD.
    App proof-app-dan not found; creating it in org personal.
    APP_PASSWORD staged from the repository secret.
    COOKIE_SECRET made and staged.
    alive: status 200
    alive: alive since <time> · <first 7 characters of the commit>
    status page without a cookie: 303 https://proof-app-dan.fly.dev/login?next=%2Fstatus
    sign-in form: HTTP 303
    cookie: proof_app_auth, expires <30 days from now>
    signed in: yes (sample screen: HTTP 200, "This is Proof app")
    sign-in form: HTTP 303
    crash-test: 500

On later runs the second and fourth lines read "App proof-app-dan exists."
and "COOKIE_SECRET already set; leaving it." To change the passphrase, Dan
changes `APP_PASSWORD` in GitHub and the deploy is run again.

To stop a trial copy costing: **Actions → Remove the Fly app → Run
workflow**, typing `proof-app-dan` to confirm. Never on an app that holds
Dan's records unless he asked for exactly that.

## Checks and rules come with the copy

A new app inherits both without doing anything: the after-every-edit hook
and the permission rules in `.claude/settings.json`, the "Checks" workflow,
and the section "What an agent may and may not touch" in `CLAUDE.md`. Its
own tests go in `test/` and its own screens in `SCREENS` in
`scripts/screenshots.mjs`; `npm run check` picks both up.

**When the app has a real audience** (people other than Dan, or records
Dan would miss), its session narrows the rules, in both copies at once
(`.claude/settings.json` and the `CLAUDE.md` section), never just one:
move `Bash(git push *)` from `allow` to `ask` if a pushed branch can reach
others (for example when Deploy runs on every push to `main`); add
`Bash(sqlite3 *)` to `deny` once the app keeps a database; and add any new
paid service's command-line tool to `deny`, with its workflow named as the
way to use it. Widening a rule is Dan's yes/no, asked under **Needed from
you**.

**An app made before the kit had these** adopts them in its next session:
that session copies `scripts/check.mjs`, `.claude/settings.json`,
`.github/workflows/checks.yml` and `docs/CHECKS.md` from the kit's `main`,
adds the `check` line to `package.json`'s scripts and the `CLAUDE.md`
section, then adjusts both copies of the rules to what the app has (its
database, its audience, its paid services) as above. It times the checks
on its own machine before keeping the after-every-edit hook, and lands it
all through a pull request whose Checks run is green, like any other change.

## When the app keeps records

Do it the way the three apps (`isleofdan/miwa-english`,
`isleofdan/hebrew-reader`, `isleofdan/french-ear`) do:

- `npm install better-sqlite3`; open one database file under
  `process.env.DATA_DIR` (`/data` on Fly, `./var` on a computer).
- `Dockerfile`: before `COPY package.json package-lock.json ./`, add

      RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
          && rm -rf /var/lib/apt/lists/*

  and `ENV DATA_DIR=/data`.
- `fly.toml`: raise `memory` to `"512mb"` and add

      [mounts]
        source = "proof_data"
        destination = "/data"   # never change this path

- `.github/workflows/deploy.yml`: after "Create the app if it does not
  exist", add

      - name: Create the volume if there is none
        run: |
          if flyctl volumes list --app "$APP" | grep -q proof_data; then
            echo "Volume proof_data exists."
          else
            flyctl volumes create proof_data --region nrt --size 1 --app "$APP" --yes
          fi

- New fields on a table that holds Dan's data: `ALTER TABLE … ADD COLUMN`
  and back-fill, never drop and recreate (`CLAUDE.md`, "Do not reverse").

## When the app calls something outside itself

Every call goes through `lib/upstream.js` (`upstream.call('OpenRouter',
url, options)`), so the status page shows the last failure with that
service's own status and message. Add the service's key as a repository
secret, and in the deploy set it the way `APP_PASSWORD` is set.
