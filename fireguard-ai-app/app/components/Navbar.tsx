"use client";

import Link from "next/link";
import { useState } from "react";

const menuItems = [
  { name: "🏠 Home", link: "/" },
  { name: "📋 Patrol Reports", link: "/patrol" },
  { name: "🚨 Incident Report", link: "/fire-alarm-report" },
  { name: "📊 History", link: "/incidents" },
  { name: "🔐 Admin", link: "/admin" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <div className="site-nav__inner">
        <Link href="/" className="site-brand">
          FireGuard
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-menu"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span aria-hidden="true">☰</span>
        </button>
      </div>

      <div
        id="primary-menu"
        className={`site-menu ${menuOpen ? "is-open" : ""}`}
      >
        {menuItems.map((item) => (
          <Link
            key={item.link}
            href={item.link}
            onClick={() => setMenuOpen(false)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
