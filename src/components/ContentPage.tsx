import Link from "next/link";
import {
  BannerFrame,
  BannerMedia,
  bannerImgStyle,
} from "@/components/banners/BannerFrame";
import { MobileAppDarkBanner } from "@/components/banners/MobileAppDarkBanner";
import { FullImg } from "@/components/CdnImage";
import { Reveal } from "@/components/Reveal";
import { getSectionPage } from "@/lib/data/sectionPages";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";

type Props = {
  locale: Locale;
  title: string;
  path: string;
  parentHref?: string;
  parentLabel?: string;
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const PLAN_COLORS = ["#12b76a", "#1b63ed", "#0ea5e9", "#22c55e"];

const NAV_TITLES =
  /^(Tariflər|Siyasətlərimiz|Hesabatlar|Satınalmalar|Araşdırma|Brend|Hüquqi|Təklif|Korporativ təqdimat|İdarəetmə və Komitələr|Fərdi|Biznes|Haqqımızda)$/i;

/** Section titles only — never use scraped SEO blobs as headings. */
function shortHeading(
  sections: string[],
  pattern: RegExp,
  fallback: string,
  maxLen = 72
) {
  const hit = sections.find(
    (s) => s.length <= maxLen && pattern.test(s.trim())
  );
  return hit?.trim() || fallback;
}

function splitParas(text: string) {
  // Support both real newlines and accidental literal "\n" from scrapes
  const normalized = text.replace(/\\n/g, "\n").trim();
  const byBreak = normalized
    .split(/\n+/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 20);
  if (byBreak.length > 1) return byBreak;
  const one = normalized.replace(/\s+/g, " ").trim();
  return one ? [one] : [];
}

/**
 * Product / section page layout matching abb-bank.az order:
 * hero → advantages → plans → steps → article prose → FAQ
 * (no invented “Şəkillər” dump, no fake image+text for SEO blocks)
 */
export function ContentPage({
  locale,
  title,
  path,
  parentHref,
  parentLabel,
}: Props) {
  const page = getSectionPage(
    path,
    title || titleFromSlug(path.split("/").filter(Boolean).pop() || "ABB")
  );
  const dict = getDictionary(locale);

  const hero = page.heroImage;
  const isPeoplePage = /rehberlik|idareetme/i.test(path);
  const isKartlarHub = /\/ferdi\/kartlar\/?$/i.test(path);
  const showMobileBanner = /^\/ferdi(\/|$)/i.test(path) && !isPeoplePage;
  const ctaHref = page.ctaHref
    ? page.ctaHref.startsWith("http")
      ? page.ctaHref
      : `/${locale}${page.ctaHref}`
    : `/${locale}/abb-mobile`;

  const cards = page.cards
    .slice(0, isPeoplePage ? 16 : 8)
    .map((c) => ({
      ...c,
      desc: (c.desc || "")
        .replace(/\{?"@type[\s\S]*$/i, "")
        .replace(/İndi məlumat al[\s\S]*$/i, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 280),
    }))
    .filter((c) => {
      if (!c.title || !c.image) return false;
      if (/^Əlavə məlumat/i.test(c.title) || NAV_TITLES.test(c.title)) return false;
      // Drop hub/self cards that reuse the hero image
      if (hero && c.image === hero) return false;
      const t = c.title.toLowerCase();
      const pt = page.title.toLowerCase();
      if (t === pt || (t.length > 8 && pt.includes(t))) return false;
      return true;
    });

  const plans = page.plans
    .filter(
      (pl) =>
        pl.title &&
        pl.desc &&
        pl.desc.length > 8 &&
        pl.desc.length < 160 &&
        !/menuAttached|uiRouterKey|@type|contactPoint/i.test(pl.desc)
    )
    .slice(0, 4);

  const faqs = page.faqs
    .map((f) => ({
      q: (f.q || "").replace(/\s*\?*$/, "") + "?",
      a: (f.a || "")
        .replace(/^\?+/, "")
        .replace(/\s+/g, " ")
        .trim(),
    }))
    .filter((f) => f.q.length > 12 && f.a.length > 40)
    .slice(0, 12);

  const faqKeys = new Set(
    faqs.map((f) => f.q.replace(/\?+$/, "").trim().toLowerCase())
  );

  // Real “3 addım” only — never FAQ questions scraped into steps
  const stepDetails = (
    page.stepDetails.length > 0
      ? page.stepDetails
      : page.steps.map((s) => ({ title: s, desc: "" }))
  )
    .filter((s) => {
      const t = (s.title || "").trim();
      if (!t || t.length < 6 || t.length > 72) return false;
      if (NAV_TITLES.test(t)) return false;
      if (/\?$/.test(t)) return false;
      if (faqKeys.has(t.replace(/\?+$/, "").toLowerCase())) return false;
      return true;
    })
    .slice(0, 4);

  const showStepsFrame = stepDetails.length >= 2;

  // SEO / article sections — prefer structured contentSections; never dump blobs as titles
  let articles = page.contentSections
    .filter(
      (s) =>
        s.title &&
        s.title.length <= 90 &&
        s.desc &&
        s.desc.length > 60 &&
        !/^Əlavə məlumat/i.test(s.title) &&
        !NAV_TITLES.test(s.title) &&
        !cards.some((c) => c.title === s.title) &&
        !faqs.some((f) => f.q.replace(/\?+$/, "") === s.title.replace(/\?+$/, ""))
    )
    .slice(0, 8);

  // Recover titled articles from long scraped `sections` blobs when contentSections is thin
  if (articles.length < 2) {
    const blob = page.sections.find((s) => s.length > 280);
    if (blob) {
      const titleHits = [
        ...blob.matchAll(
          /([A-ZƏÖÜĞIİŞÇ][^?]{8,70}\?|[A-ZƏÖÜĞIİŞÇ][^.]{12,70}(?:nədir|olunur|olar|edin|şərtləri|seçmək))/g
        ),
      ].map((m) => m[1].trim());
      const uniqueTitles = [...new Set(titleHits)].filter(
        (t) => t.length <= 90 && !/Tez-tez/i.test(t)
      );
      const recovered: { title: string; desc: string }[] = [];
      for (let i = 0; i < uniqueTitles.length; i++) {
        const titleText = uniqueTitles[i];
        const start = blob.indexOf(titleText) + titleText.length;
        const end =
          i + 1 < uniqueTitles.length
            ? blob.indexOf(uniqueTitles[i + 1], start)
            : blob.length;
        const desc = blob.slice(start, end).replace(/\s+/g, " ").trim();
        if (desc.length > 60) recovered.push({ title: titleText, desc });
      }
      if (recovered.length) articles = recovered.slice(0, 8);
    }
  }

  const crumbs = (page.breadcrumbs.length > 0
    ? page.breadcrumbs
    : [parentLabel || (locale === "az" ? "Fərdi" : "Personal"), page.title]
  ).filter((c) => c && c !== "•");

  const advantagesTitle = shortHeading(
    page.sections,
    /Sizə uyğun bank kartını seçin|üstünlük|kartını seç/i,
    locale === "az" ? "Üstünlüklər" : "Advantages"
  );

  const plansTitle = shortHeading(
    page.sections,
    /^Nə plan|\bplan\b/i,
    locale === "az" ? "Nə planınız var?" : "What are your plans?"
  );

  const stepsTitle = shortHeading(
    page.sections,
    /ABB mobile-dan|addım/i,
    locale === "az"
      ? "ABB mobile-dan 3 addıma nağd kredit alın"
      : "Get it in 3 steps via ABB mobile"
  );

  return (
    <div className="bg-background text-abb-ink">
      <div className="container-abb pt-5 md:pt-7">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-[12px] text-abb-muted"
        >
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <span key={`${crumb}-${i}`} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span className="text-abb-muted" aria-hidden>
                    •
                  </span>
                )}
                {!isLast && parentHref && i === 0 ? (
                  <Link href={parentHref} className="hover:text-abb-blue">
                    {crumb}
                  </Link>
                ) : (
                  <span className={isLast ? "text-abb-ink" : ""}>{crumb}</span>
                )}
              </span>
            );
          })}
        </nav>
      </div>

      {/* Hero — real site: text left, visual right */}
      <Reveal>
      <section
        className={`container-abb pt-4 md:pt-6 ${
          isKartlarHub ? "pb-6 md:pb-8" : "pb-8 md:pb-12"
        }`}
      >
        <div
          className={`grid gap-6 lg:gap-10 ${
            isKartlarHub
              ? "items-start lg:grid-cols-2"
              : "items-center lg:grid-cols-[1.05fr_0.95fr]"
          }`}
        >
          <div className={isKartlarHub ? "max-w-[36rem] lg:pt-10" : "max-w-[34rem]"}>
            <h1
              className={`font-medium leading-[1.15] tracking-[-0.02em] text-abb-ink ${
                isKartlarHub
                  ? "text-[28px] md:text-[40px] lg:text-[48px]"
                  : "text-[26px] md:text-[36px] lg:text-[40px]"
              }`}
            >
              {page.title}
            </h1>
            {page.description && (
              <p className="mt-3 text-[13px] leading-[1.5] text-abb-muted md:text-[14px]">
                {page.description}
              </p>
            )}
            {page.cta && !isPeoplePage && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href={ctaHref}
                  className="inline-flex items-center justify-center rounded-[12px] bg-abb-blue px-5 py-3.5 text-[14px] font-medium text-white transition hover:bg-abb-blue-dark"
                >
                  {page.cta}
                </Link>
                {page.ctaSecondary && (
                  <Link
                    href={ctaHref}
                    className="inline-flex items-center justify-center rounded-[12px] border border-abb-border bg-abb-white px-5 py-3.5 text-[14px] font-medium text-abb-ink transition hover:border-abb-blue hover:text-abb-blue"
                  >
                    {page.ctaSecondary}
                  </Link>
                )}
              </div>
            )}
          </div>
          {hero && (
            <div
              className={`relative flex w-full flex-col items-center ${
                isKartlarHub ? "lg:items-end" : "justify-center"
              }`}
            >
              <FullImg
                src={hero}
                alt={page.title}
                eager
                className={
                  isKartlarHub
                    ? "h-auto w-full max-w-[572px] object-contain object-center"
                    : "h-auto w-full max-h-[320px] object-contain object-center md:max-h-[420px] lg:max-h-[480px]"
                }
              />
              {isKartlarHub && page.stats.length > 0 && (
                <div className="relative z-10 mt-[-28px] w-full max-w-[572px] rounded-[24px] bg-abb-white px-6 py-5 shadow-[0_8px_28px_rgba(10,11,13,0.08)] md:mt-[-40px] md:px-10 md:py-6 dark:shadow-[0_8px_28px_rgba(0,0,0,0.35)]">
                  <div className="grid grid-cols-3 gap-3">
                    {page.stats.map((stat) => (
                      <div key={stat.label + stat.value} className="min-w-0">
                        <p className="text-[12px] leading-snug text-abb-muted md:text-[13px]">
                          {stat.label}
                        </p>
                        <p className="mt-1 text-[18px] font-semibold leading-tight text-abb-ink md:text-[22px]">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hero stats bar — product pages (not kartlar hub overlay) */}
        {!isKartlarHub && page.stats.length > 0 && (
          <div className="mt-6 rounded-[16px] border border-abb-border bg-abb-white px-4 py-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] md:mt-8 md:px-6 md:py-5 dark:shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
            <div
              className={`grid gap-4 ${
                page.stats.length >= 4
                  ? "sm:grid-cols-2 lg:grid-cols-4"
                  : page.stats.length === 3
                    ? "sm:grid-cols-3"
                    : "sm:grid-cols-2"
              }`}
            >
              {page.stats.map((stat) => (
                <div key={stat.label + stat.value} className="flex min-w-0 items-start gap-2.5">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-abb-blue-light text-abb-blue">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                      <path
                        d="M8 12.5l2.5 2.5L16 9"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold leading-tight text-abb-ink md:text-[15px]">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-snug text-abb-muted">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      </Reveal>

      {/* Advantages / people / kartlar category cards */}
      {cards.length > 0 && (
        <Reveal delay={40}>
        <section className="container-abb pb-10 md:pb-14">
          {!isPeoplePage && (
            <h2
              className={`mb-5 text-center font-semibold text-abb-ink md:mb-7 ${
                isKartlarHub
                  ? "text-[24px] md:text-[32px] lg:text-[40px]"
                  : "text-[20px] md:text-[24px]"
              }`}
            >
              {advantagesTitle}
            </h2>
          )}
          {isKartlarHub ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {cards.map((card, i) => {
                const href = card.href
                  ? card.href.startsWith("http")
                    ? card.href
                    : `/${locale}${card.href}`
                  : `/${locale}/ferdi/kartlar`;
                const wide = i < 2;
                return (
                  <Link
                    key={card.title + card.image}
                    href={href}
                    className={`group grid min-h-[260px] overflow-hidden rounded-[32px] bg-abb-surface transition hover:bg-[color-mix(in_srgb,var(--abb-ink)_8%,transparent)] lg:min-h-[292px] lg:grid-cols-2 ${
                      wide ? "lg:col-span-6" : "lg:col-span-4"
                    }`}
                  >
                    <div className="flex flex-col justify-between gap-6 p-6 lg:p-8 lg:pr-3">
                      <div>
                        <h3 className="text-[18px] font-medium leading-8 text-abb-ink md:text-[22px] lg:text-[24px]">
                          {card.title}
                        </h3>
                        {card.desc && (
                          <p className="mt-2 text-[13px] leading-[1.45] text-abb-muted md:text-[14px]">
                            {card.desc}
                          </p>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[13px] font-medium text-abb-blue">
                        {locale === "az" ? "Daha ətraflı öyrənin" : "Learn more"}
                        <span aria-hidden className="transition group-hover:translate-x-0.5">
                          →
                        </span>
                      </span>
                    </div>
                    <div className="flex items-end justify-end overflow-hidden">
                      <FullImg
                        src={card.image}
                        alt={card.title}
                        className={`object-contain object-bottom ${
                          wide
                            ? "max-h-[220px] w-[90%] md:max-h-[264px]"
                            : "max-h-[160px] w-[85%] md:max-h-[180px]"
                        }`}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div
              className={`grid gap-3 md:gap-4 ${
                cards.length >= 4
                  ? "sm:grid-cols-2 xl:grid-cols-4"
                  : cards.length === 3
                    ? "md:grid-cols-3"
                    : "sm:grid-cols-2"
              }`}
            >
              {cards.map((card) => {
                const href = card.href
                  ? card.href.startsWith("http")
                    ? card.href
                    : `/${locale}${card.href}`
                  : null;
                const body = (
                  <>
                    <div
                      className={`flex items-center justify-center bg-abb-surface p-3 md:p-4 ${
                        isPeoplePage ? "aspect-[4/5]" : "aspect-[16/11]"
                      }`}
                    >
                      <FullImg
                        src={card.image}
                        alt={card.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-3.5 md:p-4">
                      <h3 className="text-[14px] font-semibold leading-snug text-abb-ink md:text-[15px]">
                        {card.title}
                      </h3>
                      {card.desc && (
                        <p className="mt-1.5 text-[12px] leading-[1.45] text-abb-muted md:text-[13px]">
                          {card.desc}
                        </p>
                      )}
                      {href && (
                        <span className="mt-3 text-[12px] font-medium text-abb-blue">
                          {locale === "az" ? "Daha ətraflı öyrənin" : "Learn more"}
                        </span>
                      )}
                    </div>
                  </>
                );
                const cls =
                  "flex min-w-0 flex-col overflow-hidden rounded-[16px] border border-abb-border bg-abb-white transition hover:border-[var(--abb-divider)]";
                return href ? (
                  <Link key={card.title + card.image} href={href} className={cls}>
                    {body}
                  </Link>
                ) : (
                  <article key={card.title + card.image} className={cls}>
                    {body}
                  </article>
                );
              })}
            </div>
          )}
        </section>
        </Reveal>
      )}

      {/* Plans — after advantages (real order) */}
      {plans.length > 0 && (
        <Reveal delay={50}>
        <section className="container-abb pb-10 md:pb-14">
          <h2 className="mb-6 text-center text-[20px] font-semibold text-abb-ink md:text-[24px]">
            {plansTitle}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {plans.map((plan, i) => (
              <div key={plan.title} className="min-w-0 px-1 text-center">
                {"image" in plan && plan.image ? (
                  <div className="mx-auto flex h-12 w-12 items-center justify-center md:h-14 md:w-14">
                    <FullImg
                      src={String(plan.image)}
                      alt={plan.title}
                      className="h-10 w-10 object-contain md:h-12 md:w-12"
                    />
                  </div>
                ) : (
                  <div
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-[18px] font-semibold text-white md:h-14 md:w-14"
                    style={{ background: PLAN_COLORS[i % PLAN_COLORS.length] }}
                  >
                    {plan.title.charAt(0)}
                  </div>
                )}
                <h3 className="mt-3 text-[14px] font-semibold text-abb-ink md:text-[15px]">
                  {plan.title}
                </h3>
                <p className="mt-1.5 text-[12px] leading-[1.45] text-abb-muted md:text-[13px]">
                  {plan.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
        </Reveal>
      )}

      {/* Steps — medium inset dark frame (same shell as mobile/career banners) */}
      {showStepsFrame && (
        <Reveal delay={40}>
        <BannerFrame
          background="radial-gradient(45.81% 111.02% at 57.47% 14.48%, #383c46 0%, #24282f 100%)"
        >
          <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2 md:gap-6">
            <div className="min-w-0">
              <h2
                className="text-center font-semibold text-white md:text-left"
                style={{ fontSize: "clamp(22px, 2.8vw, 36px)", lineHeight: 1.2 }}
              >
                {stepsTitle}
              </h2>
              <div className="mt-4 space-y-2.5 md:mt-5">
                {stepDetails.map((step, i) => {
                  const active = i === 0;
                  return (
                    <div key={step.title + i} className="flex gap-2.5 md:gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-[13px] font-semibold ${
                          active
                            ? "bg-white text-[#484a4f]"
                            : "bg-white/10 text-white/70"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <div
                        className={`min-w-0 flex-1 rounded-[14px] px-3.5 py-2.5 md:px-4 md:py-3 ${
                          active ? "bg-white" : "bg-white/10"
                        }`}
                      >
                        <p
                          className={`text-[14px] font-semibold leading-snug md:text-[15px] ${
                            active ? "text-black" : "text-white"
                          }`}
                        >
                          {step.title}
                        </p>
                        {step.desc && (
                          <p
                            className={`mt-0.5 text-[12px] leading-[1.45] md:text-[13px] ${
                              active ? "text-[#6b7280]" : "text-white/70"
                            }`}
                          >
                            {step.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {page.stepsImage && (
              <BannerMedia>
                <FullImg
                  src={page.stepsImage}
                  alt={stepsTitle}
                  hq={false}
                  className="object-contain"
                  style={bannerImgStyle}
                />
              </BannerMedia>
            )}
          </div>
        </BannerFrame>
        </Reveal>
      )}

      {/* Article prose — framed column @ ~967px like real SEO blocks */}
      {articles.length > 0 && (
        <Reveal delay={40}>
        <section className="container-abb pb-10 md:pb-14">
          <div
            className="mx-auto overflow-hidden rounded-[24px] border border-abb-border bg-abb-white"
            style={{ maxWidth: 1000 }}
          >
            <div className="space-y-8 px-5 py-6 md:space-y-10 md:px-10 md:py-9">
              {articles.map((article) => {
                const paras =
                  article.desc.split(/\n+/).filter((p) => p.trim().length > 20)
                    .length > 1
                    ? article.desc.split(/\n+/).map((p) => p.trim()).filter(Boolean)
                    : splitParas(article.desc);
                return (
                  <article key={article.title} className="min-w-0">
                    <h2 className="text-[16px] font-semibold leading-snug text-abb-ink md:text-[18px]">
                      {article.title}
                    </h2>
                    <div className="mt-3 space-y-3 text-[14px] leading-6 text-abb-muted md:text-[16px] md:leading-6">
                      {paras.map((para, pi) => (
                        <p key={pi}>{para}</p>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        </Reveal>
      )}

      {/* FAQ — only real Q&A */}
      {faqs.length > 0 && (
        <Reveal delay={40}>
        <section className="container-abb pb-10 md:pb-12">
          <div className="mx-auto" style={{ maxWidth: 1000 }}>
            <h2 className="mb-5 text-[20px] font-semibold text-abb-ink md:text-[24px]">
              {locale === "az" ? "Tez-tez verilən suallar" : "Frequently asked questions"}
            </h2>
            <div className="divide-y divide-abb-border overflow-hidden rounded-[16px] border border-abb-border bg-abb-white">
              {faqs.map((faq) => (
                <details key={faq.q} className="group px-4 py-3 md:px-5 md:py-3.5">
                  <summary className="cursor-pointer list-none text-[13px] font-medium leading-snug text-abb-ink marker:content-none md:text-[14px]">
                    <span className="flex items-start justify-between gap-3">
                      <span className="min-w-0">{faq.q}</span>
                      <span className="shrink-0 text-abb-blue transition group-open:rotate-45">
                        +
                      </span>
                  </span>
                </summary>
                    <div className="mt-2 space-y-2 text-[12px] leading-[1.5] text-abb-muted md:text-[13px]">
                      {faq.a.split(/\n+/).map((para, pi) => (
                        <p key={pi}>{para}</p>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
          </div>
        </section>
        </Reveal>
      )}

      {/* Blue ABB mobile frame — ferdi sections only */}
      {showMobileBanner && (
        <Reveal delay={30}>
          <MobileAppDarkBanner dict={dict} />
        </Reveal>
      )}
    </div>
  );
}

export function humanizeSlug(segments: string[]) {
  const last = segments[segments.length - 1] || "";
  return titleFromSlug(last);
}
