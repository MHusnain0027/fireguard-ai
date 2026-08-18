"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const menuItems = [
  { name: "🏠 Home", link: "/" },
  { name: "📋 Patrol Reports", link: "/patrol" },
  { name: "🚨 Incident Report", link: "/fire-alarm-report" },
  { name: "📊 History", link: "/incidents" },
  { name: "🔐 Admin", link: "/admin" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      const target = event.target as Node;

      if (
        menuRef.current?.contains(target) ||
        toggleRef.current?.contains(target)
      ) {
        return;
      }

      setMenuOpen(false);
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    document.body.classList.add("site-menu-open");

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
      document.body.classList.remove("site-menu-open");
    };
  }, [menuOpen]);

  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <div className="site-nav__inner">
        <Link href="/" className="site-brand">
          FireGuard
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="primary-menu"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span className="menu-toggle__lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <button
        type="button"
        className={`site-menu-backdrop ${menuOpen ? "is-open" : ""}`}
        aria-label="Close navigation menu"
        tabIndex={menuOpen ? 0 : -1}
        onClick={() => setMenuOpen(false)}
      />

      <div
        ref={menuRef}
        id="primary-menu"
        className={`site-menu ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        {menuItems.map((item) => (
          <Link
            key={item.link}
            href={item.link}
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
