const cacheName = "Inbetweenies";
const staticAssets = [
  "index.html",
  "Manifest.json",
  "dist/js/jquery-3.6.0.min.js",
  "dist/css/bootstrap.min.css",
  "dist/js/bootstrap.bundle.min.js",
  "css/style.css",
  "js/app.js",
  "js/globals.js",
  "js/home.js",
  "js/game.js",
  "js/scoreboard.js",
  "js/deck.js",
  "js/logging.js",
  "images/avatars/avatar0.png",
  "images/avatars/avatar1.png",
  "images/avatars/avatar2.png",
  "images/avatars/avatar3.png",
  "images/avatars/avatar4.png",
  "images/avatars/avatar5.png",
  "images/avatars/avatar6.png",
  "images/avatars/avatar7.png",
  "images/avatars/avatar8.png",
  "images/avatars/avatar9.png",
  "images/avatars/avatar10.png",
  "images/avatars/avatar11.png",
  "images/avatars/avatar12.png",
  "images/avatars/avatar13.png",
  "images/avatars/avatar14.png",
  "images/avatars/avatar15.png",
  "images/cards/cardback.gif",
  "images/cards/K.gif",
  "images/cards/Q.gif",
  "images/cards/J.gif",
];

self.addEventListener('install', event => {
    //console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                cache.addAll(staticAssets);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(async function() {
      try {
        return await fetch(event.request);
      } catch (err) {
        return caches.match(event.request);
      }
    }());
  });