const STATIC_CACHE = "fireguard-static-v10";
const RUNTIME_CACHE = "fireguard-runtime-v10";
const DATA_CACHE = "fireguard-data-v10";

const CORE_ASSETS = [
  "/icon.png",
  "/locations-seed.json",
  "/facp-assistant-preloader.png",
  "/fireguard-icon-512.png",
  "/fireguard-maskable-512.png",
];

const OFFLINE_PAGES = [
  "/",
  "/patrol",
  "/fire-alarm-report",
  "/incidents",
  "/login",
  "/forgot-password",
  "/admin",
  "/admin/upload",
];

async function fetchAndCache(cache, request) {
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  const response = await fetch(request, {
    cache: "reload",
  });

  if (!response.ok) {
    throw new Error(
      `Could not cache ${request}: ${response.status}`,
    );
  }

  await cache.put(request, response.clone());
  return response;
}

function getStaticAssetUrls(html, pageUrl) {
  const urls = new Set();
  const attributePattern = /(?:src|href)=["']([^"']+)["']/gi;

  for (const match of html.matchAll(attributePattern)) {
    const value = match[1].replaceAll("&amp;", "&");

    try {
      const url = new URL(value, pageUrl);

      if (
        url.origin === self.location.origin &&
        url.pathname.startsWith("/_next/static/")
      ) {
        urls.add(url.href);
      }
    } catch {
      // Ignore invalid or non-HTTP attributes.
    }
  }

  return [...urls];
}

async function cachePageAndShell(
  cache,
  cacheKey,
  response,
  pageUrl,
) {
  const html = await response.clone().text();
  const assetUrls = getStaticAssetUrls(html, pageUrl);

  await Promise.all(
    assetUrls.map((assetUrl) =>
      fetchAndCache(cache, assetUrl),
    ),
  );

  await cache.put(cacheKey, response.clone());
}

async function precachePage(cache, pathname) {
  const response = await fetch(pathname, {
    cache: "reload",
  });

  if (!response.ok) {
    throw new Error(
      `Could not cache ${pathname}: ${response.status}`,
    );
  }

  await cachePageAndShell(
    cache,
    pathname,
    response,
    new URL(pathname, self.location.origin),
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);

      await Promise.all(
        CORE_ASSETS.map((asset) =>
          fetchAndCache(cache, asset),
        ),
      );

      // The home page and its exact hashed Next.js CSS/JS are required.
      // If this fails, keep the previous worker instead of activating a
      // half-filled offline cache.
      await precachePage(cache, "/");

      // These routes improve offline coverage but must not block an update.
      for (const page of OFFLINE_PAGES.slice(1)) {
        try {
          await precachePage(cache, page);
        } catch (error) {
          console.warn(
            "Could not precache optional FireGuard page:",
            page,
            error,
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
  } catch {
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
  const runtime = await caches.open(RUNTIME_CACHE);
  const staticCache = await caches.open(STATIC_CACHE);
  const response = await fetch(request, {
    cache: "no-store",
  });

  if (!response.ok) {
    return response;
  }

  const oldEtag = cached?.headers.get("etag") || "";
  const newEtag = response.headers.get("etag") || "";

  // Cache the new build's hashed CSS/JS before exposing its HTML.
  await cachePageAndShell(
    staticCache,
    "/",
    response,
    request.url,
  );
  await runtime.put("/", response.clone());

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
  } catch {
    return (
      (await caches.match("/")) ||
      Response.error()
    );
  }
}

async function networkFirstPage(request) {
  const runtime = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);

    if (response.ok) {
      await runtime.put(
        new URL(request.url).pathname,
        response.clone(),
      );
    }

    return response;
  } catch {
    const pathname = new URL(request.url).pathname;

    return (
      (await runtime.match(pathname)) ||
      (await caches.match(pathname)) ||
      (await caches.match("/")) ||
      Response.error()
    );
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);

  if (cached) {
    return cached;
  }

  const cache = await caches.open(RUNTIME_CACHE);
  const response = await fetch(request);

  if (response.ok) {
    await cache.put(request, response.clone());
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

  // Let the browser handle video and Range requests directly. Caching the
  // full 4.7 MB MP4 here would delay startup and break partial media fetches.
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

  if (request.mode === "navigate") {
    event.respondWith(
      networkFirstPage(request),
    );
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname === "/_next/image" ||
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font" ||
    request.destination === "image" ||
    CORE_ASSETS.includes(url.pathname)
  ) {
    event.respondWith(cacheFirst(request));
  }
});
