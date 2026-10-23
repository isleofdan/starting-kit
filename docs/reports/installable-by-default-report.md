# installable-by-default — report

## What stands
Every app made from the kit is installable on the phone as a Chrome app from its first deploy: manifest named from `app.json`, a service worker that keeps nothing, an install loader, two placeholder icons, all open without the cookie; every screen links them. Rule written in `CLAUDE.md` and `docs/NEW-APP.md`.

## What the brief got wrong
No brief; asked directly by Dan in the Personal Shipyard thread "Phone install for Spine and all web apps" (23 Oct 2026).

## Deliberate divergences
None.

## Verify results
- `npm test`: 10 pass, 0 fail (two new: the five install files answer signed out with their types and the manifest's fields; `/login`, `/` and `/status` link the manifest and the loader).
- Chrome (Playwright Chromium, non-incognito profile, signed in through the form): `Page.getInstallabilityErrors` returned none for `/`; manifest at `/manifest.webmanifest`.

## Asks
None.

## What the next session needs
An app copied from the kit replaces the two icons and its theme color (`docs/NEW-APP.md` step 3).
