/**
 * Re-extract feature titles/descs for Biznes product pages (cards, trade finance, etc.)
 */
import fs from "fs";
import { chromium } from "playwright";

const existing = JSON.parse(
  fs.readFileSync("src/lib/data/sectionPages.json", "utf8")
);

const ROUTES = Object.keys(existing).filter(
  (r) =>
    r.includes("/odenis-kartlari-1/") ||
    r.includes("/senedli-emeliyyatlar-1/") ||
    r.includes("/korporativ-kreditler/") ||
    r.endsWith("/islam-bankcilig") ||
    r.endsWith("/ani-odenis-sistemi") ||
    r.endsWith("/pul-kocurmeleri-1") ||
    r.endsWith("/hesablar-1") ||
    r.endsWith("/odenis-kartlari-1")
);

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
    await page.waitForTimeout(1400);
    await page.evaluate(async () => {
      for (let y = 0; y < 3500; y += 800) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
    });

    const data = await page.evaluate(() => {
      const txt = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
      const clean = (u) => (u || "").split("?")[0];
      const BAD =
        /Fikirlərinizi|cookie|©|Karyera|ABB mobile yüklə|hüquqlar|Səhifəni dəyərləndirin/i;
      const NAV = /^(Fərdi|Biznes|Haqqımızda|AZ|EN|937|Xidmət şəbəkəsi)$/i;
      const main = document.querySelector("main") || document.body;
      const title = txt(main.querySelector("h1"));
      const ps = [...main.querySelectorAll("p")]
        .map(txt)
        .filter((t) => t.length > 35 && t.length < 700 && !BAD.test(t));

      const features = [];
      for (const img of main.querySelectorAll("img")) {
        let url = clean(img.currentSrc || img.src);
        if (!url.includes("cdn.abb-bank.az")) continue;
        if (/Banner|Twitter|favicon|logo_/i.test(url)) continue;
        const isIcon =
          /icon_/i.test(url) ||
          url.includes("/small_") ||
          (img.naturalWidth > 0 && img.naturalWidth < 100);
        if (!isIcon) continue;

        let root = img.closest("div,li,article") || img.parentElement;
        for (let d = 0; d < 5 && root; d++) {
          const texts = [...root.querySelectorAll("p,h3,h4,span")]
            .map(txt)
            .filter((t) => t.length > 3);
          const shortT = texts.find(
            (t) =>
              t.length >= 4 &&
              t.length <= 70 &&
              !NAV.test(t) &&
              !BAD.test(t) &&
              !/\?$/.test(t)
          );
          const longT = texts.find(
            (t) =>
              t !== shortT && t.length > 40 && t.length < 350 && !BAD.test(t)
          );
          if (shortT && longT && !features.some((f) => f.title === shortT)) {
            features.push({
              title: shortT,
              desc: longT.slice(0, 300),
              image: url.replace("/medium_", "/large_"),
            });
          }
          if (features.length >= 6) break;
          root = root.parentElement;
        }
        if (features.length >= 6) break;
      }

      const contentSections = [];
      for (const h of main.querySelectorAll("h2, h3")) {
        const ht = txt(h);
        if (!ht || ht.length < 6 || ht.length > 110 || NAV.test(ht)) continue;
        if (/\?$/.test(ht) || /Əlavə məlumat/i.test(ht)) continue;
        let n = h.nextElementSibling;
        let desc = "";
        for (let k = 0; k < 8 && n; k++) {
          if (/^H[1-4]$/.test(n.tagName)) break;
          const t = txt(n);
          if (n.matches("p") && t.length > 40 && !BAD.test(t)) {
            desc = t;
            break;
          }
          const p = n.querySelector?.("p");
          if (p && txt(p).length > 40) {
            desc = txt(p);
            break;
          }
          n = n.nextElementSibling;
        }
        if (desc && !contentSections.some((s) => s.title === ht)) {
          contentSections.push({ title: ht, desc: desc.slice(0, 700) });
        }
        if (contentSections.length >= 6) break;
      }

      const imgs = [];
      for (const img of main.querySelectorAll("img")) {
        let url = clean(img.currentSrc || img.src);
        if (!url.includes("cdn.abb-bank.az")) continue;
        if (/Banner_ABB|Twitter|favicon|icon_/i.test(url)) continue;
        if (img.naturalWidth > 0 && img.naturalWidth < 120 && !/large_/i.test(url))
          continue;
        url = url.replace("/medium_", "/large_");
        if (!imgs.includes(url)) imgs.push(url);
      }
      const hero = imgs[0] || null;
      const gallery = imgs.slice(1, 14);

      let cards = features.map((f, i) => ({
        title: f.title,
        desc: f.desc,
        image: gallery[i] || hero || f.image,
      }));

      if (!cards.length && contentSections.length) {
        cards = contentSections.map((s, i) => ({
          title: s.title,
          desc: s.desc.slice(0, 280),
          image: gallery[i] || hero || "",
        }));
      }

      if (!cards.length) {
        // Derive short titles from first clause of each paragraph
        cards = ps.slice(0, 4).map((p, i) => {
          const first = p.split(/[.!]/)[0].trim();
          const shortTitle =
            first.length > 8 && first.length <= 60
              ? first
              : first.slice(0, 50) || title || "Üstünlük";
          return {
            title: shortTitle.slice(0, 60),
            desc: p.slice(0, 280),
            image: gallery[i] || hero || "",
          };
        });
      }

      cards = cards.filter((c) => c.image && c.title && !/Əlavə məlumat/i.test(c.title));

      return {
        title,
        description: ps[0] || "",
        heroImage: hero,
        gallery,
        cards: cards.slice(0, 6),
        contentSections: (
          contentSections.length
            ? contentSections
            : cards.map((c) => ({ title: c.title, desc: c.desc }))
        ).filter((s) => !/Əlavə məlumat/i.test(s.title)),
      };
    });

    const prev = existing[route] || {};
    existing[route] = {
      ...prev,
      title: data.title || prev.title,
      description: data.description || prev.description,
      heroImage: data.heroImage || prev.heroImage,
      gallery: data.gallery.length ? data.gallery : prev.gallery || [],
      cards: data.cards.length ? data.cards : prev.cards || [],
      contentSections: data.contentSections.length
        ? data.contentSections
        : (prev.contentSections || []).filter(
            (s) => !/Əlavə məlumat/i.test(s.title)
          ),
      blocks: (data.contentSections.length
        ? data.contentSections
        : data.cards
      )
        .slice(0, 6)
        .map((s, idx) => ({
          title: s.title,
          desc: s.desc,
          image:
            data.cards[idx]?.image ||
            data.gallery[idx] ||
            data.heroImage ||
            "",
        })),
      ok: true,
    };

    console.log(
      `OK cards=${existing[route].cards.length} t0=${(existing[route].cards[0]?.title || "").slice(0, 40)}`
    );
  } catch (e) {
    console.log("ERR", e.message);
  }
}

// Strip generic leftovers everywhere under /biznes
for (const [r, x] of Object.entries(existing)) {
  if (!r.startsWith("/biznes")) continue;
  if (x.cards) {
    x.cards = x.cards.filter((c) => !/^Əlavə məlumat/i.test(c.title || ""));
  }
  if (x.contentSections) {
    x.contentSections = x.contentSections.filter(
      (s) => !/^Əlavə məlumat/i.test(s.title || "")
    );
  }
  if (x.blocks) {
    x.blocks = x.blocks.filter((b) => !/^Əlavə məlumat/i.test(b.title || ""));
  }
}

fs.writeFileSync(
  "src/lib/data/sectionPages.json",
  JSON.stringify(existing, null, 2),
  "utf8"
);
console.log("DONE enrich", ROUTES.length);
await browser.close();
