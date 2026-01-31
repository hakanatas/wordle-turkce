var CACHE_NAME = 'wordle-tr-v1';
var ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/game.js',
  './js/keyboard.js',
  './js/board.js',
  './js/stats.js',
  './js/dictionary.js',
  './js/theme.js',
  './js/modal.js',
  './data/words-4.js',
  './data/words-5.js',
  './data/words-6.js',
  './manifest.json'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(ASSETS);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return key !== CACHE_NAME;
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (cached) {
        return cached || fetch(event.request);
      })
  );
});
