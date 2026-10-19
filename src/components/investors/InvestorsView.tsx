"use client";

import Link from "next/link";
import { useState } from "react";
import { BannerFrame } from "@/components/banners/BannerFrame";
import { FullImg } from "@/components/CdnImage";
import { investorsAz, investorsEn } from "@/lib/data/investors";
import type { Locale } from "@/lib/i18n/types";

type Props = { locale: Locale };

export function InvestorsView({ locale }: Props) {
  const data = locale === "az" ? investorsAz : investorsEn;
  const [year, setYear] = useState(data.defaultYear);
  const [ratingTab, setRatingTab] =
    useState<(typeof data.ratingTabs)[number]>("Fitch reytinqləri");
  const [docTab, setDocTab] =
    useState<(typeof data.docTabs)[number]>("Dayanıqlı İnkişaf Hesabatları");

  const ratios =
    data.ratiosByYear[year] || data.ratiosByYear[data.defaultYear] || [];
  const rating = data.ratings[ratingTab] || data.ratings["Fitch reytinqləri"];
  const docs = data.docs[docTab] || data.docs["Dayanıqlı İnkişaf Hesabatları"] || [];

  return (
    <div className="bg-background text-abb-ink">
      {/* Hero — real: 2×572 grid */}
      <section className="container-abb pb-8 pt-6 md:pb-10 md:pt-8">
        <div
          className="mx-auto grid items-center gap-8 lg:grid-cols-2 lg:gap-10"
          style={{ maxWidth: 1160 }}
        >
          <div className="min-w-0">
            <h1 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-abb-ink md:text-[40px] lg:text-[48px]">
              {data.title}
            </h1>
            <p className="mt-4 max-w-[34rem] text-[14px] leading-[1.5] text-abb-muted md:text-[16px]">
              {data.subtitle}
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div style={{ width: "min(100%, 572px)" }}>
              <FullImg
                src={data.heroImage}
                alt={data.title}
                eager
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blue metrics — medium inset frame */}
      <BannerFrame background="#1b63ed">
        <h2 className="max-w-[36rem] text-[20px] font-semibold leading-snug text-white md:text-[24px]">
          {data.metricsTitle}
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
          {data.metrics.map((m) => (
            <div
              key={m.label}
              className="min-w-0 rounded-[16px] bg-abb-white/10 px-3.5 py-3.5 backdrop-blur-[2px] md:px-4 md:py-4"
            >
              <p className="text-[20px] font-semibold leading-tight text-white md:text-[24px]">
                {m.value}
              </p>
              <p className="mt-1.5 text-[12px] leading-snug text-white/85 md:text-[13px]">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </BannerFrame>

      {/* Ratios + year tabs */}
      <section className="container-abb py-10 md:py-14">
        <div className="mx-auto" style={{ maxWidth: 1160 }}>
          <p className="text-[13px] font-medium text-abb-muted md:text-[14px]">
            {data.ratiosTitle}
          </p>
          <h2 className="mt-1 text-[24px] font-semibold text-abb-ink md:text-[32px]">
            {data.ratiosSubtitle}
          </h2>

          <div className="mt-5 flex flex-wrap gap-2">
            {data.years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
                  year === y
                    ? "bg-[#1b63ed] text-white"
                    : "bg-abb-surface text-abb-muted hover:bg-abb-border"
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ratios.map((r) => (
              <article
                key={r.label}
                className="min-w-0 overflow-hidden rounded-[20px] border border-abb-border bg-abb-white p-5"
              >
                <p className="text-[26px] font-semibold leading-tight text-abb-ink md:text-[30px]">
                  {r.value}
                </p>
                <p className="mt-2 text-[15px] font-medium text-abb-ink">{r.label}</p>
                <p className="mt-2 text-[12px] leading-[1.45] text-abb-muted">{r.note}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-[12px] text-[#8b8f96]">{data.ratiosFootnote}</p>
        </div>
      </section>

      {/* Ratings */}
      <section className="bg-abb-surface py-10 md:py-14">
        <div className="container-abb">
          <div className="mx-auto" style={{ maxWidth: 1160 }}>
            <h2 className="text-[24px] font-semibold text-abb-ink md:text-[32px]">
              {data.ratingsTitle}
            </h2>
            <p className="mt-2 max-w-[40rem] text-[14px] leading-[1.5] text-abb-muted">
              {data.ratingsDesc}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {data.ratingTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setRatingTab(tab)}
                  className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
                    ratingTab === tab
                      ? "bg-[#1b63ed] text-white"
                      : "bg-abb-white text-abb-muted ring-1 ring-abb-border hover:bg-abb-surface"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-[24px] border border-abb-border bg-abb-white">
              <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
                {rating.items.map((item) => (
                  <div
                    key={item.label}
                    className="border-b border-abb-border px-5 py-5 sm:border-r last:border-b-0 lg:[&:nth-child(3n)]:border-r-0"
                  >
                    <p className="text-[12px] leading-snug text-abb-muted">{item.label}</p>
                    <p className="mt-2 text-[22px] font-semibold text-abb-ink md:text-[26px]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-abb-border px-5 py-3 text-[12px] text-[#8b8f96]">
                <span>{rating.updated}</span>
                <span>{rating.issued}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="container-abb py-10 md:py-14">
        <div className="mx-auto" style={{ maxWidth: 1160 }}>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-[24px] font-semibold text-abb-ink md:text-[32px]">
              {data.pressTitle}
            </h2>
            <Link
              href={`/${locale}/xeberler`}
              className="text-[13px] font-medium text-[#1b63ed] hover:underline"
            >
              {data.pressAll} →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.press.map((item) => (
              <a
                key={item.href}
                href={`https://abb-bank.az${item.href}`}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[140px] flex-col justify-between rounded-[20px] border border-abb-border bg-abb-white p-5 transition hover:border-abb-blue/40"
              >
                <p className="text-[15px] font-medium leading-snug text-abb-ink">
                  {item.title}
                </p>
                <p className="mt-4 text-[13px] text-[#8b8f96]">{item.date}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="bg-abb-surface py-10 md:py-14">
        <div className="container-abb">
          <div className="mx-auto" style={{ maxWidth: 1160 }}>
            <h2 className="text-[24px] font-semibold text-abb-ink md:text-[32px]">
              {data.docsTitle}
            </h2>
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {data.docTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setDocTab(tab)}
                  className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition ${
                    docTab === tab
                      ? "bg-[#1b63ed] text-white"
                      : "bg-abb-white text-abb-muted ring-1 ring-abb-border"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              {docs.length > 0 ? (
                docs.map((doc) => (
                  <a
                    key={doc.title}
                    href={doc.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-4 rounded-[16px] border border-abb-border bg-abb-white px-5 py-4 transition hover:border-abb-blue/40"
                  >
                    <span className="min-w-0 text-[14px] font-medium text-abb-ink md:text-[15px]">
                      {doc.title}
                    </span>
                    <span className="shrink-0 text-[12px] text-[#8b8f96]">{doc.meta}</span>
                  </a>
                ))
              ) : (
                <p className="rounded-[16px] border border-dashed border-abb-border bg-abb-white px-5 py-8 text-center text-[14px] text-abb-muted">
                  {locale === "az"
                    ? "Bu kateqoriya üzrə sənədlər tezliklə əlavə olunacaq."
                    : "Documents for this category will be added soon."}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-abb py-10 md:pb-16 md:pt-14">
        <div className="mx-auto" style={{ maxWidth: 1000 }}>
          <h2 className="mb-5 text-[24px] font-semibold text-abb-ink md:text-[32px]">
            {data.faqTitle}
          </h2>
          <div className="divide-y divide-abb-border overflow-hidden rounded-[16px] border border-abb-border bg-abb-white">
            {data.faqs.map((faq) => (
              <details key={faq.q} className="group px-4 py-3.5 md:px-5">
                <summary className="cursor-pointer list-none text-[14px] font-medium leading-snug text-abb-ink marker:content-none">
                  <span className="flex items-start justify-between gap-3">
                    <span className="min-w-0">{faq.q}</span>
                    <span className="shrink-0 text-[#1b63ed] transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-2 text-[13px] leading-[1.5] text-abb-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
