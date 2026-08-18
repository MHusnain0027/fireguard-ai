"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let intervalId: number | undefined;
    let reloading = false;

    const hadControllerOnLoad =
      Boolean(navigator.serviceWorker.controller);

    const reloadOnce = () => {
      if (reloading) return;

      reloading = true;

      window.setTimeout(() => {
        window.location.reload();
      }, 80);
    };

    const handleControllerChange = () => {
      if (!hadControllerOnLoad) return;
      reloadOnce();
    };

    const handleMessage = (
      event: MessageEvent,
    ) => {
      if (
        event.data?.type ===
        "FIREGUARD_CONTENT_UPDATED"
      ) {
        reloadOnce();
      }
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange,
    );

    navigator.serviceWorker.addEventListener(
      "message",
      handleMessage,
    );

    async function registerServiceWorker() {
      try {
        const registration =
          await navigator.serviceWorker.register(
            "/sw.js",
            {
              scope: "/",
              updateViaCache: "none",
            },
          );

        const checkForUpdate = () => {
          void registration.update().catch(
            (error) => {
              console.warn(
                "FireGuard update check failed:",
                error,
              );
            },
          );
        };

        checkForUpdate();

        intervalId = window.setInterval(
          checkForUpdate,
          5 * 60 * 1000,
        );

        const handleVisibilityChange = () => {
          if (
            document.visibilityState ===
            "visible"
          ) {
            checkForUpdate();
          }
        };

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

    let removeUpdateListeners:
      | (() => void)
      | undefined;

    void registerServiceWorker().then(
      (cleanup) => {
        removeUpdateListeners = cleanup;
      },
    );

    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }

      removeUpdateListeners?.();

      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );

      navigator.serviceWorker.removeEventListener(
        "message",
        handleMessage,
      );
    };
  }, []);

  return null;
}
