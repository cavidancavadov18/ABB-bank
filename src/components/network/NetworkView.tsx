"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  haversineKm,
  networkBranches,
  networkFilters,
  networkTabs,
  type NetworkBranch,
  type NetworkFilter,
  type NetworkTabId,
} from "@/lib/data/network";
import type { Locale } from "@/lib/i18n/types";
import { Logo } from "@/components/icons";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  BranchBankIcon,
  ChevronIcon,
  NetworkTabIcon,
} from "./NetworkIcons";

const NetworkMap = dynamic(
  () => import("./NetworkMap").then((m) => m.NetworkMap),
  { ssr: false }
);

type Props = { locale: Locale };

export function NetworkView({ locale }: Props) {
  const az = locale === "az";
  const [tab, setTab] = useState<NetworkTabId>("filiallar");
  const [filter, setFilter] = useState<NetworkFilter>("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<NetworkBranch | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    document.documentElement.classList.add("network-map-page");
    document.body.classList.add("network-map-page");
    return () => {
      document.documentElement.classList.remove("network-map-page");
      document.body.classList.remove("network-map-page");
    };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => undefined,
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = networkBranches.filter((b) => {
      if (filter === "open_on_weekends" && !b.weekend) return false;
      // safe_box / ADM — real CMS flags empty; keep chips for UI parity
      if (filter === "safe_box" || filter === "ADM") return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q)
      );
    });

    if (userPos) {
      list = [...list].sort(
        (a, b) =>
          haversineKm(userPos.lat, userPos.lng, a.lat, a.lng) -
          haversineKm(userPos.lat, userPos.lng, b.lat, b.lng)
      );
    }
    return list;
  }, [filter, query, userPos]);

  const showMapList = tab === "filiallar";

  return (
    <div className="fixed inset-0 z-[9999] flex bg-abb-white text-abb-ink">
      {/* Left panel — real: w-[523px] h-screen */}
      <aside className="relative z-10 flex h-full w-full shrink-0 flex-col gap-6 overflow-hidden bg-abb-white p-8 lg:w-[523px]">
        <div className="flex shrink-0 items-center justify-between gap-3">
          <Link href={`/${locale}`} className="inline-flex w-fit" aria-label="ABB">
            <Logo />
          </Link>
          <ThemeToggle
            labelLight={az ? "Gündüz rejimi" : "Light mode"}
            labelDark={az ? "Gecə rejimi" : "Dark mode"}
          />
        </div>

        <div className="flex shrink-0 flex-wrap gap-x-2 gap-y-2.5 overflow-auto">
          {networkTabs.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border-[1.6px] px-[14px] py-2.5 text-[16px] transition ${
                  active
                    ? "border-abb-ink bg-abb-white text-abb-ink"
                    : "border-transparent bg-abb-surface text-abb-ink"
                }`}
              >
                <NetworkTabIcon id={t.id} />
                {az ? t.az : t.en}
              </button>
            );
          })}
        </div>

        {showMapList ? (
          <>
            <div className="shrink-0 space-y-3">
              <p className="text-[14px] font-medium text-abb-muted">
                {az ? "Filterler" : "Filters"}
              </p>
              <div className="flex flex-wrap gap-2">
                {networkFilters.map((f) => {
                  const active = filter === f.id;
                  return (
                    <label
                      key={f.id || "all"}
                      className={`cursor-pointer rounded-full border-[1.6px] px-2.5 py-2 text-[12px] transition ${
                        active
                          ? "border-abb-ink bg-abb-white text-abb-ink"
                          : "border-transparent bg-abb-surface text-abb-ink hover:bg-[color-mix(in_srgb,var(--abb-ink)_8%,transparent)]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="network-filter"
                        value={f.id}
                        className="sr-only"
                        checked={active}
                        onChange={() => setFilter(f.id)}
                      />
                      {az ? f.az : f.en}
                    </label>
                  );
                })}
              </div>

              <label className="relative mt-1 block">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-abb-muted">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M16.5 16.5L21 21"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={az ? "Ad üzrə axtarış" : "Search by name"}
                  className="h-12 w-full rounded-full border border-abb-border bg-abb-white pl-10 pr-4 text-[15px] text-abb-ink outline-none placeholder:text-abb-muted focus:border-abb-blue"
                />
              </label>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {filtered.length === 0 ? (
                <p className="py-6 text-[14px] text-abb-muted">
                  {az ? "Nəticə tapılmadı." : "No results found."}
                </p>
              ) : (
                <ul>
                  {filtered.map((b) => {
                    const active = selected?.id === b.id;
                    const dist =
                      userPos != null
                        ? haversineKm(userPos.lat, userPos.lng, b.lat, b.lng)
                        : null;
                    return (
                      <li key={b.id}>
                        <button
                          type="button"
                          onClick={() => setSelected(b)}
                          className={`flex w-full items-start gap-3 border-b border-abb-border py-4 text-left transition hover:bg-abb-surface ${
                            active ? "bg-abb-blue-light" : ""
                          }`}
                        >
                          <span className="pt-1">
                            <BranchBankIcon />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[18px] leading-snug text-abb-ink">
                              {b.title}
                            </span>
                            <span className="mt-1 block text-[14px] leading-snug text-abb-muted">
                              {b.address}
                            </span>
                            {active && (
                              <span className="mt-2 block space-y-1 text-[12px] text-abb-muted">
                                {b.work_time.map((t) => (
                                  <span key={t} className="block">
                                    {t}
                                  </span>
                                ))}
                                {b.phones[0] && (
                                  <a
                                    href={`tel:${b.phones[0].replace(/\s/g, "")}`}
                                    className="mt-1 inline-block text-abb-blue"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {b.phones.join(" · ")}
                                  </a>
                                )}
                              </span>
                            )}
                          </span>
                          <span className="flex shrink-0 flex-col items-end gap-2 pt-1">
                            {dist != null && (
                              <span className="text-[12px] text-[#18a81d]">
                                {dist.toFixed(1)} km
                              </span>
                            )}
                            <ChevronIcon />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col justify-center">
            <h2 className="text-[22px] font-medium text-black">
              {az
                ? networkTabs.find((t) => t.id === tab)?.az
                : networkTabs.find((t) => t.id === tab)?.en}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#7a7d82]">
              {az
                ? "Bu kateqoriya üçün tam xəritə rəsmi ABB səhifəsindədir. Filiallar tabında işlək siyahı və xəritə var."
                : "Full map for this category is on the official ABB site. Use the Branches tab for the live list and map."}
            </p>
            <a
              href={`https://abb-bank.az/${networkTabs.find((t) => t.id === tab)?.href}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-11 w-fit items-center rounded-full bg-[#1b63ed] px-5 text-[14px] font-medium text-white"
            >
              {az ? "Rəsmi səhifəyə keç" : "Open official page"}
            </a>
            <button
              type="button"
              onClick={() => setTab("filiallar")}
              className="mt-3 text-left text-[14px] text-[#1b63ed]"
            >
              {az ? "← Filiallara qayıt" : "← Back to branches"}
            </button>
          </div>
        )}
      </aside>

      {/* Map */}
      <div className="relative hidden min-w-0 flex-1 lg:block">
        {showMapList ? (
          <NetworkMap
            branches={filtered.length ? filtered : networkBranches}
            selected={selected}
            userPos={userPos}
            onSelect={setSelected}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#eef1f5] text-[15px] text-[#7a7d82]">
            {az ? "Xəritə üçün Filiallar tabını seçin" : "Select Branches to view the map"}
          </div>
        )}
      </div>
    </div>
  );
}
