"use client";

import { useEffect, useState } from "react";

export default function BackgroundVideo() {
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    let timerId: number | undefined;

    const startVideo = () => {
      timerId = window.setTimeout(() => {
        setCanLoad(true);
      }, 150);
    };

    if (document.readyState === "complete") {
      startVideo();
    } else {
      window.addEventListener("load", startVideo, {
        once: true,
      });
    }

    return () => {
      window.removeEventListener("load", startVideo);

      if (timerId !== undefined) {
        window.clearTimeout(timerId);
      }
    };
  }, []);

  return (
    <video
      className="site-background-video"
      autoPlay
      muted
      loop
      playsInline
      preload={canLoad ? "metadata" : "none"}
      aria-hidden="true"
    >
      {canLoad ? (
        <source
          src="/14471459_3840_2160_30fps.mp4"
          type="video/mp4"
        />
      ) : null}
    </video>
  );
}
