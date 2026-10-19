"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FullImg } from "@/components/CdnImage";
import { newsItems, type NewsItem } from "@/lib/data/news";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";
import { ArrowRight } from "../icons";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function NewsSection({ locale, dict }: Props) {
  const [items, setItems] = useState<NewsItem[]>(newsItems);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.news) && d.news.length) setItems(d.news);
      })
      .catch(() => undefined);
  }, []);

  return (
    <section className="container-abb py-10 md:py-14">
      <div className="mx-auto" style={{ maxWidth: 1160 }}>
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-[24px] font-semibold text-abb-ink md:text-[32px]">
            {dict.home.latestNews}
          </h2>
          <Link
            href={`/${locale}/xeberler`}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-[#1b63ed] transition hover:gap-2 hover:underline"
          >
            {dict.home.allNews}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="stagger-in grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((item) => (
            <Link
              key={item.id}
              href={`/${locale}${item.href}`}
              className="card-live group min-w-0"
            >
              <div className="overflow-hidden rounded-[20px] bg-abb-surface shadow-[0_8px_24px_rgba(10,11,13,0.06)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                <FullImg
                  src={item.image}
                  alt={item.title[locale]}
                  className="card-live-media aspect-[306/181] h-auto w-full object-cover"
                />
              </div>
              <h3 className="mt-3 line-clamp-2 text-[16px] font-medium leading-snug text-abb-ink transition-colors group-hover:text-abb-blue md:text-[18px]">
                {item.title[locale]}
              </h3>
              <p className="mt-1.5 text-[13px] text-abb-muted">{item.date}</p>
            </Link>
          ))}
        </div>

        <div className="stagger-in mt-6 grid gap-3 sm:grid-cols-2">
          {items.slice(3, 5).map((item) => (
            <Link
              key={item.id}
              href={`/${locale}${item.href}`}
              className="card-live flex min-h-[72px] items-center justify-between gap-4 rounded-[16px] border border-abb-border bg-abb-white px-4 py-3"
            >
              <span className="relative z-[1] min-w-0 text-[14px] font-medium leading-snug text-abb-ink">
                {item.title[locale]}
              </span>
              <span className="relative z-[1] shrink-0 text-[12px] text-abb-muted">
                {item.date}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
