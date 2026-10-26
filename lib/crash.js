'use strict';
// Crash reporting (from the Hebrew reader's hebrew-crash-one): unexpected
// server errors go to Sentry, whose alert calls the Spine, which files one
// Wall card per issue. Required as the first line of server.js, so Sentry is
// set up before anything else loads.
//
// SENTRY_DSN unset or empty (the kit, npm test, a local run): @sentry/node is
// never loaded and captureException and flush do nothing. Set (fly.toml
// [env]): only the error and its code location are sent; the event's
// request, user, transaction name, extra data, server name and the
// breadcrumbs that carry addresses or logs are dropped by the same scrub the
// pages use (public/crash.js).

const { scrub, SETTINGS } = require('../public/crash.js');

const DSN = (process.env.SENTRY_DSN || '').trim();
let Sentry = null;

if (DSN) {
  Sentry = require('@sentry/node');
  Sentry.init({ dsn: DSN, ...SETTINGS });
}

function captureException(e) {
  if (Sentry) Sentry.captureException(e);
}

// Waits (at most `ms`) until what was captured has been sent.
async function flush(ms = 2000) {
  if (Sentry) await Sentry.flush(ms);
}

module.exports = { enabled: Boolean(Sentry), captureException, flush, scrub };
