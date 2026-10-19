import { CareerDarkBanner } from "@/components/banners/CareerDarkBanner";
import { CdnImage } from "@/components/CdnImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { getSectionMedia } from "@/lib/data/sectionImages";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/types";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const p = dict.aboutPage;

  const aboutSections = [
    { id: "bank", path: "/haqqimizda", href: `/${locale}/haqqimizda` },
    { id: "rehberlik", path: "/haqqimizda/rehberlik", href: `/${locale}/haqqimizda/rehberlik` },
    { id: "siyaset", path: "/haqqimizda/siyasetlerimiz", href: `/${locale}/haqqimizda/siyasetlerimiz` },
    { id: "hesabatlar", path: "/haqqimizda/hesabatlar", href: `/${locale}/haqqimizda/hesabatlar` },
  ];
  const hero = getSectionMedia("/haqqimizda");

  return (
    <>
      <PageHero
        title={p.title}
        subtitle={p.subtitle}
        image={hero.image}
        gradient="linear-gradient(135deg, #1e3a8a 0%, #1b63ed 55%, #0891b2 100%)"
      />

      <section className="container-abb py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {p.stats.map((stat) => (
            <div key={stat.label} className="card-soft p-6 text-center">
              <p className="text-[36px] font-semibold tracking-tight text-abb-blue">
                {stat.value}
              </p>
              <p className="mt-2 text-[14px] text-abb-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-abb pb-8">
        <div className="card-soft p-6 md:p-10">
          <h2 className="text-[28px] font-semibold text-abb-ink">{p.awardsTitle}</h2>
          <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-abb-muted">
            {p.awardsDesc}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              locale === "az" ? "İlin Bankı" : "Bank of the Year",
              locale === "az" ? "Ən yaxşı rəqəmsal bank" : "Best digital bank",
              locale === "az" ? "Müştəri təcrübəsi" : "Customer experience",
            ].map((award) => (
              <div
                key={award}
                className="rounded-[20px] bg-abb-surface px-5 py-6 text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-abb-blue text-white">
                  ★
                </div>
                <p className="text-[15px] font-medium text-abb-ink">{award}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-abb pb-10">
        <div className="grid gap-4 md:grid-cols-2">
          {p.sections.map((section, i) => {
            const meta = aboutSections[i];
            const img = getSectionMedia(meta.path).image;
            return (
              <article
                key={section.title}
                id={meta.id}
                className="card-soft scroll-mt-28 overflow-hidden"
              >
                <div className="relative h-36 bg-abb-surface">
                  <CdnImage
                    src={img}
                    alt={section.title}
                    fill
                    className="object-contain p-4"
                    sizes="400px"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <h2 className="text-[22px] font-semibold text-abb-ink">{section.title}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-abb-muted">
                    {section.desc}
                  </p>
                  <Link href={meta.href} className="link-blue mt-4 inline-block text-[14px]">
                    {locale === "az" ? "Ətraflı" : "Details"}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <CareerDarkBanner locale={locale} dict={dict} />
    </>
  );
}
