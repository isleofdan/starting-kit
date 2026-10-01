# Where each piece of the kit comes from

The kit was distilled on 2 Oct 2026 from four of Dan's repos, read on their
`main` branches: the three live personal apps `isleofdan/miwa-english`,
`isleofdan/hebrew-reader` and `isleofdan/french-ear`, and the rented Linux
machine `isleofdan/agent-machine`. None of them was changed.

**The stack the three apps share.** All three are one plain Node 22 server
(`node:http`, no web framework), plain HTML, CSS and JavaScript pages with
no build step, a Docker image `FROM node:22-slim`, and one always-on Fly
machine in Tokyo (`nrt`). All three also keep their records in SQLite
(`better-sqlite3`) on a Fly volume at `/data`. The kit takes the same stack;
it leaves out the database because the kit itself stores nothing
(`docs/NEW-APP.md` says how an app adds it, copied from the three apps).

## The seven pieces

1. **Passphrase gate.** Taken from `miwa-english`'s `lib/auth.js`, which is
   the same code as `french-ear`'s and `hebrew-reader`'s (all three: an
   HMAC-signed cookie, comparisons through equal-length digests, fail closed
   when `APP_PASSWORD` or `COOKIE_SECRET` is unset), plus its
   `lib/ratelimit.js` (five wrong tries locks one address for 15 minutes).
   Miwa's version is the one that trims spaces and line breaks on both
   sides; the cookie lasts 30 days, as in `french-ear`, `hebrew-reader` and
   `agent-machine` (Miwa's lasts 90).
2. **One-press deploy.** The steps of `miwa-english`'s
   `.github/workflows/deploy.yml` (create the app if missing, set
   `APP_PASSWORD` from the repository secret on every run, make
   `COOKIE_SECRET` once and keep it), with `agent-machine`'s proof after
   deploying: sign in through the form as a person would and check the page
   behind it loads. Run by hand only, as the brief asks.
3. **Reports folder.** `docs/reports/`, the folder all four repos already
   use, one file per session named `<session>-report.md`.
4. **Standing notes files.** `README.md`, `PLAN.md` and `CLAUDE.md`.
   `miwa-english` and `agent-machine` have all three; `hebrew-reader` and
   `french-ear` have no `CLAUDE.md`. The kit's `CLAUDE.md` joins Miwa's
   reply rules, `agent-machine`'s rule against pre-supplied credentials, and
   the close-out rule from `isleofdan/spine`'s `CLAUDE.md`.
5. **Phone and computer layouts.** Every page in the three apps carries
   `<meta name="viewport" content="width=device-width, initial-scale=1">`
   and one stylesheet that reads at 412×915 and 1280×800; the kit takes that
   tag and a small stylesheet in the same spirit (one centered column,
   16 px or larger text, full-width buttons on a phone, light and dark from
   the phone's own setting).
6. **"Alive since" line.** New in the kit; none of the four has it. The
   nearest is the three apps' `/health` (JSON: `ok`, `configured`), which
   Fly's health check calls. The kit's `/alive` answers in plain text and
   is also Fly's health check.
7. **Self-diagnosis spot.** Taken from `miwa-english`'s voice errors
   (`lib/speech.js`): when OpenRouter fails, the app keeps OpenRouter's own
   status and body and shows them. The kit makes that one small module,
   `lib/upstream.js`, that every outside call goes through, and shows its
   last error on the status page.

## Where the sources differ, and what the kit chose

- **Passphrase on every deploy.** `miwa-english` and `french-ear` set
  `APP_PASSWORD` from the repository secret on every run; `agent-machine`
  sets it with its other secrets every run; `hebrew-reader` still sets it
  only when it is missing. The kit sets it every run.
- **Cookie length.** 30 days (three of four), not Miwa's 90.
- **Trimming.** Miwa trims spaces and line breaks on both sides;
  `french-ear` trims spaces; `hebrew-reader` does not trim. The kit trims
  (Miwa's code).
- **Sign-in field.** `agent-machine` asks for a username and a passphrase;
  the three apps ask for the passphrase only. The kit asks for the
  passphrase only.
- **When the deploy runs.** The three apps and `agent-machine` deploy on
  every push to `main` and by hand. The brief asks for a manual workflow, so
  the kit's runs by hand only; an app can add the push trigger in one line.
- **Machine size.** The three apps use `shared-cpu-1x` with 512 MB;
  `agent-machine` 2 CPUs and 2 GB. The kit, which holds no database, uses
  `shared-cpu-1x` with 256 MB, the smallest Fly offers.
- **Two machines or one.** `agent-machine` deploys with `--ha=false` so Fly
  makes one machine, not two (without it Fly makes two for a new app). The
  kit passes `--ha=false` too: one machine is the cheapest that runs it.
