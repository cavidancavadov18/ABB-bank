import { CdnImage } from "@/components/CdnImage";
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { getSectionMedia } from "@/lib/data/sectionImages";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/types";

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const p = dict.businessPage;

  const segments = [
    { id: "korporativ", path: "/biznes/korporativ", href: `/${locale}/biznes/korporativ` },
    { id: "kob", path: "/biznes/kicik-ve-orta-biznes", href: `/${locale}/biznes/kicik-ve-orta-biznes` },
    { id: "mikro", path: "/biznes/mikro-biznes", href: `/${locale}/biznes/mikro-biznes` },
    { id: "internet", path: "/biznes", href: `/${locale}/biznes/korporativ` },
  ] as const;
  const hero = getSectionMedia("/biznes");

  return (
    <>
      <Reveal>
        <PageHero
          title={p.title}
          subtitle={p.subtitle}
          image={hero.image}
          gradient="linear-gradient(135deg, #0f766e 0%, #0ea5e9 50%, #1b63ed 100%)"
        />
      </Reveal>

      <Reveal delay={40}>
        <section className="container-abb py-10 md:py-14">
          <div className="stagger-in grid gap-4 md:grid-cols-2">
            {p.segments.map((segment, i) => {
              const meta = segments[i];
              const img = getSectionMedia(meta.path).image;
              return (
                <article
                  key={segment.title}
                  id={meta.id}
                  className="card-soft card-live scroll-mt-28 overflow-hidden"
                >
                  <div className="relative h-40 bg-abb-surface">
                    <CdnImage
                      src={img}
                      alt={segment.title}
                      fill
                      className="card-live-media object-contain p-4"
                      sizes="400px"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <h2 className="text-[24px] font-semibold text-abb-ink">{segment.title}</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-abb-muted">
                      {segment.desc}
                    </p>
                    <ul className="mt-5 space-y-2 text-[14px] text-abb-ink">
                      <li>• {locale === "az" ? "Hesab açılışı və ödənişlər" : "Account opening & payments"}</li>
                      <li>• {locale === "az" ? "Kredit və maliyyələşmə" : "Loans & financing"}</li>
                      <li>• {locale === "az" ? "Rəqəmsal idarəetmə" : "Digital management"}</li>
                    </ul>
                    <Link href={meta.href} className="btn-primary mt-6">
                      {dict.home.apply}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </Reveal>

      <Reveal delay={50}>
        <section className="container-abb pb-16">
          <div className="card-soft grid gap-6 bg-gradient-to-r from-abb-blue to-indigo-700 p-8 text-white md:grid-cols-[1.4fr_1fr] md:items-center md:p-10">
            <div>
              <h2 className="text-[28px] font-semibold">{dict.home.abbBizTitle}</h2>
              <p className="mt-3 text-[16px] text-white/90">{dict.home.abbBizDesc}</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href={`/${locale}`} className="btn-white">
                {dict.home.detailed}
              </Link>
              <a href="tel:937" className="inline-flex items-center rounded-[10px] border border-white/40 px-4 py-2.5 text-[14px] font-medium">
                937
              </a>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
