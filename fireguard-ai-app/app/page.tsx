"use client";

import { useEffect, useMemo, useState } from "react";

type SearchMode = "all" | "exact" | "partial";

type LocationRecord = {
  [key: string]: unknown;
  id?: string | number;
  Code?: string;
  Door_Name?: string;
  Zone?: string;
  District_Code?: string;
  District_Name?: string;
};

const searchModes: Array<{ value: SearchMode; label: string }> = [
  { value: "all", label: "All" },
  { value: "exact", label: "Exact Code" },
  { value: "partial", label: "Partial" },
];

function normalizeCode(value: string) {
  return value.toLowerCase().trim().replace(/-0+(\d+)$/, "-$1");
}

function readField(item: LocationRecord, keys: string[]) {
  for (const key of keys) {
    const value = item[key];

    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }

  return "";
}

function getCode(item: LocationRecord) {
  return readField(item, [
    "Code",
    "code",
    "FACP_Code",
    "facp_code",
    "FACP Code",
    "Room_Number",
    "room_number",
    "Room Number",
  ]);
}

function getDoorName(item: LocationRecord) {
  return readField(item, [
    "Door_Name",
    "door_name",
    "doorName",
    "Door Name",
    "Location",
    "location",
    "Room_Name",
    "room_name",
  ]);
}

function getZone(item: LocationRecord) {
  return readField(item, ["Zone", "zone"]);
}

