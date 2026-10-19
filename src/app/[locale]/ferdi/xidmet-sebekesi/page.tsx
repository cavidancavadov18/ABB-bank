import { notFound } from "next/navigation";
import { NetworkView } from "@/components/network/NetworkView";
import { isLocale, type Locale } from "@/lib/i18n/types";

export default async function ServiceNetworkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  return <NetworkView locale={locale} />;
}
