/**
 * Enrich weak Haqqımızda pages: leadership photos, awards, brand, docs lists.
 */
import fs from "fs";
import { chromium } from "playwright";

const existing = JSON.parse(
  fs.readFileSync("src/lib/data/sectionPages.json", "utf8")
);

const ROUTES = [
  "/haqqimizda/rehberlik",
  "/haqqimizda/idareetme-ve-komiteler",
  "/haqqimizda/mukafatlar",
  "/haqqimizda/korporativ-sosial-mesuliyyet",
  "/haqqimizda/muxbir-banklar",
  "/haqqimizda/missiya-ve-strateji-baxis",
  "/haqqimizda/brend-merkezi",
  "/korporativ-teqdimat",
  "/haqqimizda/teklif-ve-iradlar",
  "/haqqimizda/senedler",
  "/haqqimizda/hesabatlar",
  "/haqqimizda/arasdirma",
  "/haqqimizda/satinalmalar/musabiqelerin-elani",
  "/haqqimizda/satinalmalar/bildirisler",
  "/haqqimizda/satinalmalar/baglanmis-muqavilelerin-reyestri",
  "/haqqimizda/satinalmalar/satinalma-plani",
  "/haqqimizda/satinalmalar/techizatci-anketi",
  "/haqqimizda/rekvizitler",
  "/haqqimizda/istirak-payi",
  "/standart-sertler-ve-melumatlandirma-formalari",
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  locale: "az-AZ",
});

