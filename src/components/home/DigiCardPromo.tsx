import { CdnImage } from "@/components/CdnImage";
import Link from "next/link";
import { media } from "@/lib/data/media";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";
import { CreditFormInner } from "./CreditForm";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function DigiCardPromo({ locale, dict }: Props) {
  return (
    <section className="container-abb py-8">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="card-soft card-live card-live-glow relative overflow-hidden p-6 md:p-10">
          <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-abb-blue/10" />
          <div className="relative z-10 grid gap-8 md:grid-cols-[1.15fr_1fr] md:items-center">
            <div>
              <p className="text-[14px] font-medium text-abb-blue">
                {dict.home.usefulCashback}
              </p>
              <h2 className="mt-2 text-[32px] font-semibold tracking-tight text-abb-ink md:text-[40px]">
                {dict.home.digiCardTitle}
              </h2>
              <p className="mt-2 text-[18px] text-abb-muted">{dict.home.digiCardDesc}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-abb-blue-light px-4 py-2 text-[14px] font-semibold text-abb-blue">
                  {dict.home.free}
                </span>
                <span className="rounded-full bg-emerald-50 px-4 py-2 text-[14px] font-semibold text-emerald-700">
                  {dict.home.cashbackUpTo}
                </span>
              </div>
              <p className="mt-4 text-[13px] text-abb-muted">{dict.home.incomeNote}</p>
              <p className="mt-1 text-[12px] text-abb-muted">{dict.home.digiCardNote}</p>
              <Link href={`/${locale}/ferdi/kartlar/debet-kartlari`} className="btn-primary mt-6">
                {dict.home.order}
              </Link>
            </div>
            <div className="card-live-float relative mx-auto h-64 w-full max-w-[300px]">
              <CdnImage
                src={media.digiCard}
                alt={dict.home.digiCardTitle}
                fill
                className="object-contain drop-shadow-2xl"
                sizes="300px"
              />
            </div>
          </div>
        </div>

        <div className="card-soft card-live flex flex-col justify-between p-6 md:p-8">
          <div>
            <h3 className="text-[24px] font-semibold text-abb-ink">
              {dict.home.creditLimitTitle}
            </h3>
            <p className="mt-2 text-[15px] text-abb-muted">{dict.home.creditLimitDesc}</p>
          </div>
          <CreditFormInner dict={dict} />
        </div>
      </div>
    </section>
  );
}
