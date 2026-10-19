"use client";

import { useEffect, useState } from "react";

type Props = {
  labelLight: string;
  labelDark: string;
};

function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("abb-theme", theme);
  } catch {
    /* ignore */
  }
}

export function ThemeToggle({ labelLight, labelDark }: Props) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const dark = document.documentElement.classList.contains("dark");
    setTheme(dark ? "dark" : "light");
    setReady(true);
    document.documentElement.classList.add("theme-ready");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.classList.add("theme-ready");
    applyTheme(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? labelDark : labelLight}
      title={theme === "light" ? labelDark : labelLight}
      className="theme-toggle inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--abb-header-util)] transition-colors hover:bg-abb-surface hover:text-abb-ink"
    >
      {!ready ? (
        <span className="h-5 w-5" />
      ) : theme === "light" ? (
        <MoonIcon />
      ) : (
        <SunIcon />
      )}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 14.3A8.5 8.5 0 0 1 9.7 3a7 7 0 1 0 11.3 11.3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
