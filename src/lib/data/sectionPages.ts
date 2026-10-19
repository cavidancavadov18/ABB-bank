import raw from "./sectionPages.json";
import { getSectionMedia } from "./sectionImages";

export type SectionStat = { value: string; label: string };
export type SectionCard = {
  title: string;
  desc: string;
  image: string;
  href?: string;
};
export type SectionPlan = { title: string; desc: string; image?: string };
export type SectionBlock = { title: string; desc: string; image: string };
export type SectionFaq = { q: string; a: string };
export type SectionStep = { title: string; desc: string };
export type ContentSection = { title: string; desc: string };

export type SectionPage = {
  route: string;
  ok?: boolean;
  title: string;
  description: string;
  subtitle?: string;
  cta: string;
  ctaHref?: string;
  ctaSecondary?: string;
  heroImage: string | null;
  gallery: string[];
  logos: string[];
  stats: SectionStat[];
  cards: SectionCard[];
  plans: SectionPlan[];
  steps: string[];
  stepDetails: SectionStep[];
  /** Phone / mockup image for dark steps frame */
  stepsImage?: string | null;
  faqs: SectionFaq[];
  contentSections: ContentSection[];
  subSections: ContentSection[];
  features: string[];
  sections: string[];
  blocks: SectionBlock[];
  breadcrumbs: string[];
};

const pages = raw as Record<string, Partial<SectionPage> & { ok?: boolean; faqs?: Array<string | SectionFaq> }>;

/** Prefer full-res CDN assets (`large_…`); keep svg/icons as-is. */
function normalizeUrl(url: string | null | undefined) {
  if (!url) return null;
  if (!url.includes("cdn.abb-bank.az")) return url;
  if (/\.svg($|\?)/i.test(url)) return url;
  if (/\/(icon_|small_)/i.test(url)) return url;
  // Capital-I `Image_*` category tiles often have no `large_` twin (403)
  if (/\/Image_/.test(url)) return url.replace("/large_Image_", "/Image_");
  if (/\/medium_/i.test(url)) return url.replace("/medium_", "/large_");
  if (/\/large_/i.test(url)) return url;
  return url.replace("cdn.abb-bank.az/", "cdn.abb-bank.az/large_");
}

function normalizeFaqs(
  faqs: Array<string | SectionFaq> | undefined
): SectionFaq[] {
  if (!faqs?.length) return [];
  return faqs.map((f) =>
    typeof f === "string" ? { q: f, a: "" } : { q: f.q, a: f.a || "" }
  );
}

export function getSectionPage(path: string, fallbackTitle?: string): SectionPage {
  const clean = path.replace(/\\/g, "/").replace(/\/$/, "") || "/";
  const hit = pages[clean];
  const media = getSectionMedia(clean);

  const heroImage =
    normalizeUrl(hit?.heroImage) ||
    media.image ||
    "https://cdn.abb-bank.az/v30000_1_88847b9b69.png";

  const cards: SectionCard[] = (hit?.cards || [])
    .filter((c) => c?.title)
    .map((c) => ({
      title: c.title,
      desc: c.desc || "",
      image: normalizeUrl(c.image) || media.gallery[0] || heroImage || "",
      href: (c as SectionCard).href || undefined,
    }))
    .filter((c) => c.image);

  const gallery = [...(hit?.gallery || []), ...media.gallery]
    .map((g) => normalizeUrl(g) || g)
    .filter((g): g is string => Boolean(g) && g !== heroImage)
    .filter((g, i, arr) => arr.indexOf(g) === i)
    .slice(0, 14);

  const contentSections = hit?.contentSections || [];
  const blocks =
    hit?.blocks?.length && hit.blocks.some((b) => b.desc && b.desc.length > 80)
      ? hit.blocks.map((b) => ({
          ...b,
          image: normalizeUrl(b.image) || b.image || heroImage || "",
        }))
      : contentSections.map((s, i) => ({
          title: s.title,
          desc: s.desc,
          image: normalizeUrl(gallery[i]) || heroImage || "",
        }));

  return {
    route: clean,
    ok: hit?.ok !== false,
    title: hit?.title || fallbackTitle || clean.split("/").filter(Boolean).pop() || "ABB",
    description: hit?.description || "",
    subtitle: hit?.subtitle || "",
    cta: hit?.cta || "Ətraflı",
    ctaHref: hit?.ctaHref || undefined,
    ctaSecondary: hit?.ctaSecondary || undefined,
    heroImage,
    gallery,
    logos: (hit?.logos || []).slice(0, 12),
    stats: (hit?.stats || []).slice(0, 4),
    cards,
    plans: (hit?.plans || []).map((pl) => ({
      title: pl.title,
      desc: pl.desc,
      image: pl.image ? normalizeUrl(pl.image) || pl.image : undefined,
    })),
    steps: hit?.steps || [],
    stepDetails: hit?.stepDetails || [],
    stepsImage: normalizeUrl(
      (hit as { stepsImage?: string })?.stepsImage
    ),
    faqs: normalizeFaqs(hit?.faqs),
    contentSections,
    subSections: hit?.subSections || [],
    features: hit?.features || cards.map((c) => c.title),
    sections: hit?.sections || [],
    blocks,
    breadcrumbs: hit?.breadcrumbs || [],
  };
}
