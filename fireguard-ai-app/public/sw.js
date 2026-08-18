const STATIC_CACHE = "fireguard-static-v7";
const RUNTIME_CACHE = "fireguard-runtime-v7";
const DATA_CACHE = "fireguard-data-v7";

const CORE_ASSETS = [
  "/",
  "/locations-seed.json",
  "/favicon.ico",
  "/fireguard-icon-512.png",
  "/fireguard-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);

      for (const asset of CORE_ASSETS) {
        try {
          const response = await fetch(asset, {
            cache: "reload",
          });

          if (response.ok) {
            await cache.put(asset, response);
          }
        } catch (error) {
          console.warn(
            "Could not precache FireGuard asset:",
            asset,
          );
        }
      }

      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const validCaches = new Set([
        STATIC_CACHE,
        RUNTIME_CACHE,
        DATA_CACHE,
      ]);

      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames.map((cacheName) => {
          if (!validCaches.has(cacheName)) {
            return caches.delete(cacheName);
          }

          return Promise.resolve();
        }),
      );

      await self.clients.claim();
    })(),
  );
});

async function notifyContentUpdated() {
  const clients = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  for (const client of clients) {
    client.postMessage({
      type: "FIREGUARD_CONTENT_UPDATED",
    });
  }
}

async function networkFirstLocations(request) {
  const cache = await caches.open(DATA_CACHE);

  try {
    const response = await fetch(request);

    if (response.ok) {
      await cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    const seed = await caches.match(
      "/locations-seed.json",
    );

    if (seed) {
      return seed;
    }

    return new Response(
      JSON.stringify({
        success: false,
        total: 0,
        locations: [],
        message: "Offline database unavailable",
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}

async function revalidateHome(request, cached) {
  const cache = await caches.open(RUNTIME_CACHE);

  const response = await fetch(request, {
    cache: "no-store",
  });

  if (!response.ok) {
    return response;
  }

  const oldEtag =
    cached?.headers.get("etag") || "";

  const newEtag =
    response.headers.get("etag") || "";

  await cache.put("/", response.clone());

  if (
    cached &&
    oldEtag &&
    newEtag &&
    oldEtag !== newEtag
  ) {
    await notifyContentUpdated();
  }

  return response;
}

async function fastHome(request, event) {
  const runtime = await caches.open(RUNTIME_CACHE);

  const cached =
    (await runtime.match("/")) ||
    (await caches.match("/"));

  const networkPromise = revalidateHome(
    request,
    cached,
  );

  if (cached) {
    event.waitUntil(
      networkPromise.catch(() => undefined),
    );

    return cached;
  }

  try {
    return await networkPromise;
  } catch (error) {
    return (
      (await caches.match("/")) ||
      Response.error()
    );
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  const response = await fetch(request);

  if (response.ok) {
    await cache.put(
      request,
      response.clone(),
    );
  }

  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  /*
   * IMPORTANT:
   * Let the browser handle video/Range requests directly.
   * Do not return the full cached MP4 for a partial media request.
   */
  if (
    request.headers.has("range") ||
    request.destination === "video" ||
    url.pathname ===
      "/14471459_3840_2160_30fps.mp4"
  ) {
    return;
  }

  if (url.pathname === "/api/locations") {
    event.respondWith(
      networkFirstLocations(request),
    );
    return;
  }

  if (
    request.mode === "navigate" &&
    url.pathname === "/"
  ) {
    event.respondWith(
      fastHome(request, event),
    );
    return;
  }

  /*
   * Admin, reports, login, patrol etc.
   * Online = latest page.
   * Offline failure = back to cached FireGuard home.
   */
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        return (
          (await caches.match("/")) ||
          Response.error()
        );
      }),
    );
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname === "/locations-seed.json" ||
    url.pathname === "/favicon.ico" ||
    url.pathname === "/fireguard-icon-512.png" ||
    url.pathname ===
      "/fireguard-maskable-512.png"
  ) {
    event.respondWith(
      cacheFirst(request),
    );
  }
});
