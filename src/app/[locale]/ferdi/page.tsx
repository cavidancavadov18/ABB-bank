import { CdnImage } from "@/components/CdnImage";
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calculator } from "@/components/home/Calculator";
import { Campaigns } from "@/components/home/Campaigns";
import { PageHero } from "@/components/PageHero";
import { getSectionMedia } from "@/lib/data/sectionImages";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/types";

export default async function PersonalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const p = dict.personalPage;
  const hero = getSectionMedia("/ferdi");

  const products = [
    { title: p.products[0]?.title, desc: p.products[0]?.desc, cta: p.products[0]?.cta, href: `/${locale}/ferdi/kreditler/nagd-kredit`, path: "/ferdi/kreditler/nagd-kredit" },
    { title: p.products[1]?.title, desc: p.products[1]?.desc, cta: p.products[1]?.cta, href: `/${locale}/ferdi/kartlar/kredit-kartlari`, path: "/ferdi/kartlar/kredit-kartlari" },
    { title: p.products[2]?.title, desc: p.products[2]?.desc, cta: p.products[2]?.cta, href: `/${locale}/ferdi/emanetler/digideposit`, path: "/ferdi/emanetler/digideposit" },
    { title: p.products[3]?.title, desc: p.products[3]?.desc, cta: p.products[3]?.cta, href: `/${locale}/ferdi/kreditler/ipoteka-krediti`, path: "/ferdi/kreditler/ipoteka-krediti" },
    { title: p.products[4]?.title, desc: p.products[4]?.desc, cta: p.products[4]?.cta, href: `/${locale}/ferdi/kesbek`, path: "/ferdi/kesbek" },
    { title: p.products[5]?.title, desc: p.products[5]?.desc, cta: p.products[5]?.cta, href: `/${locale}/abb-mobile`, path: "/abb-mobile" },
  ].filter((x) => x.title);

  const anchors = [
    { id: "kartlar", title: dict.megaPersonal.cards, path: "/ferdi/kartlar", href: `/${locale}/ferdi/kartlar` },
    { id: "emanetler", title: dict.megaPersonal.deposits, path: "/ferdi/emanetler", href: `/${locale}/ferdi/emanetler` },
    { id: "hesablar", title: dict.megaPersonal.accounts, path: "/ferdi/butun-hesablar", href: `/${locale}/ferdi/butun-hesablar` },
    { id: "ipoteka", title: dict.megaPersonal.mortgage, path: "/ferdi/kreditler/ipoteka-krediti", href: `/${locale}/ferdi/kreditler/ipoteka-krediti` },
    { id: "kesbek", title: dict.megaPersonal.cashback, path: "/ferdi/kesbek", href: `/${locale}/ferdi/kesbek` },
    { id: "kampaniyalar", title: dict.megaPersonal.campaigns, path: "/ferdi/kampaniyalar", href: `/${locale}/ferdi/kampaniyalar` },
    { id: "online", title: dict.megaPersonal.online, path: "/ferdi/butun-emeliyyatlar", href: `/${locale}/ferdi/butun-emeliyyatlar` },
    { id: "prime", title: dict.megaPersonal.prime, path: "/ferdi/kartlar/debet-kartlari", href: `/${locale}/ferdi/kartlar/debet-kartlari` },
    { id: "filiallar", title: dict.home.branches, path: "/filiallar", href: `/${locale}/filiallar` },
  ];

  return (
    <>
      <Reveal>
        <PageHero title={p.title} subtitle={p.subtitle} image={hero.image} />
      </Reveal>

      <Reveal delay={40}>
        <section className="container-abb py-10">
          <h2 className="section-title mb-6">{p.productsTitle}</h2>
          <div className="stagger-in grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => {
              const img = getSectionMedia(product.path).image;
              return (
                <article
                  key={product.path}
                  className="card-soft card-live flex flex-col overflow-hidden"
                >
                  <div className="relative h-44 bg-abb-surface">
                    <CdnImage
                      src={img}
                      alt={product.title || ""}
                      fill
                      className="card-live-media object-contain p-4"
                      sizes="320px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-[20px] font-semibold text-abb-ink">{product.title}</h3>
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed text-abb-muted">
                      {product.desc}
                    </p>
                    <Link href={product.href} className="btn-primary mt-6 self-start">
                      {product.cta}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </Reveal>

      <Reveal delay={50}>
        <section className="container-abb pb-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {anchors.map((a) => {
              const img = getSectionMedia(a.path).image;
              return (
                <div key={a.id} id={a.id} className="card-soft scroll-mt-28 overflow-hidden">
                  <div className="relative h-32 bg-abb-surface">
                    <CdnImage
                      src={img}
                      alt={a.title}
                      fill
                      className="object-contain p-3"
                      sizes="280px"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-[18px] font-semibold text-abb-ink">{a.title}</h3>
                    <p className="mt-2 text-[14px] text-abb-muted">
                      {locale === "az"
                        ? `${a.title} üzrə məhsul və xidmətlər — real sayt şəkilləri ilə demo məzmun.`
                        : `Products and services for ${a.title} — demo content with real-site imagery.`}
                    </p>
                    <Link href={a.href} className="link-blue mt-3 inline-block text-[14px]">
                      {dict.home.detailed}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </Reveal>

      <Reveal delay={40}>
        <div id="kampaniyalar-block">
          <Campaigns locale={locale} dict={dict} />
        </div>
      </Reveal>
      <Reveal delay={40}>
        <Calculator locale={locale} dict={dict} />
      </Reveal>
    </>
  );
}
