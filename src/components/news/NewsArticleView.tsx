import Link from "next/link";
import { FullImg } from "@/components/CdnImage";
import { getNewsBody } from "@/lib/data/newsBodies";
import type { NewsItem } from "@/lib/data/news";
import type { Locale } from "@/lib/i18n/types";

type Props = {
  locale: Locale;
  item: NewsItem;
};

export function NewsArticleView({ locale, item }: Props) {
  const body = getNewsBody(item.id);
  const paragraphs =
    body?.[locale] ||
    body?.az ||
    [
      item.excerpt?.[locale] ||
        (locale === "az"
          ? "Xəbərin ətraflı mətni tezliklə əlavə olunacaq."
          : "Full article text will be added soon."),
    ];

  const relatedLabel = locale === "az" ? "Bütün xəbərlər" : "All news";
  const backHome = locale === "az" ? "Əsas səhifəyə qayıt" : "Back to home";

  return (
    <article className="bg-background text-abb-ink">
      <div className="container-abb pb-14 pt-8 md:pb-20 md:pt-10">
        <div className="mx-auto max-w-[760px]">
          <nav className="mb-6 text-[13px] text-abb-muted">
            <Link href={`/${locale}/xeberler`} className="hover:text-abb-blue">
              {relatedLabel}
            </Link>
            <span className="mx-2 opacity-50">/</span>
            <span className="text-abb-ink/70 line-clamp-1">{item.title[locale]}</span>
          </nav>

          <p className="text-[13px] text-abb-muted">{item.date}</p>
          <h1 className="mt-2 text-[28px] font-medium leading-tight tracking-[-0.02em] text-abb-ink md:text-[40px] lg:text-[44px]">
            {item.title[locale]}
          </h1>
          {item.excerpt?.[locale] && (
            <p className="mt-4 text-[16px] leading-relaxed text-abb-muted md:text-[18px]">
              {item.excerpt[locale]}
            </p>
          )}

          <div className="mt-8 overflow-hidden rounded-[24px] bg-abb-surface">
            <FullImg
              src={item.image}
              alt={item.title[locale]}
              className="aspect-[16/9] h-auto w-full object-cover"
            />
          </div>

          <div className="prose-abb mt-8 space-y-5 text-[15px] leading-[1.7] text-abb-ink md:text-[16px]">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-abb-border pt-8">
            <Link
              href={`/${locale}/xeberler`}
              className="inline-flex items-center rounded-full bg-abb-blue px-5 py-2.5 text-[14px] font-medium text-white transition hover:opacity-90"
            >
              {relatedLabel}
            </Link>
            <Link
              href={`/${locale}`}
              className="text-[13px] font-medium text-[#1b63ed] hover:underline"
            >
              {backHome}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
