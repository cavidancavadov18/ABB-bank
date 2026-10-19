import { CdnImage } from "@/components/CdnImage";
import Link from "next/link";
import { media } from "@/lib/data/media";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";
import { ArrowRight } from "../icons";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function CareSection({ locale, dict }: Props) {
  const cards = [
    { title: dict.home.care1Title, desc: dict.home.care1Desc, image: media.care[0] },
    { title: dict.home.care2Title, desc: dict.home.care2Desc, image: media.care[1] },
    { title: dict.home.care3Title, desc: dict.home.care3Desc, image: media.care[2] },
  ];

  return (
    <section className="container-abb py-10">
      <h2 className="section-title mb-6 max-w-xl">{dict.home.careTitle}</h2>
      <div className="stagger-in grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article key={card.title} className="card-soft card-live overflow-hidden">
            <div className="relative h-40 overflow-hidden bg-abb-surface">
              <CdnImage
                src={card.image}
                alt={card.title}
                fill
                className="card-live-media object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="relative z-[1] p-5">
              <h3 className="text-[18px] font-semibold text-abb-ink">{card.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-abb-muted">{card.desc}</p>
              <Link
                href={`/${locale}/haqqimizda`}
                className="link-blue mt-4 inline-flex items-center gap-1 transition hover:gap-2"
              >
                {dict.home.more}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
