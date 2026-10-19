import { CdnImage } from "@/components/CdnImage";
import Link from "next/link";
import { media } from "@/lib/data/media";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function QuickLinks({ locale, dict }: Props) {
  const items = [
    { label: dict.home.mortgage, href: `/${locale}/ferdi/kreditler/ipoteka-krediti`, image: media.quickLinks[0] },
    { label: dict.home.debitCards, href: `/${locale}/ferdi/kartlar/debet-kartlari`, image: media.quickLinks[1] },
    { label: dict.home.creditCards, href: `/${locale}/ferdi/kartlar/kredit-kartlari`, image: media.quickLinks[2] },
    { label: dict.home.cashback, href: `/${locale}/ferdi/kesbek`, image: media.quickLinks[3] },
    { label: dict.home.branches, href: `/${locale}/filiallar`, image: media.quickLinks[4] },
    { label: dict.home.investment, href: `/${locale}/investorlarla-elaqe`, image: media.quickLinks[5] },
  ];

  return (
    <section className="container-abb py-6">
      <h2 className="section-title mb-6">{dict.home.quickLinks}</h2>
      <div className="stagger-in grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="card-soft card-live card-live-glow flex flex-col items-center gap-3 px-3 py-5 text-center"
          >
            <span className="card-live-icon relative flex h-16 w-16 items-center justify-center">
              <CdnImage
                src={item.image}
                alt={item.label}
                width={64}
                height={64}
                className="h-14 w-14 object-contain"
              />
            </span>
            <span className="relative z-[1] text-[14px] font-medium leading-snug text-abb-ink">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
