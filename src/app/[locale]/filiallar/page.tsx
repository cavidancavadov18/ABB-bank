import { notFound } from "next/navigation";
import { NetworkView } from "@/components/network/NetworkView";
import { isLocale, type Locale } from "@/lib/i18n/types";

/** Real URL parity: /az/filiallar */
export default async function FiliallarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  return <NetworkView locale={locale} />;
}
