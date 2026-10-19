import { notFound } from "next/navigation";
import { ContentPage } from "@/components/ContentPage";
import { isLocale, type Locale } from "@/lib/i18n/types";

export default async function CorpPresentationPage({
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
      title={locale === "az" ? "Korporativ təqdimat" : "Corporate presentation"}
      path="/korporativ-teqdimat"
      parentHref={`/${locale}/haqqimizda`}
    />
  );
}
