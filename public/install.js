'use strict';
// Makes every screen installable as an app on the phone. The service worker
// keeps nothing: the app is the live site.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => { /* the site works the same without it */ }); });
}
