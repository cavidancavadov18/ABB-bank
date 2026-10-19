"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { searchSite } from "@/lib/data/searchIndex";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";
import { CloseIcon, SearchIcon } from "./icons";

type Props = {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  dict: Dictionary;
};

export function SearchModal({ open, onClose, locale, dict }: Props) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);

  const results = useMemo(
    () => searchSite(locale, deferred, deferred.trim() ? 28 : 16),
    [locale, deferred]
  );

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/40 p-4 pt-[12vh]">
      <div className="card-soft w-full max-w-xl overflow-hidden animate-fade-up">
        <div className="flex items-center gap-3 border-b border-abb-border px-4 py-3">
          <SearchIcon className="h-5 w-5 text-abb-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.search.placeholder}
            className="w-full bg-transparent text-[16px] outline-none placeholder:text-abb-muted"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={dict.search.close}
            className="rounded-lg p-1 text-abb-muted hover:bg-abb-surface"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[55vh] overflow-auto p-2">
          {!query.trim() && (
            <p className="px-3 pb-2 pt-1 text-[12px] font-medium uppercase tracking-wide text-abb-muted">
              {locale === "az" ? "Tövsiyə olunan" : "Suggested"}
            </p>
          )}
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-abb-muted">
              {dict.search.noResults}
            </p>
          ) : (
            results.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={onClose}
                className="flex items-start justify-between gap-3 rounded-xl px-3 py-3 text-[15px] hover:bg-abb-surface"
              >
                <span className="min-w-0 leading-snug text-abb-ink">
                  {item.label}
                </span>
                <span className="shrink-0 pt-0.5 text-[11px] text-abb-muted">
                  {item.group}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
