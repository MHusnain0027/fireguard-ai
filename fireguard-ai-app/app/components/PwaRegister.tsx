"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    async function registerServiceWorker() {
      try {
        const registration =
          await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          });

        await registration.update();

        console.log(
          "FireGuard Service Worker registered:",
          registration.scope,
        );
      } catch (error) {
        console.error(
          "FireGuard Service Worker registration failed:",
          error,
        );
      }
    }

    void registerServiceWorker();
  }, []);

  return null;
}
