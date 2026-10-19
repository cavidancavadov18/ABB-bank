import { notFound } from "next/navigation";
import { NewsArticleView } from "@/components/news/NewsArticleView";
import { getNewsBySlug, newsItems } from "@/lib/data/news";
import { isLocale, type Locale } from "@/lib/i18n/types";

export function generateStaticParams() {
  return newsItems.flatMap((item) => {
    const slug = item.href.replace(/^\/xeberler\//, "");
    return [
      { locale: "az", slug },
      { locale: "en", slug },
    ];
  });
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam) || !slug) notFound();
  const locale = localeParam as Locale;
  const item = getNewsBySlug(slug);
  if (!item) notFound();

  return <NewsArticleView locale={locale} item={item} />;
}
