import { FullImg } from "@/components/CdnImage";
import {
  BannerFrame,
  BannerMedia,
  bannerImgStyle,
} from "@/components/banners/BannerFrame";
import { media } from "@/lib/data/media";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

/** Medium blue ABB mobile banner — used on home + ferdi section pages */
export function MobileAppDarkBanner({ dict }: Props) {
  return (
    <BannerFrame
      background="radial-gradient(93.01% 342.43% at 73.44% -11.25%, #2b90ed 0%, #1b63ed 100%)"
    >
      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2 md:gap-6">
        <div className="text-center text-white md:text-left">
          <h2
            className="font-semibold"
            style={{ fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.15 }}
          >
            {dict.home.mobileAppTitle}
          </h2>
          <p
            className="mt-2 max-w-md text-white/90"
            style={{ fontSize: "clamp(13px, 1.1vw, 16px)", lineHeight: 1.5 }}
          >
            {dict.home.mobileAppDesc}
          </p>
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row md:items-end">
            <div
              className="shrink-0 overflow-hidden rounded-xl bg-white p-1.5 shadow-md"
              style={{ width: 112, height: 112 }}
            >
              <FullImg
                src={media.qr}
                alt="QR"
                className="h-full w-full object-contain"
              />
            </div>
            <p
              className="max-w-[180px] text-white/85"
              style={{ fontSize: 14, lineHeight: 1.4 }}
            >
              {dict.home.qrHint}
            </p>
          </div>
        </div>

        <BannerMedia>
          <FullImg
            src={media.mobileBanner}
            alt={dict.home.mobileAppTitle}
            hq={false}
            className="object-contain"
            style={bannerImgStyle}
          />
        </BannerMedia>
      </div>
    </BannerFrame>
  );
}
