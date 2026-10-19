/**
 * Playwright enrich for pages that still lack real cards after cleanup.
 * Filters out footer/nav pollution. Prefers large_ CDN images.
 */
import fs from "fs";
import { chromium } from "playwright";

const SKIP =
  /Banner_ABB_Mobile|onelinkto|favicon|Twitter_|Youtube_|Instagram_|Facebook_|Linkedin_|apple-touch|image_506_edd0057a05|qr_/i;
const BAD =
  /Fikirlərinizi|cookie|©|hüquqlar qorunur|Karyera|Səhifəni dəyərləndirin|ABB mobile yükləmək|Mobil nömrə|FİN kod|Davam et|razılıq verirəm/i;
const NAV =
  /^(Fərdi|Biznes|Haqqımızda|İnvestorlarla əlaqə|Xəbərlər|AZ|EN|937|Xidmət şəbəkəsi|Ödəniş|FAQ|Ana səhifə|ABB|Randevu|ABB mobile|24\/7 məlumat mərkəzi|Arayış sifarişi|Kredit ödənişi|Karta mədaxil|Pul köçürmələri|Cash by code|İanə edin|PIN-kodu dəyişin|Sığorta|İnvestisiya)$/i;
const POLLUTED =
  /^(Tariflər|Siyasətlərimiz|Hesabatlar|Satınalmalar|Araşdırma|Brend|Hüquqi|Təklif|Korporativ təqdimat|İdarəetmə|Bütün kreditlər|Kartlar|Əmanətlər|Keşbek|Kampaniyalar)/i;

function toLarge(url) {
  if (!url || !url.includes("cdn.abb-bank.az")) return url;
  if (/\/(large_|icon_|small_)/i.test(url) || /\.svg$/i.test(url)) return url;
  if (/\/medium_/i.test(url)) return url.replace("/medium_", "/large_");
  return url.replace("cdn.abb-bank.az/", "cdn.abb-bank.az/large_");
}

function score(x) {
  if (!x) return 0;
  let s = 0;
  if (x.heroImage) s += 2;
  if ((x.description || "").length > 60) s += 2;
  const goodCards = (x.cards || []).filter(
    (c) => c.image && (c.desc || "").length > 25 && !POLLUTED.test(c.title || "")
  ).length;
  s += Math.min(goodCards, 4);
  s += Math.min(x.contentSections?.length || 0, 3);
  if ((x.faqs || []).filter((f) => (f.a || "").length > 30).length >= 2) s += 2;
  if ((x.stepDetails || []).length >= 2) s += 2;
  return s;
}

function better(a, b) {
  const aa = Array.isArray(a) ? a : [];
  const bb = Array.isArray(b) ? b : [];
  if (!bb.length) return aa;
  if (!aa.length) return bb;
  const q = (arr) =>
    arr.reduce((n, c) => {
      if (c?.image) n += 2;
      if ((c?.desc || c?.a || "").length > 30) n += 2;
      if ((c?.title || c?.q || "").length > 3) n += 1;
      return n;
    }, 0);
  return q(bb) >= q(aa) ? bb : aa;
}

const existing = JSON.parse(
  fs.readFileSync("src/lib/data/sectionPages.json", "utf8")
);

const mega = fs.readFileSync("src/lib/data/megaMenu.ts", "utf8");
const hrefs = [
  ...new Set(
    [...mega.matchAll(/href:\s*["']([^"']+)["']/g)]
      .map((m) => m[1])
      .filter((h) => !h.startsWith("http"))
  ),
];

const ROUTES = hrefs
  .filter((h) => {
    const x = existing[h];
    const goodCards = (x?.cards || []).filter(
      (c) =>
        c.image && (c.desc || "").length > 25 && !POLLUTED.test(c.title || "")
    ).length;
    return score(x) < 9 || goodCards < 2;
  })
  .sort((a, b) => score(existing[a]) - score(existing[b]));

console.log("Playwright enrich:", ROUTES.length, "routes");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  locale: "az-AZ",
});

const updated = [];

