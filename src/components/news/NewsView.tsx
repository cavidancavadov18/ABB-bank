"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FullImg } from "@/components/CdnImage";
import { newsItems, type NewsItem } from "@/lib/data/news";
import type { Locale } from "@/lib/i18n/types";

type Props = { locale: Locale };

const PAGE_SIZE = 12;

export function NewsView({ locale }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<NewsItem[]>(newsItems);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.news) && d.news.length) setItems(d.news);
      })
      .catch(() => undefined);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const title = item.title[locale].toLowerCase();
      const excerpt = (item.excerpt?.[locale] || "").toLowerCase();
      return title.includes(q) || excerpt.includes(q) || item.date.includes(q);
    });
  }, [locale, query, items]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="bg-background text-abb-ink">
      <section className="container-abb pb-12 pt-8 md:pb-16 md:pt-10">
        <div className="mx-auto" style={{ maxWidth: 1000 }}>
          <h1 className="text-[36px] font-medium leading-tight tracking-[-0.02em] text-abb-ink md:text-[48px] lg:text-[56px]">
            {locale === "az" ? "Xəbərlər" : "News"}
          </h1>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-abb-muted">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                  <path
                    d="M16.5 16.5L21 21"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={locale === "az" ? "Xəbər axtarın" : "Search news"}
                className="w-full rounded-full border border-abb-border bg-abb-surface py-3 pl-11 pr-4 text-[14px] text-abb-ink outline-none transition placeholder:text-abb-muted focus:border-abb-blue focus:bg-abb-white"
              />
            </label>
            <div className="shrink-0 rounded-full border border-abb-border bg-abb-white px-4 py-3 text-[13px] text-abb-muted">
              {locale === "az" ? "Hamısı" : "All"}
            </div>
          </div>

          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((item) => (
              <Link
                key={item.id}
                href={`/${locale}${item.href}`}
                className="group min-w-0"
              >
                <div className="overflow-hidden rounded-[20px] bg-abb-surface">
                  <FullImg
                    src={item.image}
                    alt={item.title[locale]}
                    className="aspect-[306/181] h-auto w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <h2 className="mt-3 line-clamp-2 text-[16px] font-medium leading-snug text-abb-ink md:text-[18px]">
                  {item.title[locale]}
                </h2>
                <p className="mt-1.5 text-[13px] text-abb-muted">{item.date}</p>
              </Link>
            ))}
          </div>

          {pageItems.length === 0 && (
            <p className="mt-10 text-center text-[14px] text-abb-muted">
              {locale === "az" ? "Uyğun xəbər tapılmadı." : "No matching news found."}
            </p>
          )}

          {totalPages > 1 && (
            <nav
              aria-label="pagination"
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-[13px] font-medium transition ${
                    n === current
                      ? "bg-abb-blue text-white"
                      : "bg-abb-surface text-abb-muted hover:bg-[color-mix(in_srgb,var(--abb-ink)_8%,transparent)]"
                  }`}
                >
                  {n}
                </button>
              ))}
            </nav>
          )}

          <div className="mt-8 text-center">
            <Link
              href={`/${locale}`}
              className="text-[13px] font-medium text-[#1b63ed] hover:underline"
            >
              {locale === "az" ? "Əsas səhifəyə qayıt" : "Back to home"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
