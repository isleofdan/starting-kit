// The service worker that makes the app installable on the phone (Chrome's
// Install app). It keeps no copy of anything: every request goes to the
// server as it would without it, so the app is always the live site and
// nothing of Dan's is stored on the phone. An app that needs more (a share
// target, an offline page) adds it here; isleofdan/kanji-study's sw.js
// holds a share in flight.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => { /* the network answers, as always */ });
