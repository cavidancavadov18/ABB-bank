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

export function ServicesSection({ locale, dict }: Props) {
  const services = [
    { label: dict.home.atms, href: `/${locale}/filiallar`, image: media.services[0] },
    { label: dict.home.onlineQueue, href: `/${locale}/ferdi/randevu`, image: media.services[1] },
    { label: dict.home.callCenter, href: "tel:937", image: media.services[2] },
    { label: dict.home.statement, href: `/${locale}/ferdi/arayis-sifarisi`, image: media.services[3] },
    { label: dict.home.loanPay, href: `/${locale}/ferdi/kredit-odenisi`, image: media.services[4] },
    { label: dict.home.donate, href: `/${locale}/ferdi/iane-et`, image: media.services[5] },
  ];

  return (
    <section className="container-abb py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="section-title">{dict.home.services}</h2>
        <Link
          href={`/${locale}/ferdi`}
          className="link-blue inline-flex items-center gap-1 transition hover:gap-2"
        >
          {dict.home.allServices}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="stagger-in grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="card-soft card-live flex min-h-[130px] flex-col justify-between p-5"
            >
              <span className="card-live-icon relative z-[1] mb-3 block h-12 w-12">
                <CdnImage src={s.image} alt={s.label} fill className="object-contain" sizes="48px" />
              </span>
              <span className="relative z-[1] text-[15px] font-medium text-abb-ink">{s.label}</span>
            </Link>
          ))}
        </div>

        <div className="card-soft card-live relative overflow-hidden">
          <div className="absolute inset-0">
            <CdnImage
              src={media.mobileBanner}
              alt={dict.home.mobileAppTitle}
              fill
              className="card-live-media object-cover"
              sizes="400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-abb-blue/95 via-abb-blue/75 to-abb-blue/40" />
          </div>
          <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white md:p-8">
            <div>
              <h3 className="text-[28px] font-semibold">{dict.home.mobileAppTitle}</h3>
              <p className="mt-3 max-w-sm text-[15px] text-white/90">{dict.home.mobileAppDesc}</p>
            </div>
            <div className="mt-8 flex items-end gap-5">
              <div className="card-live-float relative h-28 w-28 overflow-hidden rounded-2xl bg-white p-2 shadow-lg">
                <CdnImage src={media.qr} alt="QR" fill className="object-contain p-2" sizes="112px" />
              </div>
              <p className="max-w-[180px] text-[13px] text-white/90">{dict.home.qrHint}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
