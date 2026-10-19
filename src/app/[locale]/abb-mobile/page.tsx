import { notFound } from "next/navigation";
import { ContentPage } from "@/components/ContentPage";
import { isLocale, type Locale } from "@/lib/i18n/types";

export default async function AbbMobilePage({
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
      title="ABB mobile"
      path="/abb-mobile"
      parentHref={`/${locale}`}
      parentLabel={locale === "az" ? "Ana səhifə" : "Home"}
    />
  );
}
