import { FullImg } from "@/components/CdnImage";
import {
  BannerFrame,
  BannerMedia,
  bannerImgStyle,
} from "@/components/banners/BannerFrame";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";

const IMG = "https://cdn.abb-bank.az/sayt_183b93695e.png";
const HREF = "https://careers.abb-bank.az/";

type Props = { locale: Locale; dict: Dictionary };

export function CareerDarkBanner({ locale, dict }: Props) {
  const title =
    locale === "az"
      ? { before: "Gələcəyinizi", brand: "ABB", after: "ilə qurun!" }
      : { before: "Build your future with", brand: "ABB", after: "!" };

  return (
    <BannerFrame
      background="radial-gradient(45.81% 111.02% at 57.47% 14.48%, #383c46 0%, #24282f 100%)"
    >
      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2 md:gap-6">
        <div className="flex flex-col items-center gap-3 text-center md:items-start md:gap-4 md:text-left">
          <div className="flex flex-col gap-2 md:gap-3">
            <p
              className="font-medium tracking-[-0.02em] text-white"
              style={{ fontSize: "clamp(24px, 3.2vw, 40px)", lineHeight: 1.15 }}
            >
              <span>{title.before}</span>{" "}
              <span
                className="inline bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #6f9fff 0%, #74c4ff 34%)",
                }}
              >
                {title.brand}
              </span>{" "}
              <span>{title.after}</span>
            </p>
            <p
              className="max-w-[420px] text-white/90"
              style={{ fontSize: "clamp(13px, 1.1vw, 16px)", lineHeight: 1.5 }}
            >
              {dict.footer.careerBannerDesc}
            </p>
          </div>
          <a
            href={HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-white px-4 text-[15px] font-medium text-black transition hover:bg-white/90"
          >
            {dict.home.joinUs}
            <span aria-hidden>→</span>
          </a>
        </div>

        <BannerMedia>
          <FullImg
            src={IMG}
            alt="ABB Life"
            hq={false}
            className="object-contain object-bottom"
            style={bannerImgStyle}
          />
        </BannerMedia>
      </div>
    </BannerFrame>
  );
}
