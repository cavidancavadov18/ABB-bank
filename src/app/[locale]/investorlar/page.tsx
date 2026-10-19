import { redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n/types";

/** Legacy route → canonical investor relations path */
export default async function InvestorsRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) redirect("/az/investorlarla-elaqe");
  redirect(`/${locale}/investorlarla-elaqe`);
}
