"use client";

import { CdnImage } from "@/components/CdnImage";
import Link from "next/link";
import { useEffect, useState } from "react";
import { media } from "@/lib/data/media";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "../icons";
import { HeroMotion } from "./HeroMotion";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function HeroSection({ locale, dict }: Props) {
  const slides = media.hero;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const total = media.hero.length;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 6000);
    return () => window.clearInterval(id);
  }, [paused]);

  const slide = slides[index];

  const productCards = [
    {
      href: `/${locale}/ferdi/emanetler/digideposit`,
      title: dict.home.digiDepositTitle,
      desc: dict.home.digiDepositDesc,
      image: media.products.digiDeposit,
    },
    {
      href: `/${locale}/biznes`,
      title: dict.home.abbBizTitle,
      desc: dict.home.abbBizDesc,
      image: media.products.abbBiz,
    },
    {
      href: `/${locale}/ferdi/kreditler/nagd-kredit`,
      title: dict.home.cashLoanTitle,
      desc: dict.home.cashLoanDesc,
      image: media.products.cashLoan,
    },
    {
      href: `/${locale}/abb-mobile`,
      title: dict.home.mobileTitle,
      desc: dict.home.mobileDesc,
      image: media.products.abbMobile,
    },
  ];

  return (
    <section className="container-abb py-6 md:py-8">
      <div className="grid gap-4 lg:grid-cols-12">
        <div
          className="relative min-h-[380px] overflow-hidden rounded-[32px] shadow-lg lg:col-span-8 lg:min-h-[440px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {slides.map((s, i) => (
            <div
              key={s.id}
              className="hero-bg-live absolute inset-0 transition-opacity duration-700 ease-out"
              style={{
                background: s.gradient,
                opacity: i === index ? 1 : 0,
                pointerEvents: i === index ? "auto" : "none",
              }}
              aria-hidden={i !== index}
            />
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_40%)]" />
          <HeroMotion />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-10 lg:max-w-[55%]">
            <div key={slide.id} className="animate-fade-up">
              <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-[13px] font-medium text-white">
                {slide.badge[locale]}
              </span>
              <h1 className="mt-4 text-[28px] font-medium leading-tight text-white md:text-[36px]">
                {slide.title[locale]}
              </h1>
              <p className="mt-3 max-w-md text-[16px] text-white/90 md:text-[18px]">
                {slide.desc[locale]}
              </p>
              <Link href={`/${locale}/ferdi`} className="btn-white mt-6">
                {slide.cta[locale]}
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === index ? "w-7 bg-white" : "w-2 bg-white/45"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={() => setIndex((i) => (i + 1) % slides.length)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-0 right-0 top-0 hidden w-[48%] md:block">
            {slides.map((s, i) => (
              <div
                key={s.id}
                className="absolute inset-0 transition-opacity duration-500 ease-out"
                style={{ opacity: i === index ? 1 : 0 }}
              >
                <div className="hero-visual hero-breathe relative h-full w-full">
                  <CdnImage
                    src={s.image}
                    alt={s.title[locale]}
                    fill
                    className="object-contain object-bottom drop-shadow-2xl"
                    sizes="480px"
                    priority={i === 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stagger-in grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
          {productCards.slice(0, 2).map((card) => (
            <ProductCard key={card.title} {...card} />
          ))}
        </div>
      </div>

      <div className="stagger-in mt-4 grid gap-4 md:grid-cols-2">
        {productCards.slice(2).map((card) => (
          <ProductCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  href,
  title,
  desc,
  image,
}: {
  href: string;
  title: string;
  desc: string;
  image: string;
}) {
  return (
    <Link
      href={href}
      className="card-soft card-live group relative flex h-full min-h-[200px] flex-col justify-between overflow-hidden p-5"
    >
      <div className="relative z-10 flex items-start justify-between gap-3 pr-[38%]">
        <div>
          <h2 className="text-[20px] font-semibold text-abb-ink transition-colors group-hover:text-[#1b63ed]">
            {title}
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-abb-muted">{desc}</p>
        </div>
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-abb-surface text-abb-ink transition duration-300 group-hover:scale-110 group-hover:bg-abb-blue group-hover:text-white">
          <ArrowUpRight />
        </span>
      </div>
      <div className="absolute bottom-0 right-0 h-[75%] w-[45%]">
        <div className="card-live-float relative h-full w-full">
          <CdnImage
            src={image}
            alt={title}
            fill
            className="card-live-media object-contain object-bottom"
            sizes="220px"
          />
        </div>
      </div>
    </Link>
  );
}
