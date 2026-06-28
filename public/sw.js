// ToDo アプリ用 Service Worker（オフライン対応）
// キャッシュ名にバージョンを含め、更新時に古いキャッシュを破棄する
const CACHE = "todo-app-v2";
const APP_SHELL = ["/", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png"];

// インストール時にアプリシェルを事前キャッシュ
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// 有効化時に古いバージョンのキャッシュを削除
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // GET 以外・他オリジンは素通し
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  // ページ遷移はネットワーク優先（最新を表示）、失敗時はキャッシュした "/" を返す
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/")))
    );
    return;
  }

  // 静的アセット等は stale-while-revalidate（キャッシュ即返し＋裏で更新）
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
