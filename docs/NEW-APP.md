# Starting a new app from the kit

For a Claude Code session whose brief is to start a new app of Dan's.
Follow the steps in order; each says what you should see. The example app
is called `proof-app`; use your app's name wherever that appears.

## What you get

A plain Node server with no runtime dependencies: Dan's sign-in page
(passphrase, 30-day cookie), one sample screen, a status page with the
"alive since" line and the last outside error, checks (`npm test`), a
screenshot run at phone and computer size that signs in through the form
(`npm run screenshots`), a deploy workflow run by hand that creates the Fly
app and proves it, a workflow that removes the Fly app, and the notes
files with the rules every session follows (`CLAUDE.md`).

## 1. The new repository

Dan creates the repository, `isleofdan/proof-app`, empty, on GitHub. (If
the kit is marked as a template on GitHub, he can instead press **Use this
template** on https://github.com/isleofdan/starting-kit and skip step 2's
copy; you then start at step 3.) Your session needs it attached for
writing.

## 2. Copy the kit into it

From the folder that holds your clone of the new repository (`proof-app`):

    git clone --depth 1 https://github.com/isleofdan/starting-kit kit-copy
    rm -rf kit-copy/.git kit-copy/docs/SOURCES.md kit-copy/docs/NEW-APP.md kit-copy/docs/reports/screenshots
    find kit-copy/docs/reports -name '*-report.md' -delete
    cp -r kit-copy/. proof-app/
    rm -rf kit-copy
    cd proof-app
    git checkout -b <your branch>

The kit's own `.git` folder is removed before copying, so your clone keeps
its own history.

You should now have `app.json`, `server.js`, `lib/`, `public/`, `test/`,
`scripts/`, `.github/workflows/deploy.yml`, `.github/workflows/remove.yml`,
`Dockerfile`, `fly.toml`, `README.md`, `PLAN.md`, `CLAUDE.md` and
`docs/reports/.gitkeep`.

## 3. Name it, in one place

Edit `app.json`:

    {
      "name": "proof-app",
      "title": "Proof app"
    }

`name` is lowercase letters, digits and hyphens; the Fly app becomes
`proof-app-dan` and the site `https://proof-app-dan.fly.dev`. `title` is
what the screens show. Nothing else in the kit carries the name.

## 4. Make the notes the app's own

- `README.md`: replace the kit's text with what this app is, for a
  stranger. Keep the "Running it on a computer" section.
- `PLAN.md`: rename the heading "Decisions (starting-kit-one, …)" to this
  app's first session and add the app's own decisions; keep the kit's lines
  that still hold.
- `CLAUDE.md`: keep it as it is; add the app's own rules below it.

## 5. Run it on this computer

    npm install
    npm test
    APP_PASSWORD=try-me COOKIE_SECRET=any-long-text npm run dev

`npm test` ends with `# pass 8` and `# fail 0`. With the server running,
open http://localhost:8080: you land on the sign-in page with the app's
title. Type `try-me` and press **Sign in**: you see "This is Proof app".
**Status** shows `alive since <time> · <commit>` and "Nothing called yet."
Stop the server, then:

    npm run screenshots

It ends with `all checks passed` and saves six images into
`docs/reports/screenshots/` (sign-in, sample, status, each at phone and
computer size). Commit.

## 6. The two secrets Dan adds

On GitHub, in the new repository: **Settings → Secrets and variables →
Actions → New repository secret**, twice:

- `FLY_API_TOKEN`: a Fly org token for his personal org (made with
  `fly tokens create org`; the same token his other apps use works). A
  deploy token cannot create the app.
- `APP_PASSWORD`: the passphrase for the sign-in page.

`COOKIE_SECRET` is made by the deploy the first time and kept on Fly;
nobody adds it. Your session cannot read the secrets: the deploy's step
"Refuse to run without the secrets" is the check.

## 7. Deploy once

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

On later runs the second and fourth lines read "App proof-app-dan exists."
and "COOKIE_SECRET already set; leaving it." To change the passphrase, Dan
changes `APP_PASSWORD` in GitHub and the deploy is run again.

To stop a trial copy costing: **Actions → Remove the Fly app → Run
workflow**, typing `proof-app-dan` to confirm. Never on an app that holds
Dan's records unless he asked for exactly that.

## When the app keeps records

Do it the way the three apps (`isleofdan/miwa-english`,
`isleofdan/hebrew-reader`, `isleofdan/french-ear`) do:

- `npm install better-sqlite3`; open one database file under
  `process.env.DATA_DIR` (`/data` on Fly, `./var` on a computer).
- `Dockerfile`: before `COPY . .`, add

      RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
          && rm -rf /var/lib/apt/lists/*
      COPY package.json package-lock.json ./
      RUN npm ci --omit=dev

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
