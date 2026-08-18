const STATIC_CACHE = "fireguard-static-v2";
const RUNTIME_CACHE = "fireguard-runtime-v2";
const DATA_CACHE = "fireguard-data-v2";

const CORE_ASSETS = [
  "/",
  "/locations-seed.json",
  "/14471459_3840_2160_30fps.mp4",
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

    const staticCache = await caches.open(STATIC_CACHE);

    const seed =
      await staticCache.match("/locations-seed.json");

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

async function networkFirstHome(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);

    if (response.ok) {
      await cache.put("/", response.clone());
    }

    return response;
  } catch (error) {
    return (
      (await cache.match("/")) ||
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
    await cache.put(request, response.clone());
  }

  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  // Latest Supabase-backed FACP data when online.
  // Last successful data / bundled seed when offline.
  if (url.pathname === "/api/locations") {
    event.respondWith(
      networkFirstLocations(request),
    );
    return;
  }

  // Main FireGuard page works offline.
  if (
    request.mode === "navigate" &&
    url.pathname === "/"
  ) {
    event.respondWith(
      networkFirstHome(request),
    );
    return;
  }

  // Admin / reports / patrol / login etc:
  // always request latest online page.
  // If internet disappears, return main offline dashboard.
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

  // Next.js hashed static assets + FireGuard local assets
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname ===
      "/14471459_3840_2160_30fps.mp4" ||
    url.pathname === "/locations-seed.json" ||
    url.pathname === "/favicon.ico"
  ) {
    event.respondWith(cacheFirst(request));
  }
});