for (let i = 0; i < ROUTES.length; i++) {
  const route = ROUTES[i];
  process.stdout.write(`[${i + 1}/${ROUTES.length}] ${route.split("/").pop()} ... `);
  try {
    await page.goto(`https://abb-bank.az${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(1600);
    await page.evaluate(async () => {
      for (let y = 0; y < 5000; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
    });

    const data = await page.evaluate(() => {
      const txt = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
      const clean = (u) => (u || "").split("?")[0];
      const BAD =
        /Fikirlərinizi|cookie|©|Karyera|ABB mobile yüklə|hüquqlar qorunur|Səhifəni dəyərləndirin/i;
      const NAV = /^(Fərdi|Biznes|Haqqımızda|AZ|EN|937|Xidmət şəbəkəsi)$/i;
      const main = document.querySelector("main") || document.body;
      const title = txt(main.querySelector("h1"));
      const ps = [...main.querySelectorAll("p")]
        .map(txt)
        .filter((t) => t.length > 25 && t.length < 800 && !BAD.test(t));

      // Collect all CDN images (prefer large)
      const imgs = [];
      for (const img of main.querySelectorAll("img")) {
        let url = clean(img.currentSrc || img.src);
        if (!url.includes("cdn.abb-bank.az")) continue;
        if (/Banner_ABB|Twitter|favicon|onelink/i.test(url)) continue;
        url = url.replace("/medium_", "/large_");
        if (!imgs.includes(url)) imgs.push(url);
      }
      const hero =
        imgs.find((u) => !/icon_/i.test(u) && !/\.svg$/i.test(u)) || null;
      const gallery = imgs.filter(
        (u) => u !== hero && !/\.svg$/i.test(u) && !/icon_/i.test(u)
      );

      // People / award cards: figure or card with img + name
      const cards = [];
      const containers = [
        ...main.querySelectorAll("article, li, figure, [class*='card'], [class*='Card']"),
      ];
      for (const el of containers) {
        const img = el.querySelector("img");
        if (!img) continue;
        let url = clean(img.currentSrc || img.src);
        if (!url.includes("cdn.abb-bank.az") || /Banner|Twitter|favicon/i.test(url))
          continue;
        if (/icon_/i.test(url) && (img.naturalWidth || 0) < 80) continue;
        url = url.replace("/medium_", "/large_");
        const nameEl = el.querySelector("h2, h3, h4, strong, p");
        const name = txt(nameEl);
        if (!name || name.length < 2 || name.length > 90 || NAV.test(name)) continue;
        const texts = [...el.querySelectorAll("p, span, h4")]
          .map(txt)
          .filter((t) => t && t !== name && t.length > 2 && t.length < 200 && !BAD.test(t));
        const role = texts[0] || "";
        if (!cards.some((c) => c.title === name || c.image === url)) {
          cards.push({ title: name, desc: role.slice(0, 240), image: url });
        }
        if (cards.length >= 16) break;
      }

      // Content sections
      const contentSections = [];
      for (const h of main.querySelectorAll("h2, h3")) {
        const ht = txt(h);
        if (!ht || ht.length < 4 || ht.length > 120 || NAV.test(ht) || /\?$/.test(ht))
          continue;
        let n = h.nextElementSibling;
        let desc = "";
        for (let k = 0; k < 8 && n; k++) {
          if (/^H[1-4]$/.test(n.tagName)) break;
          const t = txt(n);
          if (n.matches("p") && t.length > 30 && !BAD.test(t)) {
            desc = t;
            break;
          }
          const p = n.querySelector?.("p");
          if (p && txt(p).length > 30) {
            desc = txt(p);
            break;
          }
          n = n.nextElementSibling;
        }
        if (!desc) {
          const parent = h.closest("section, article, div");
          const near = [...(parent?.querySelectorAll("p") || [])]
            .map(txt)
            .find((t) => t.length > 40 && !BAD.test(t));
          if (near) desc = near;
        }
        if (desc && !contentSections.some((s) => s.title === ht)) {
          contentSections.push({ title: ht, desc: desc.slice(0, 800) });
        }
        if (contentSections.length >= 8) break;
      }

      if (!contentSections.length && ps.length) {
        ps.slice(0, 4).forEach((p, idx) => {
          const first = p.split(/[.!]/)[0].trim();
          contentSections.push({
            title:
              idx === 0
                ? title || "Ətraflı"
                : first.length <= 70
                  ? first
                  : first.slice(0, 60),
            desc: p.slice(0, 700),
          });
        });
      }

      // Document / list links as cards if no photo cards
      if (cards.length < 2) {
        for (const a of main.querySelectorAll("a")) {
          const t = txt(a);
          if (t.length < 8 || t.length > 100 || NAV.test(t)) continue;
          if (!/\.pdf|yüklə|endir|hesabat|tarif|siyasət|sənəd|plan|elan|bildiriş/i.test(t + (a.href || "")))
            continue;
          if (!cards.some((c) => c.title === t)) {
            cards.push({
              title: t,
              desc: "",
              image: gallery[cards.length] || hero || "",
            });
          }
          if (cards.length >= 8) break;
        }
      }

      if (cards.length < 2 && contentSections.length) {
        contentSections.forEach((s, idx) => {
          cards.push({
            title: s.title,
            desc: s.desc.slice(0, 260),
            image: gallery[idx] || hero || "",
          });
        });
      }

      return {
        title,
        description: ps[0] || "",
        heroImage: hero,
        gallery: gallery.slice(0, 20),
        cards: cards
          .filter((c) => c.title && !/^Əlavə məlumat/i.test(c.title))
          .slice(0, 16),
        contentSections: contentSections
          .filter((s) => !/^Əlavə məlumat/i.test(s.title))
          .slice(0, 8),
      };
    });

    const prev = existing[route] || { route, ok: true };
    const cards =
      data.cards.filter((c) => c.image).length >= 2
        ? data.cards.filter((c) => c.image || c.desc)
        : data.cards.length
          ? data.cards
          : prev.cards || [];

    existing[route] = {
      ...prev,
      title: data.title || prev.title,
      description: data.description || prev.description,
      heroImage: data.heroImage || prev.heroImage,
      gallery: data.gallery.length ? data.gallery : prev.gallery || [],
      cards,
      contentSections: data.contentSections.length
        ? data.contentSections
        : prev.contentSections || [],
      blocks: (data.contentSections.length
        ? data.contentSections
        : cards
      )
        .slice(0, 8)
        .map((s, idx) => ({
          title: s.title,
          desc: s.desc || "",
          image: cards[idx]?.image || data.gallery[idx] || data.heroImage || "",
        })),
      ok: true,
    };

    console.log(
      `OK img=${(existing[route].gallery || []).length} cards=${existing[route].cards.length} secs=${existing[route].contentSections.length}`
    );
  } catch (e) {
    console.log("ERR", e.message);
  }
}

fs.writeFileSync(
  "src/lib/data/sectionPages.json",
  JSON.stringify(existing, null, 2),
  "utf8"
);
console.log("DONE enrich haqqimizda", ROUTES.length);
await browser.close();
