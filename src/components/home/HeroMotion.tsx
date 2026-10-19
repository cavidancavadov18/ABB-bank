"use client";

/** Continuous moving layers for the hero — orbs, particles, shimmer */
export function HeroMotion() {
  return (
    <div className="hero-motion pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Soft drifting light blobs */}
      <span className="hero-orb hero-orb-a" />
      <span className="hero-orb hero-orb-b" />
      <span className="hero-orb hero-orb-c" />

      {/* Floating dots */}
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="hero-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* Sweeping light */}
      <span className="hero-shimmer" />

      {/* Soft ring pulse */}
      <span className="hero-ring" />
    </div>
  );
}

const PARTICLES = [
  { id: 1, left: "8%", top: "18%", size: 6, delay: "0s", duration: "7s" },
  { id: 2, left: "22%", top: "72%", size: 4, delay: "1.2s", duration: "9s" },
  { id: 3, left: "38%", top: "28%", size: 5, delay: "0.6s", duration: "8s" },
  { id: 4, left: "55%", top: "14%", size: 3, delay: "2s", duration: "6.5s" },
  { id: 5, left: "68%", top: "58%", size: 7, delay: "0.3s", duration: "10s" },
  { id: 6, left: "78%", top: "22%", size: 4, delay: "1.8s", duration: "7.5s" },
  { id: 7, left: "88%", top: "70%", size: 5, delay: "0.9s", duration: "8.5s" },
  { id: 8, left: "14%", top: "48%", size: 3, delay: "2.4s", duration: "9.5s" },
  { id: 9, left: "46%", top: "80%", size: 4, delay: "1.5s", duration: "7s" },
  { id: 10, left: "92%", top: "40%", size: 6, delay: "0.4s", duration: "11s" },
];
