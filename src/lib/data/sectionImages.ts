import raw from "./sectionImages.json";

export type SectionMedia = { image: string; gallery: string[] };

type RawMedia = {
  image?: string | null;
  gallery?: (string | null)[];
  logos?: string[];
};

const FALLBACK: SectionMedia = {
  image: "https://cdn.abb-bank.az/v30000_1_88847b9b69.png",
  gallery: [],
};

export const sectionImages = raw as Record<string, RawMedia>;

function upgradeCdn(url: string) {
  if (!url?.includes("cdn.abb-bank.az")) return url;
  if (/\.svg($|\?)/i.test(url) || /\/(icon_|small_|large_)/i.test(url)) {
    return url.replace("/medium_", "/large_");
  }
  if (/\/medium_/i.test(url)) return url.replace("/medium_", "/large_");
  return url.replace("cdn.abb-bank.az/", "cdn.abb-bank.az/large_");
}

function normalizeMedia(m: RawMedia | undefined): SectionMedia | null {
  if (!m?.image) return null;
  return {
    image: upgradeCdn(m.image),
    gallery: (m.gallery || [])
      .filter((u): u is string => Boolean(u))
      .map(upgradeCdn),
  };
}

export function getSectionMedia(path: string): SectionMedia {
  const clean = path.replace(/\\/g, "/").replace(/\/$/, "") || "/";
  const direct = normalizeMedia(sectionImages[clean]);
  if (direct) return direct;

  const parts = clean.split("/").filter(Boolean);
  while (parts.length) {
    parts.pop();
    const key = "/" + parts.join("/");
    if (key !== "/") {
      const hit = normalizeMedia(sectionImages[key]);
      if (hit) return hit;
    }
  }

  return normalizeMedia(sectionImages["/ferdi"]) ?? FALLBACK;
}
