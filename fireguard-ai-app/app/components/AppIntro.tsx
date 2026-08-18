"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type IntroPhase = "visible" | "leaving" | "hidden";

export default function AppIntro() {
  const [phase, setPhase] = useState<IntroPhase>("visible");

  useEffect(() => {
    document.body.classList.add("app-intro-active");

    const exitTimer = window.setTimeout(() => {
      setPhase("leaving");
    }, 1600);

    const removeTimer = window.setTimeout(() => {
      setPhase("hidden");
      document.body.classList.remove("app-intro-active");
    }, 2050);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      document.body.classList.remove("app-intro-active");
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={`app-intro ${phase === "leaving" ? "is-leaving" : ""}`}
      role="status"
      aria-label="Opening FireGuard FACP Assistant"
    >
      <div className="app-intro__ambient" aria-hidden="true" />

      <div className="app-intro__stage">
        <span className="app-intro__orbit app-intro__orbit--outer" />
        <span className="app-intro__orbit app-intro__orbit--inner" />

        <div className="app-intro__logo-shell">
          <Image
            className="app-intro__logo"
            src="/fireguard-icon-512.png"
            alt="FACP Assistant"
            width={512}
            height={512}
            sizes="(max-width: 512px) 84vw, 430px"
            priority
          />
          <span className="app-intro__shine" />
        </div>
</div>
    </div>
  );
}
