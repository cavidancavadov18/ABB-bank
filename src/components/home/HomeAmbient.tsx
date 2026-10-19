"use client";

/** Page-wide subtle moving background accents for the homepage */
export function HomeAmbient() {
  return (
    <div className="home-ambient pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <span className="home-blob home-blob-1" />
      <span className="home-blob home-blob-2" />
      <span className="home-blob home-blob-3" />
    </div>
  );
}
