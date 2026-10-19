import { notFound } from "next/navigation";
import { NewsView } from "@/components/news/NewsView";
import { isLocale, type Locale } from "@/lib/i18n/types";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  return <NewsView locale={locale} />;
}