for (let i = 0; i < ROUTES.length; i++) {
  const route = ROUTES[i];
  process.stdout.write(`[${i + 1}/${ROUTES.length}] ${route} ... `);
  try {
    await page.goto(`https://abb-bank.az${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(1800);
    for (const y of [800, 1800, 3000, 4200]) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(250);
    }
    try {
      const faqTab = page.getByRole("button", { name: /^FAQ$/i });
      if (await faqTab.count()) await faqTab.first().click({ timeout: 800 });
    } catch {
      /* */
    }

    const data = await page.evaluate(
      async ({ skipSrc, navSrc, badSrc, pollutedSrc }) => {
        const SKIP = new RegExp(skipSrc, "i");
        const NAV = new RegExp(navSrc, "i");
        const BAD = new RegExp(badSrc, "i");
        const POLLUTED = new RegExp(pollutedSrc, "i");
        const txt = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
        const clean = (u) => (u || "").split("?")[0];

        const main = document.querySelector("main") || document.body;
        const title = txt(main.querySelector("h1")) || "";

        const paragraphs = [...main.querySelectorAll("p")]
          .map(txt)
          .filter((t) => t.length > 35 && t.length < 700 && !BAD.test(t));
        const description =
          paragraphs.find((t) =>
            /AZN|kredit|faiz|əmanət|kart|keşbek|hesab|bank|onlayn|depozit|ödəniş|biznes|randevu|arayış|köçürm|sığorta|invest|sənəd|hesabat|siyasət|müxbir|rekvizit/i.test(
              t
            )
          ) ||
          paragraphs[0] ||
          "";

        const imgs = [];
        for (const img of main.querySelectorAll("img")) {
          const url = clean(img.currentSrc || img.src);
          if (!url.includes("cdn.abb-bank.az") || SKIP.test(url)) continue;
          if (/icon_/i.test(url)) continue;
          imgs.push({ url, w: img.naturalWidth || 0, h: img.naturalHeight || 0 });
        }
        imgs.sort((a, b) => b.w * b.h - a.w * a.h);
        const heroImage =
          imgs.find((i) => i.w >= 300 && !/\.svg$/i.test(i.url))?.url ||
          imgs[0]?.url ||
          null;
        const gallery = [
          ...new Set(
            imgs.map((i) => i.url).filter((u) => u !== heroImage && !/\.svg$/i.test(u))
          ),
        ].slice(0, 16);

        // Advantage / feature cards with paired image
        const cards = [];
        const nodes = [...main.querySelectorAll("h3, h4, p, span")].filter((el) => {
          const t = txt(el);
          return (
            t.length >= 4 &&
            t.length <= 90 &&
            !/\?$/.test(t) &&
            !NAV.test(t) &&
            !BAD.test(t) &&
            !POLLUTED.test(t) &&
            el.children.length <= 1
          );
        });

        for (const node of nodes) {
          const titleText = txt(node);
          let root = node.parentElement;
          let found = null;
          for (let d = 0; d < 8 && root; d++) {
            // skip footer
            if (root.closest("footer")) break;
            const localImgs = [...root.querySelectorAll("img")]
              .map((img) => ({
                url: clean(img.currentSrc || img.src),
                w: img.naturalWidth || 0,
              }))
              .filter(
                (x) =>
                  x.url.includes("cdn.abb-bank.az") &&
                  !SKIP.test(x.url) &&
                  !/icon_/i.test(x.url) &&
                  x.w >= 70
              );
            const unique = [...new Map(localImgs.map((x) => [x.url, x])).values()];
            if (unique.length === 1) {
              const descs = [...root.querySelectorAll("p")]
                .map(txt)
                .filter(
                  (t) =>
                    t !== titleText &&
                    t.length > 25 &&
                    t.length < 320 &&
                    !BAD.test(t) &&
                    !POLLUTED.test(t)
                );
              found = {
                title: titleText,
                desc: (descs[0] || "").slice(0, 300),
                image: unique[0].url,
              };
              break;
            }
            root = root.parentElement;
          }
          if (
            found &&
            found.desc &&
            !POLLUTED.test(found.title) &&
            !cards.some((c) => c.title === found.title || c.image === found.image)
          ) {
            cards.push(found);
          }
          if (cards.length >= 8) break;
        }

        // Online services sibling list → cards with hero
        if (cards.length < 2) {
          const serviceLinks = [
            ...main.querySelectorAll("a[href*='/ferdi/'], a[href*='/abb-']"),
          ];
          for (const a of serviceLinks) {
            if (a.closest("footer") || a.closest("header")) continue;
            const t = txt(a);
            const href = a.getAttribute("href") || "";
            if (!t || t.length < 4 || t.length > 60 || NAV.test(t) || POLLUTED.test(t))
              continue;
            if (!cards.some((c) => c.title === t)) {
              cards.push({
                title: t,
                desc: "Onlayn xidmətə keçid",
                image: gallery[cards.length] || heroImage || "",
                href: href.startsWith("http") ? href : href,
              });
            }
            if (cards.length >= 8) break;
          }
        }

        // Content sections
        const contentSections = [];
        for (const h of main.querySelectorAll("h2")) {
          if (h.closest("footer")) continue;
          const hTitle = txt(h);
          if (!hTitle || hTitle.length < 6 || NAV.test(hTitle) || /\?$/.test(hTitle))
            continue;
          if (/üstünlük|planınız|addım|ABB mobile-dan|Tez-tez|Səhifəni/i.test(hTitle))
            continue;
          let n = h.nextElementSibling;
          let desc = "";
          for (let k = 0; k < 8 && n; k++) {
            if (/^H[1-4]$/.test(n.tagName)) break;
            const t = txt(n);
            if (n.matches("p") && t.length > 50 && !BAD.test(t)) {
              desc = t;
              break;
            }
            const p = n.querySelector?.("p");
            if (p && txt(p).length > 50) {
              desc = txt(p);
              break;
            }
            n = n.nextElementSibling;
          }
          if (desc) contentSections.push({ title: hTitle, desc: desc.slice(0, 900) });
          if (contentSections.length >= 6) break;
        }

        // Steps
        const stepDetails = [];
        for (const h of main.querySelectorAll("h3")) {
          if (h.closest("footer")) continue;
          const hTitle = txt(h);
          if (!hTitle || hTitle.length < 8 || hTitle.length > 100) continue;
          if (
            !/daxil olun|klik|seçin|toxun|sifariş|təsdiq|alın|açın|başla|müraciət|addım|yükləyin/i.test(
              hTitle
            )
          )
            continue;
          const desc =
            [...(h.parentElement?.querySelectorAll("p") || [])]
              .map(txt)
              .find((t) => t.length > 15 && t.length < 260) || "";
          stepDetails.push({ title: hTitle, desc: desc.slice(0, 220) });
          if (stepDetails.length >= 4) break;
        }

        // FAQ
        const faqs = [];
        for (const btn of document.querySelectorAll("button")) {
          const q0 = txt(btn).replace(/\+$/, "").trim();
          if (!/\?/.test(q0) || q0.length < 12 || q0.length > 180) continue;
          try {
            btn.click();
          } catch {
            /* */
          }
          await new Promise((r) => setTimeout(r, 80));
          const item =
            btn.closest('[class*="border-b"], details, li, div') || btn.parentElement;
          const full = txt(item);
          const q = q0.match(/^[^?]{8,140}\?/)?.[0] || q0.split("?")[0] + "?";
          let a = full.startsWith(q)
            ? full.slice(q.length).trim()
            : full.replace(q, "").trim();
          a = a.replace(/\s+/g, " ").replace(/\+$/, "").trim();
          if (a.length > 30 && !faqs.some((f) => f.q === q)) {
            faqs.push({ q, a: a.slice(0, 700) });
          }
          if (faqs.length >= 14) break;
        }

        // Doc / PDF list for about pages
        const docs = [];
        for (const a of main.querySelectorAll("a[href]")) {
          if (a.closest("footer") || a.closest("header")) continue;
          const href = a.getAttribute("href") || "";
          const t = txt(a);
          if (
            t.length > 10 &&
            t.length < 140 &&
            !POLLUTED.test(t) &&
            (/\.pdf/i.test(href) || /hesabat|siyasət|qayda|tarif|müqavilə|anket/i.test(t))
          ) {
            docs.push({
              title: t,
              desc: "Rəsmi sənəd / material",
              image: gallery[docs.length] || heroImage || "",
              href: href.startsWith("http")
                ? href
                : href.startsWith("/")
                  ? href
                  : `/${href}`,
            });
          }
          if (docs.length >= 10) break;
        }

        const cta =
          [...main.querySelectorAll("a,button")]
            .map(txt)
            .find(
              (t) =>
                /sifariş et|müraciət|hesab aç|ətraflı|əldə et|indi al|başla|əlaqə|randevu|ödə|yüklə/i.test(
                  t
                ) &&
                t.length < 40 &&
                !/tətbiqi yüklə/i.test(t)
            ) || "Ətraflı";

        return {
          title,
          description,
          cta,
          heroImage,
          gallery,
          cards: cards.length ? cards : docs,
          contentSections,
          stepDetails,
          steps: stepDetails.map((s) => s.title),
          faqs,
          stats: [],
        };
      },
      {
        skipSrc: SKIP.source,
        navSrc: NAV.source,
        badSrc: BAD.source,
        pollutedSrc: POLLUTED.source,
      }
    );

    data.heroImage = data.heroImage ? toLarge(data.heroImage) : null;
    data.gallery = (data.gallery || []).map(toLarge);
    data.cards = (data.cards || [])
      .filter((c) => c.title && !POLLUTED.test(c.title) && !NAV.test(c.title))
      .map((c) => ({ ...c, image: c.image ? toLarge(c.image) : c.image }));

    const prev = existing[route] || { route };
    const before = score(prev);

    const merged = {
      ...prev,
      route,
      ok: true,
      title:
        data.title && data.title.length > 3 && data.title.length < 140
          ? data.title
          : prev.title || route,
      description:
        (data.description || "").length > (prev.description || "").length
          ? data.description
          : prev.description || data.description || "",
      cta: data.cta || prev.cta || "Ətraflı",
      heroImage: data.heroImage || prev.heroImage || null,
      gallery: better(prev.gallery, data.gallery),
      cards: better(
        (prev.cards || []).filter((c) => !POLLUTED.test(c.title || "")),
        data.cards
      ),
      contentSections: better(prev.contentSections, data.contentSections),
      stepDetails: better(prev.stepDetails, data.stepDetails),
      steps: better(prev.steps, data.steps),
      faqs: better(prev.faqs, data.faqs),
      stats: prev.stats || [],
    };

    if (merged.contentSections?.length) {
      merged.blocks = merged.contentSections.slice(0, 6).map((s, idx) => ({
        title: s.title,
        desc: s.desc,
        image: merged.gallery[idx] || merged.heroImage || "",
      }));
    }

    existing[route] = merged;
    const after = score(merged);
    const changed =
      after > before ||
      (merged.cards?.length || 0) >
        (prev.cards || []).filter((c) => !POLLUTED.test(c.title || "")).length ||
      (merged.description || "").length > (prev.description || "").length + 15;

    if (changed) {
      updated.push({
        route,
        before,
        after,
        cards: merged.cards?.length || 0,
        faqs: merged.faqs?.length || 0,
        title: merged.title,
      });
      console.log(
        `UPD ${before}→${after} c=${merged.cards?.length || 0} f=${merged.faqs?.length || 0}`
      );
    } else {
      console.log(`same ${after}`);
    }
  } catch (e) {
    console.log("ERR", e.message);
  }
}

fs.writeFileSync(
  "src/lib/data/sectionPages.json",
  JSON.stringify(existing, null, 2),
  "utf8"
);
fs.writeFileSync(
  "scripts/_enrich-pw-report.json",
  JSON.stringify({ updated, total: ROUTES.length }, null, 2)
);
console.log("\nUpdated:", updated.length);
updated.forEach((u) => console.log(" -", u.route));
await browser.close();
