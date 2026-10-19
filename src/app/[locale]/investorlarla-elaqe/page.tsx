import { notFound } from "next/navigation";
import { InvestorsView } from "@/components/investors/InvestorsView";
import { isLocale, type Locale } from "@/lib/i18n/types";

export default async function InvestorRelationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  return <InvestorsView locale={locale} />;
}
