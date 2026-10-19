import { notFound } from "next/navigation";
import { ContentPage, humanizeSlug } from "@/components/ContentPage";
import { isLocale, type Locale } from "@/lib/i18n/types";

export default async function FerdiSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam) || !slug?.length) notFound();
  const locale = localeParam as Locale;
  const path = `/ferdi/${slug.join("/")}`;

  return (
    <ContentPage
      locale={locale}
      title={humanizeSlug(slug)}
      path={path}
      parentHref={`/${locale}/ferdi`}
      parentLabel={locale === "az" ? "Fərdi" : "Personal"}
    />
  );
}
