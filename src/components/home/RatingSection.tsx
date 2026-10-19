"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = {
  dict: Dictionary;
};

export function RatingSection({ dict }: Props) {
  const [rating, setRating] = useState(0);
  const [sent, setSent] = useState(false);

  return (
    <section className="container-abb py-10 pb-16">
      <div className="card-soft flex flex-col items-start justify-between gap-6 p-6 md:flex-row md:items-center md:p-8">
        <div>
          <h2 className="text-[24px] font-semibold text-abb-ink">{dict.home.ratePage}</h2>
          <p className="mt-2 text-[15px] text-abb-muted">{dict.home.rateDesc}</p>
          {sent && (
            <p className="mt-2 text-[14px] text-emerald-600">
              {dict.form.success}
            </p>
          )}
        </div>
        <div className="flex gap-2" role="radiogroup" aria-label={dict.home.ratePage}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} stars`}
              onClick={() => {
                setRating(star);
                setSent(true);
              }}
              className={`text-[28px] transition ${
                star <= rating ? "text-amber-400" : "text-abb-border"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
