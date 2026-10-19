import { notFound } from "next/navigation";
import { ContentPage } from "@/components/ContentPage";
import { isLocale, type Locale } from "@/lib/i18n/types";

export default async function UsefulLinksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  return (
    <ContentPage
      locale={locale}
      title={locale === "az" ? "Faydalı linklər" : "Useful links"}
      path="/faydali-linkler"
      parentHref={`/${locale}`}
    />
  );
}
