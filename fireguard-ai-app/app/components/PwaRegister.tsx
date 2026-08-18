"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let intervalId: number | undefined;
    let reloading = false;
    const hadControllerOnLoad = Boolean(navigator.serviceWorker.controller);

    const handleControllerChange = () => {
      if (!hadControllerOnLoad || reloading) return;

      reloading = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange,
    );

    async function registerServiceWorker() {
      try {
        const registration = await navigator.serviceWorker.register(
          "/sw.js",
          {
            scope: "/",
            updateViaCache: "none",
          },
        );

        const checkForUpdate = () => {
          void registration.update().catch((error) => {
            console.warn("FireGuard update check failed:", error);
          });
        };

        // Check immediately
        checkForUpdate();

        // Check every 5 minutes while app is open
        intervalId = window.setInterval(
          checkForUpdate,
          5 * 60 * 1000,
        );

        const handleVisibilityChange = () => {
          if (document.visibilityState === "visible") {
            checkForUpdate();
          }
        };

        // Check whenever user returns to app
        document.addEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );

        window.addEventListener(
          "focus",
          checkForUpdate,
        );

        return () => {
          document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange,
          );

          window.removeEventListener(
            "focus",
            checkForUpdate,
          );
        };
      } catch (error) {
        console.error(
          "FireGuard Service Worker registration failed:",
          error,
        );
      }

      return undefined;
    }

    let removeUpdateListeners: (() => void) | undefined;

    void registerServiceWorker().then((cleanup) => {
      removeUpdateListeners = cleanup;
    });

    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }

      removeUpdateListeners?.();

      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );
    };
  }, []);

  return null;
}
