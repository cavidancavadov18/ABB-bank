"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { flattenMegaLinks, type MegaMenuKey } from "@/lib/data/megaMenu";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";
import {
  ChevronDown,
  CloseIcon,
  Logo,
  MenuIcon,
  PhoneIcon,
  PinIcon,
  SearchIcon,
} from "./icons";
import { MegaMenu } from "./MegaMenu";
import { SearchModal } from "./SearchModal";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function Header({ locale, dict }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<MegaMenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    const id = window.requestAnimationFrame(onScroll);
    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!openMenu) {
      document.body.classList.remove("menu-open");
      return;
    }
    document.body.classList.add("menu-open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  const clearClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const open = (key: MegaMenuKey) => {
    clearClose();
    setOpenMenu(key);
  };

  const scheduleClose = () => {
    clearClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 320);
  };

  const closeNow = () => {
    clearClose();
    setOpenMenu(null);
  };

  const switchLocale = () => {
    const next = locale === "az" ? "en" : "az";
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/") || `/${next}`);
  };

  const navMega: { key: MegaMenuKey; label: string; href: string }[] = [
    { key: "personal", label: dict.nav.personal, href: `/${locale}/ferdi` },
    { key: "business", label: dict.nav.business, href: `/${locale}/biznes` },
    { key: "about", label: dict.nav.about, href: `/${locale}/haqqimizda` },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 ${
          openMenu ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeNow}
        aria-hidden
      />

      <header className="sticky top-0 z-50 isolate">
        <div
          className={`relative bg-abb-white transition-shadow duration-200 ${
            scrolled || openMenu
              ? "shadow-[0_4px_24px_rgba(10,11,13,0.1)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
              : ""
          }`}
          onPointerEnter={clearClose}
          onPointerLeave={scheduleClose}
        >
          <div className="border-b border-abb-border/80">
            <div className="container-abb flex h-20 items-center justify-between gap-4">
              <div className="flex items-center gap-8 lg:gap-12">
                <Link
                  href={`/${locale}`}
                  aria-label="ABB home"
                  className="relative z-10 shrink-0"
                  onClick={closeNow}
                >
                  <Logo />
                </Link>

                <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
                  {navMega.map((item) => {
                    const active = openMenu === item.key;
                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        aria-expanded={active}
                        aria-haspopup="true"
                        className={`inline-flex items-center gap-1 rounded-[10px] px-3 py-2 text-[16px] font-medium transition-colors duration-150 ${
                          active
                            ? "bg-abb-blue-light text-abb-blue"
                            : "text-abb-ink hover:bg-abb-surface"
                        }`}
                        onPointerEnter={() => open(item.key)}
                        onFocus={() => open(item.key)}
                        onClick={(e) => {
                          // first click opens panel like real site; second goes through
                          if (!active) {
                            e.preventDefault();
                            open(item.key);
                          } else {
                            closeNow();
                          }
                        }}
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-250 ${
                            active ? "rotate-180 text-abb-blue" : "text-abb-muted"
                          }`}
                        />
                      </Link>
                    );
                  })}
                  <Link
                    href={`/${locale}/investorlarla-elaqe`}
                    className="rounded-[10px] px-3 py-2 text-[16px] font-medium text-abb-ink transition-colors hover:bg-abb-surface"
                    onClick={closeNow}
                    onPointerEnter={closeNow}
                  >
                    {dict.nav.investors}
                  </Link>
                  <Link
                    href={`/${locale}/xeberler`}
                    className="rounded-[10px] px-3 py-2 text-[16px] font-medium text-abb-ink transition-colors hover:bg-abb-surface"
                    onClick={closeNow}
                    onPointerEnter={closeNow}
                  >
                    {dict.nav.news}
                  </Link>
                </nav>
              </div>

              <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-3 px-0 lg:gap-4 lg:px-4">
                  <button
                    type="button"
                    aria-label={dict.nav.search}
                    onClick={() => {
                      closeNow();
                      setSearchOpen(true);
                    }}
                    className="inline-flex p-1 text-[var(--abb-header-util)] transition-colors hover:text-abb-ink"
                  >
                    <SearchIcon className="h-6 w-6" />
                  </button>

                  <span
                    className="hidden h-6 w-px shrink-0 bg-[var(--abb-divider)] lg:block"
                    aria-hidden
                  />

                  <ThemeToggle
                    labelLight={dict.nav.themeLight}
                    labelDark={dict.nav.themeDark}
                  />

                  <span
                    className="hidden h-6 w-px shrink-0 bg-[var(--abb-divider)] lg:block"
                    aria-hidden
                  />

                  <button
                    type="button"
                    onClick={switchLocale}
                    className="hidden px-1 text-[16px] font-medium text-[var(--abb-header-util)] transition-colors hover:text-abb-ink lg:inline-flex"
                  >
                    {locale.toUpperCase()}
                  </button>

                  <span
                    className="hidden h-6 w-px shrink-0 bg-[var(--abb-divider)] lg:block"
                    aria-hidden
                  />

                  <a
                    href="tel:937"
                    className="hidden items-center gap-1 px-2 text-[16px] font-medium text-[var(--abb-header-util)] transition-colors hover:text-abb-ink lg:inline-flex"
                  >
                    <PhoneIcon className="h-5 w-5 shrink-0" />
                    {dict.nav.phone}
                  </a>
                </div>

                <Link
                  href={`/${locale}/filiallar`}
                  className="hidden h-10 items-center justify-center gap-2 rounded-[10px] bg-abb-blue py-[11px] pl-[11px] pr-[15px] text-[14px] font-medium whitespace-nowrap text-white transition-colors hover:bg-abb-blue-dark sm:inline-flex"
                  onClick={closeNow}
                >
                  <PinIcon className="h-5 w-5" />
                  {dict.nav.network}
                </Link>

                <button
                  type="button"
                  className="rounded-lg p-2 text-abb-ink lg:hidden"
                  aria-label="Menu"
                  onClick={() => setMobileOpen((v) => !v)}
                >
                  {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              </div>
            </div>
          </div>

          <div
            className={`hidden lg:block ${
              openMenu
                ? "pointer-events-auto"
                : "pointer-events-none h-0 overflow-hidden opacity-0"
            }`}
          >
            {openMenu && (
              <div className="mega-panel container-abb pb-5 pt-3">
                <MegaMenu menuKey={openMenu} locale={locale} onNavigate={closeNow} />
              </div>
            )}
          </div>
        </div>

        {mobileOpen && (
          <div className="border-b border-abb-border bg-abb-white lg:hidden">
            <div className="container-abb flex max-h-[75vh] flex-col gap-1 overflow-auto py-4">
              {navMega.map((item) => (
                <div key={item.key} className="rounded-xl border border-abb-border/70">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-3 text-left text-[16px] font-medium"
                    onClick={() => setOpenMenu(openMenu === item.key ? null : item.key)}
                  >
                    {item.label}
                    <ChevronDown
                      className={`transition-transform duration-200 ${
                        openMenu === item.key ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openMenu === item.key && (
                    <div className="max-h-[45vh] space-y-1 overflow-y-auto border-t border-abb-border px-3 py-3">
                      {flattenMegaLinks(item.key).map((link) => {
                        const href =
                          link.external || link.href.startsWith("http")
                            ? link.href
                            : `/${locale}${link.href}`;
                        const props = {
                          className:
                            "block rounded-lg px-2 py-2 text-[14px] text-abb-muted hover:bg-abb-surface hover:text-abb-blue",
                          onClick: () => {
                            setMobileOpen(false);
                            closeNow();
                          },
                          children: link[locale],
                        };
                        return link.external || link.href.startsWith("http") ? (
                          <a key={href + link.az} href={href} {...props} />
                        ) : (
                          <Link key={href + link.az} href={href} {...props} />
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              <Link
                href={`/${locale}/investorlarla-elaqe`}
                className="rounded-xl px-3 py-3 text-[16px] font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {dict.nav.investors}
              </Link>
              <Link
                href={`/${locale}/xeberler`}
                className="rounded-xl px-3 py-3 text-[16px] font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {dict.nav.news}
              </Link>
            </div>
          </div>
        )}
      </header>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        locale={locale}
        dict={dict}
      />
    </>
  );
}