function getDistrictName(item: LocationRecord) {
  return readField(item, [
    "District_Name",
    "district_name",
    "District Name",
  ]);
}

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      className="whatsapp-icon"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.93 7.93 0 0 0 3.79.965h.003c4.366 0 7.926-3.558 7.93-7.93a7.9 7.9 0 0 0-2.326-5.607M7.994 14.521a6.57 6.57 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.25a6.57 6.57 0 0 1-1.007-3.505c.003-3.626 2.957-6.578 6.584-6.578a6.54 6.54 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.662c-.003 3.627-2.957 6.58-6.585 6.583m3.61-4.93c-.197-.099-1.17-.578-1.353-.644-.182-.066-.315-.099-.445.099-.132.197-.513.644-.628.775-.116.132-.231.148-.429.05-.197-.1-.834-.308-1.588-.981-.587-.523-.984-1.17-1.1-1.368-.115-.198-.012-.305.087-.403.089-.088.197-.23.296-.345.1-.116.132-.198.198-.33.066-.132.033-.247-.017-.345-.05-.1-.445-1.073-.61-1.47-.16-.386-.323-.333-.445-.34l-.38-.007a.73.73 0 0 0-.528.247c-.182.198-.692.677-.692 1.651s.709 1.915.808 2.047c.099.132 1.394 2.128 3.377 2.984.471.203.839.324 1.125.415.473.15.904.129 1.244.078.38-.057 1.171-.479 1.337-.941.165-.462.165-.858.116-.941-.05-.083-.182-.132-.38-.23" />
    </svg>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<SearchMode>("all");
  const [time, setTime] = useState("");
  const [databaseError, setDatabaseError] = useState("");
  const [databaseLocations, setDatabaseLocations] =
    useState<LocationRecord[]>([]);

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleString());

    updateTime();
    const timer = window.setInterval(updateTime, 1000);

    async function loadLocations() {
      try {
        const response = await fetch("/api/locations", {
          cache: "no-store",
        });

        const payload = (await response.json()) as {
          success?: boolean;
          message?: string;
          locations?: LocationRecord[];
        };

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Database connection failed");
        }

        setDatabaseLocations(payload.locations ?? []);
        setDatabaseError("");
      } catch (error) {
        setDatabaseLocations([]);
        setDatabaseError(
          error instanceof Error
            ? error.message
            : "Database connection failed",
        );
      }
    }

    void loadLocations();

    return () => window.clearInterval(timer);
  }, []);

  const results = useMemo(() => {
    const value = normalizeCode(search);

    if (!value) return [];

    return databaseLocations.filter((item) => {
      const code = normalizeCode(getCode(item));

      const searchableValues = Object.values(item)
        .filter(
          (field): field is string | number =>
            typeof field === "string" || typeof field === "number",
        )
        .map((field) => normalizeCode(String(field)));

      if (mode === "exact") return code === value;

      if (mode === "partial") {
        return searchableValues.some(
          (field) => field.includes(value) || field.endsWith(`-${value}`),
        );
      }

      return searchableValues.some((field) => field.includes(value));
    });
  }, [databaseLocations, mode, search]);

  return (
    <main className="dashboard-home">
      {/* NEW HERO BACKGROUND VIDEO */}
      <video
        className="dashboard-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onLoadedMetadata={(e) => {
            e.currentTarget.currentTime = 2;
  }}

   onEnded={(e) => {
    e.currentTarget.currentTime = 2;
    e.currentTarget.play();
  }}
      >
        <source src="/14471459_3840_2160_30fps.mp4" type="video/mp4" />
      </video>

      <div className="dashboard-video-overlay" aria-hidden="true" />

      <div className="dashboard-content original-dashboard-content">
        <header className="brand-header">
          <h1>FireGuard</h1>
          <p>AI Powered Fire Safety Monitoring Dashboard</p>
          <time suppressHydrationWarning>{time}</time>
        </header>

        <section
          className="search-panel original-search-panel"
          aria-label="FACP location search"
        >
          <form
            className="original-search-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="sr-only" htmlFor="facp-search">
              Search building code, room, or zone
            </label>

            <input
              id="facp-search"
              type="search"
              placeholder="Search code / room / zone..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              autoComplete="off"
            />
          </form>

          {search.trim() && results.length > 0 ? (
            <p className="results-found">
              {results.length} Location(s) Found
            </p>
          ) : null}

          <div className="filter-row" aria-label="Search matching mode">
            {searchModes.map((searchMode) => (
              <button
                key={searchMode.value}
                type="button"
                aria-pressed={mode === searchMode.value}
                className={mode === searchMode.value ? "is-active" : ""}
                onClick={() => setMode(searchMode.value)}
              >
                {searchMode.label}
              </button>
            ))}
          </div>

          <div className="compact-stats" aria-label="Database statistics">
            <div>
              <strong>{databaseLocations.length}</strong>
              <span>FACP Locations</span>
            </div>

            <div>
              <strong>{databaseLocations.length}</strong>
              <span>Uploaded Data</span>
            </div>
          </div>

          <div
            className={`results-panel ${search.trim() ? "has-query" : ""}`}
            aria-live="polite"
          >
            {databaseError ? (
              <p className="database-error">Database connection failed.</p>
            ) : !search.trim() ? (
              <p>Type something to search...</p>
            ) : results.length === 0 ? (
              <p>No matching FACP location found.</p>
            ) : (
              <div className="results-list">
                {results.map((item, index) => (
                  <article
                    key={item.id ?? `${item.Code ?? "location"}-${index}`}
                    className="result-card"
                  >
                    <div>
                      <strong>{getCode(item) || "NO CODE"}</strong>
                      <span>
                        {getDoorName(item) || "Unknown Location"}
                      </span>
                    </div>

                    <div>
                      <span>
                        {getDistrictName(item) || "Building Location"}
                      </span>
                      <span>{getZone(item) || "No Zone"}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* REPORT CARDS REMOVED FROM HERE */}

        <div className="admin-row">
          <a href="/admin" className="admin-link">
            🔐 Admin Panel
          </a>
        </div>

        <footer className="original-dashboard-footer">
          <span>FireGuard Security Management Platform</span>
        </footer>
      </div>

      <a
        className="developer-float"
        href="https://wa.me/971505677023"
        target="_blank"
        rel="noreferrer"
        aria-label="Contact Muhammad Husnain on WhatsApp"
      >
        <span className="developer-float__icon" aria-hidden="true">
          <WhatsAppIcon />
        </span>

        <span className="developer-float__label">
          Developed by Muhammad Husnain
        </span>
      </a>
    </main>
  );
}
