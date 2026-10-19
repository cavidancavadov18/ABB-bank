import { flattenMegaLinks, type MegaMenuKey } from "@/lib/data/megaMenu";
import { newsItems } from "@/lib/data/news";
import type { Locale } from "@/lib/i18n/types";

export type SearchHit = {
  href: string;
  label: string;
  group: string;
};

const EXTRA: { href: string; az: string; en: string; groupAz: string; groupEn: string }[] =
  [
    { href: "/", az: "Ana səhifə", en: "Home", groupAz: "Ümumi", groupEn: "General" },
    {
      href: "/filiallar",
      az: "Filiallar və ATM-lər",
      en: "Branches & ATMs",
      groupAz: "Xidmət şəbəkəsi",
      groupEn: "Network",
    },
    {
      href: "/xeberler",
      az: "Xəbərlər",
      en: "News",
      groupAz: "Ümumi",
      groupEn: "General",
    },
    {
      href: "/investorlarla-elaqe",
      az: "İnvestorlarla əlaqə",
      en: "Investor relations",
      groupAz: "Ümumi",
      groupEn: "General",
    },
    {
      href: "/abb-mobile",
      az: "ABB mobile",
      en: "ABB mobile",
      groupAz: "Onlayn",
      groupEn: "Online",
    },
    {
      href: "/abb-esim",
      az: "ABB-eSIM",
      en: "ABB-eSIM",
      groupAz: "Onlayn",
      groupEn: "Online",
    },
    {
      href: "/faydali-linkler",
      az: "Faydalı linklər",
      en: "Useful links",
      groupAz: "Ümumi",
      groupEn: "General",
    },
  ];

const GROUP: Record<MegaMenuKey, { az: string; en: string }> = {
  personal: { az: "Fərdi", en: "Personal" },
  business: { az: "Biznes", en: "Business" },
  about: { az: "Haqqımızda", en: "About" },
};

export function buildSearchIndex(locale: Locale): SearchHit[] {
  const hits: SearchHit[] = [];
  const seen = new Set<string>();

  const push = (href: string, label: string, group: string) => {
    const key = `${href}::${label}`;
    if (seen.has(key) || !label.trim()) return;
    seen.add(key);
    hits.push({ href, label, group });
  };

  for (const e of EXTRA) {
    push(
      `/${locale}${e.href === "/" ? "" : e.href}`,
      locale === "az" ? e.az : e.en,
      locale === "az" ? e.groupAz : e.groupEn
    );
  }

  for (const key of ["personal", "business", "about"] as MegaMenuKey[]) {
    const g = GROUP[key];
    for (const link of flattenMegaLinks(key)) {
      if (link.external) continue;
      const path = link.href.startsWith("/") ? link.href : `/${link.href}`;
      push(
        `/${locale}${path}`,
        locale === "az" ? link.az : link.en,
        locale === "az" ? g.az : g.en
      );
    }
  }

  for (const item of newsItems) {
    push(
      `/${locale}${item.href}`,
      item.title[locale],
      locale === "az" ? "Xəbərlər" : "News"
    );
  }

  return hits;
}

export function searchSite(locale: Locale, query: string, limit = 24): SearchHit[] {
  const q = query.trim().toLowerCase();
  const all = buildSearchIndex(locale);
  if (!q) return all.slice(0, limit);
  return all
    .filter(
      (h) =>
        h.label.toLowerCase().includes(q) ||
        h.group.toLowerCase().includes(q) ||
        h.href.toLowerCase().includes(q)
    )
    .slice(0, limit);
}
