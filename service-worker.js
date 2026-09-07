const CACHE_NAME = "grana-certa-v1";

const arquivos = [
  "./",
  "./index.html",
  "./estilo.css",
  "./script.js",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(arquivos))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(chaves =>
      Promise.all(
        chaves.map(chave => {
          if (chave !== CACHE_NAME) {
            return caches.delete(chave);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(resposta => resposta || fetch(event.request))
  );
});
