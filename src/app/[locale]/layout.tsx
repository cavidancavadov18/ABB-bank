import { notFound } from "next/navigation";
import { ChatWidget } from "@/components/ChatWidget";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/types";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col bg-abb-surface">
      <Header locale={locale} dict={dict} />
      <main className="relative z-[1] flex-1">{children}</main>
      <Footer locale={locale} dict={dict} />
      <ChatWidget locale={locale} dict={dict} />
    </div>
  );
}
