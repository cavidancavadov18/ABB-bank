"use client";

import { CdnImage } from "@/components/CdnImage";
import Link from "next/link";
import { useState } from "react";
import { campaigns } from "@/lib/data/content";
import { media } from "@/lib/data/media";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";
import { ChevronLeft, ChevronRight } from "../icons";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function Campaigns({ locale, dict }: Props) {
  const [index, setIndex] = useState(0);
  const max = Math.max(0, campaigns.length - 1);

  return (
    <section className="container-abb py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="section-title">{dict.home.campaigns}</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous slide"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-abb-border bg-abb-white text-abb-ink disabled:opacity-40"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            disabled={index >= max}
            onClick={() => setIndex((i) => Math.min(max, i + 1))}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-abb-border bg-abb-white text-abb-ink disabled:opacity-40"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <p className="mb-4 text-[15px] font-medium text-abb-muted">{dict.home.campaigns}</p>

      <div className="overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translate3d(-${index * 52}%, 0, 0)` }}
        >
          {campaigns.map((item, i) => (
            <Link
              key={item.id}
              href={`/${locale}/xeberler`}
              className="card-soft card-live min-w-[90%] overflow-hidden sm:min-w-[48%]"
            >
              <div className="relative h-48 overflow-hidden bg-abb-surface">
                <CdnImage
                  src={media.campaigns[i] || media.campaigns[0]}
                  alt={item.title[locale]}
                  fill
                  className="card-live-media object-cover"
                  sizes="(max-width: 768px) 90vw, 48vw"
                />
              </div>
              <div className="p-5">
                <h3 className="text-[18px] font-semibold leading-snug text-abb-ink">
                  {item.title[locale]}
                </h3>
                <p className="mt-2 text-[14px] text-abb-muted">{item.desc[locale]}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
