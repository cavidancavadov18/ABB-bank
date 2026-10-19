"use client";

import Link from "next/link";
import { megaMenus, type MegaLink, type MegaMenuKey } from "@/lib/data/megaMenu";
import type { Locale } from "@/lib/i18n/types";

type Props = {
  menuKey: MegaMenuKey;
  locale: Locale;
  onNavigate: () => void;
};

function hrefFor(locale: Locale, link: MegaLink) {
  if (link.external || link.href.startsWith("http")) return link.href;
  return `/${locale}${link.href}`;
}

export function MegaMenu({ menuKey, locale, onNavigate: _onNavigate }: Props) {
  void _onNavigate;
  const columns = megaMenus[menuKey];

  return (
    <div className="mega-menu-shell">
      <div
        className="mega-menu-grid"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(200px, 1fr))` }}
      >
        {columns.map((col, i) => (
          <div key={i} className="mega-col">
            {col.blocks.map((block, bi) => (
              <div key={bi} className="mega-block">
                {block.title && (
                  <MenuAnchor locale={locale} link={block.title} className="mega-col-title" />
                )}
                {block.items?.map((item) => (
                  <MenuAnchor
                    key={item.href + item.az}
                    locale={locale}
                    link={item}
                    className="mega-col-link"
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuAnchor({
  locale,
  link,
  className,
}: {
  locale: Locale;
  link: MegaLink;
  className: string;
}) {
  const href = hrefFor(locale, link);
  const label = link[locale];

  if (link.external || href.startsWith("http")) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }

  // No onClick close — pathname change closes menu; avoids killing navigation
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
