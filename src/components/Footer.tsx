import Image from "next/image";
import Link from "next/link";
import { flattenMegaLinks } from "@/lib/data/megaMenu";
import { media } from "@/lib/data/media";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";
import { Logo } from "./icons";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

const FOOTER_BG =
  "radial-gradient(45.81% 111.02% at 57.47% 14.48%, #383c46 0%, #24282f 100%)";

export function Footer({ locale, dict }: Props) {
  const personal = flattenMegaLinks("personal").filter((l) => l.bold);
  const business = flattenMegaLinks("business").filter((l) => l.bold).slice(0, 8);
  const about = flattenMegaLinks("about").filter((l) => l.bold);

  const contacts = [
    {
      label: locale === "az" ? "Tel:" : "Tel:",
      value: "+994 12 493 00 91",
      href: "tel:+994124930091",
    },
    {
      label: locale === "az" ? "E-poçt:" : "Email:",
      value: "info@abb-bank.az",
      href: "mailto:info@abb-bank.az",
    },
    {
      label: locale === "az" ? "Faks:" : "Fax:",
      value: "+994 12 493 00 91",
      href: "tel:+994124930091",
    },
    {
      label: locale === "az" ? "Ünvan:" : "Address:",
      value:
        locale === "az"
          ? "67, Nizami küç., AZ1005 Bakı, Azərbaycan"
          : "67, Nizami str., AZ1005 Baku, Azerbaijan",
      href: null as string | null,
    },
  ];

  const social = [
    { src: media.social.twitter, alt: "X", href: "https://x.com/abb_bank" },
    { src: media.social.youtube, alt: "YouTube", href: "https://www.youtube.com/c/abbaz" },
    {
      src: media.social.instagram,
      alt: "Instagram",
      href: "https://www.instagram.com/abb_bank/",
    },
    {
      src: media.social.facebook,
      alt: "Facebook",
      href: "https://www.facebook.com/abbbank.az",
    },
    {
      src: media.social.linkedin,
      alt: "LinkedIn",
      href: "https://www.linkedin.com/company/the-international-bank-of-azerbaijan/",
    },
  ];

  const partners = [
    {
      src: media.partners[0],
      alt: "Virtual Karabakh",
      href: "https://www.virtualkarabakh.az/",
    },
    { src: media.partners[1], alt: "Infobank", href: "http://infobank.az/" },
    { src: media.partners[2], alt: "ADIF", href: "https://adif.gov.az/" },
    { src: media.partners[3], alt: "Bizim Pullar", href: "https://bizimpullar.az/" },
    { src: media.partners[4], alt: "ESG Hub Azerbaijan", href: "https://esghub.az/" },
  ];

  return (
    <footer className="abb-footer mt-auto text-white" style={{ background: FOOTER_BG }}>
      <div className="container-abb py-10 md:py-14">
        <div className="grid gap-10 xl:grid-cols-12 xl:gap-12">
          {/* Left: logo + contacts + promo cards */}
          <div className="space-y-8 xl:col-span-5">
            <Link href={`/${locale}`} aria-label="ABB">
              <Logo tone="white" />
            </Link>

            <div className="grid gap-4 sm:grid-cols-2">
              {contacts.map((c) => (
                <div key={c.label + c.value} className="min-w-0">
                  <p className="text-[14px] text-white/70">{c.label}</p>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="mt-0.5 block text-[14px] font-medium text-white transition hover:text-white/85"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-[14px] font-medium leading-snug text-white">
                      {c.value}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="relative overflow-hidden rounded-[24px] bg-[rgba(10,11,13,0.35)] p-5 ring-1 ring-white/10">
                <p className="text-[16px] font-semibold text-white">
                  {dict.footer.download}
                </p>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div className="min-w-0 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <a
                        href="https://apps.apple.com"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="App Store"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition hover:scale-105"
                      >
                        <AppleIcon />
                      </a>
                      <a
                        href="https://play.google.com"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Google Play"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition hover:scale-105"
                      >
                        <GooglePlayIcon />
                      </a>
                    </div>
                    <a
                      href="https://onelink.to/xt3wze"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-[10px] bg-[#1b63ed] px-3.5 py-2.5 text-[13px] font-medium text-white shadow-[0_4px_14px_rgba(27,99,237,0.45)] transition hover:bg-[#1554d4]"
                    >
                      <AppGridIcon />
                      {locale === "az" ? "Tətbiqi yüklə" : "Download app"}
                    </a>
                  </div>
                  <div className="relative -mb-5 h-[110px] w-[78px] shrink-0">
                    <Image
                      src={media.services[3]}
                      alt="ABB mobile"
                      fill
                      className="object-contain object-bottom drop-shadow-lg"
                      sizes="78px"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between overflow-hidden rounded-[24px] bg-[rgba(10,11,13,0.28)] p-5">
                <div>
                  <p className="text-[16px] font-semibold text-white">
                    {dict.footer.career}
                  </p>
                  <p className="mt-2 text-[13px] leading-snug text-white/70">
                    {dict.footer.careerDesc}
                  </p>
                </div>
                <Link
                  href={`/${locale}/haqqimizda`}
                  className="mt-5 inline-flex w-fit items-center gap-1 rounded-[10px] bg-[#1b63ed] px-4 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#1554d4]"
                >
                  {dict.footer.careerCta}
                  <span aria-hidden>›</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right: nav columns */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:col-span-7 xl:grid-cols-3">
            <FooterCol
              locale={locale}
              title={dict.footer.personal}
              items={personal}
              rootHref={`/${locale}/ferdi`}
            />
            <FooterCol
              locale={locale}
              title={dict.footer.business}
              items={business}
              rootHref={`/${locale}/biznes`}
            />
            <div className="space-y-8">
              <FooterCol
                locale={locale}
                title={dict.footer.about}
                items={about.slice(0, 8)}
                rootHref={`/${locale}/haqqimizda`}
              />
              <div>
                <Link
                  href={`/${locale}/investorlarla-elaqe`}
                  className="mb-3 block text-[13px] font-semibold tracking-[0.04em] text-white uppercase"
                >
                  {dict.nav.investors}
                </Link>
                <Link
                  href={`/${locale}/xeberler`}
                  className="block text-[13px] font-semibold tracking-[0.04em] text-white uppercase"
                >
                  {dict.nav.news}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar — real: 1160 / 3 cols / py-20 / social 48·icons24 / partners 40 */}
      <div className="border-t border-white/10">
        <div className="mx-auto grid max-w-[1160px] items-center gap-4 px-5 py-5 md:grid-cols-3 md:gap-0 md:px-8 xl:px-0">
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            {social.map((s) => (
              <a
                key={s.alt}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.alt}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[rgba(10,11,13,0.16)] p-3 transition-colors hover:bg-[#1b63ed]"
              >
                <Image
                  src={s.src}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 brightness-0 invert"
                />
              </a>
            ))}
          </div>

          <p className="text-center text-[14px] leading-none text-white/70">
            {dict.footer.rights}
          </p>

          <div className="flex items-center justify-center gap-[10px] md:justify-end">
            {partners.map((p) => (
              <a
                key={p.href}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={p.alt}
                title={p.alt}
                className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center transition hover:opacity-80"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  locale,
  title,
  items,
  rootHref,
}: {
  locale: Locale;
  title: string;
  items: { az: string; en: string; href: string; external?: boolean }[];
  rootHref: string;
}) {
  return (
    <div>
      <Link
        href={rootHref}
        className="mb-4 block text-[13px] font-semibold tracking-[0.04em] text-white uppercase"
      >
        {title}
      </Link>
      <ul className="space-y-2.5">
        {items.map((item) => {
          const href =
            item.external || item.href.startsWith("http")
              ? item.href
              : `/${locale}${item.href}`;
          const label = item[locale];
          const cls =
            "text-[14px] text-white/65 transition hover:text-white";
          return (
            <li key={item.href + item.az}>
              {item.external || item.href.startsWith("http") ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
                  {label}
                </a>
              ) : (
                <Link href={href} className={cls}>
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function AppGridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#000" aria-hidden>
      <path d="M16.365 12.21c-.02-2.16 1.76-3.2 1.84-3.25-1.01-1.47-2.57-1.67-3.12-1.69-1.33-.13-2.6.78-3.27.78-.68 0-1.72-.76-2.84-.74-1.46.02-2.81.85-3.56 2.15-1.52 2.64-.39 6.54 1.09 8.68.73 1.05 1.59 2.22 2.73 2.18 1.1-.04 1.51-.7 2.84-.7 1.32 0 1.69.7 2.85.68 1.18-.02 1.92-1.06 2.64-2.12.83-1.21 1.17-2.39 1.19-2.45-.03-.01-2.28-.87-2.3-3.46zM14.5 5.52c.6-.73.99-1.74.88-2.75-.85.03-1.88.57-2.49 1.29-.55.64-.99 1.66-.87 2.64.96.07 1.88-.49 2.48-1.18z" />
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M3.6 2.2c-.3.2-.5.5-.5.9v17.8c0 .4.2.7.5.9l.1.1L13.1 12v-.1L3.7 2.1l-.1.1z"
      />
      <path
        fill="#FBBC04"
        d="M16.5 9.1 13.1 12l3.4 2.9 3.9-2.2c1.1-.6 1.1-1.7 0-2.3l-3.9-2.3z"
      />
      <path
        fill="#4285F4"
        d="M13.1 12 3.6 21.9c.4.3 1 .3 1.5 0l11.4-6.5L13.1 12z"
      />
      <path
        fill="#34A853"
        d="M13.1 12 16.5 9.1 5.1 2.1C4.6 1.8 4 1.9 3.6 2.2L13.1 12z"
      />
    </svg>
  );
}
