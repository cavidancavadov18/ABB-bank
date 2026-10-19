import { notFound } from "next/navigation";
import { CareerDarkBanner } from "@/components/banners/CareerDarkBanner";
import { Reveal } from "@/components/Reveal";
import { Calculator } from "@/components/home/Calculator";
import { Campaigns } from "@/components/home/Campaigns";
import { CareSection } from "@/components/home/CareSection";
import { CurrencySection } from "@/components/home/CurrencySection";
import { DigiCardPromo } from "@/components/home/DigiCardPromo";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeAmbient } from "@/components/home/HomeAmbient";
import { HomeTicker } from "@/components/home/HomeTicker";
import { NewsSection } from "@/components/home/NewsSection";
import { QuickLinks } from "@/components/home/QuickLinks";
import { RatingSection } from "@/components/home/RatingSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/types";

export async function generateStaticParams() {
  return [{ locale: "az" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const dict = getDictionary(localeParam);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <HomeAmbient />
      <div className="home-shell">
        <Reveal>
          <HeroSection locale={locale} dict={dict} />
        </Reveal>
        <HomeTicker locale={locale} dict={dict} />
        <Reveal delay={30}>
          <NewsSection locale={locale} dict={dict} />
        </Reveal>
        <Reveal delay={40}>
          <QuickLinks locale={locale} dict={dict} />
        </Reveal>
        <Reveal delay={40}>
          <DigiCardPromo locale={locale} dict={dict} />
        </Reveal>
        <Reveal delay={40}>
          <Campaigns locale={locale} dict={dict} />
        </Reveal>
        <Reveal delay={40}>
          <Calculator locale={locale} dict={dict} />
        </Reveal>
        <Reveal delay={40}>
          <CurrencySection locale={locale} dict={dict} />
        </Reveal>
        <Reveal delay={40}>
          <ServicesSection locale={locale} dict={dict} />
        </Reveal>
        <Reveal delay={40}>
          <CareSection locale={locale} dict={dict} />
        </Reveal>
        <Reveal delay={40}>
          <RatingSection dict={dict} />
        </Reveal>
        <Reveal delay={30}>
          <CareerDarkBanner locale={locale} dict={dict} />
        </Reveal>
      </div>
    </>
  );
}
