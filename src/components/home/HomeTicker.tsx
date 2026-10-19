"use client";

import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function HomeTicker({ locale, dict }: Props) {
  const items =
    locale === "az"
      ? [
          "937 — 24/7 dəstək",
          dict.home.cashLoanTitle,
          dict.home.digiCardTitle,
          dict.home.mobileTitle,
          "ABB Prime",
          dict.home.mortgage,
          "Keşbek kampaniyaları",
          "Filiallar və ATM",
        ]
      : [
          "937 — 24/7 support",
          dict.home.cashLoanTitle,
          dict.home.digiCardTitle,
          dict.home.mobileTitle,
          "ABB Prime",
          dict.home.mortgage,
          "Cashback campaigns",
          "Branches & ATMs",
        ];

  const loop = [...items, ...items];

  return (
    <div className="container-abb pb-2 pt-1">
      <div className="home-ticker rounded-full border border-abb-border py-2.5 shadow-[0_4px_20px_rgba(27,99,237,0.06)] backdrop-blur dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
        <div className="home-ticker-track px-4 text-[13px] font-medium text-abb-blue">
          {loop.map((label, i) => (
            <span key={`${label}-${i}`} className="inline-flex items-center gap-2.5 whitespace-nowrap">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-abb-blue" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
