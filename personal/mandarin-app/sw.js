/* Offline support.

   IMPORTANT: change VERSION every time you edit any file (words, code or styles).
   That's what tells installed copies to fetch the new files. */
const VERSION = "my-mandarin-v0.17.1";

const FILES = [
  "./",
  "index.html",
  "manifest.json",
  "css/app.css",
  "data/essentials.js",
  "data/sentences.js",
  "data/topics/eating-out.js",
  "data/topics/lists.js",
  "data/topics/work-study.js",
  "js/banks.js",
  "js/pinyin.js",
  "js/store.js",
  "js/memory.js",
  "js/session.js",
  "js/sentences.js",
  "js/app.js",
  "js/screens/home.js",
  "js/screens/vocab.js",
  "js/screens/match.js",
  "js/screens/sentences.js",
  "js/screens/settings.js",
  "js/screens/results.js",
  "js/screens/games.js",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      // Only clear this app's own old caches (the Portuguese copy shares the same site).
      .then(keys => Promise.all(keys.filter(k => k.startsWith("my-mandarin-v") && k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Serve from the saved copy first (fast and works offline), fall back to the network.
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(hit => hit || fetch(event.request))
  );
});
