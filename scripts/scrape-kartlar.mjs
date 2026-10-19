import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto("https://abb-bank.az/ferdi/kartlar", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForTimeout(2000);
for (const y of [400, 900, 1500, 2200, 3000]) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(250);
}

try {
  const faqTab = page.getByRole("button", { name: /^FAQ$/i });
  if (await faqTab.count()) await faqTab.first().click({ timeout: 800 });
} catch {
  /* */
}

const data = await page.evaluate(async () => {
  const txt = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
  const clean = (u) => (u || "").split("?")[0];
  const main = document.querySelector("main") || document.body;

  const title = txt(main.querySelector("h1")) || "";
  const paragraphs = [...main.querySelectorAll("p")]
    .map(txt)
    .filter((t) => t.length > 20 && t.length < 400);
  const description =
    paragraphs.find((t) => /kart|üstünlük|rəqəmsal|DigiCard/i.test(t)) ||
    paragraphs[0] ||
    "";

  const cta =
    [...main.querySelectorAll("a,button")]
      .map(txt)
      .find(
        (t) =>
          /sifariş|ətraflı|əldə et|müraciət/i.test(t) &&
          t.length < 40 &&
          !/tətbiqi yüklə/i.test(t)
      ) || "Ətraflı";

  // Hero image: largest near h1
  const h1 = main.querySelector("h1");
  let heroRoot = h1?.parentElement;
  for (let i = 0; i < 6 && heroRoot; i++) {
    if (heroRoot.querySelectorAll("img").length) break;
    heroRoot = heroRoot.parentElement;
  }
  const heroImgs = [...(heroRoot || main).querySelectorAll("img")]
    .map((img) => ({
      url: clean(img.currentSrc || img.src),
      w: img.naturalWidth || 0,
    }))
    .filter((x) => x.url.includes("cdn.abb-bank.az") && x.w >= 200);
  heroImgs.sort((a, b) => b.w - a.w);
  const heroImage = heroImgs[0]?.url || null;

  // Card category tiles: title + one image in same card
  const cards = [];
  const titleNodes = [...main.querySelectorAll("p, h3, h4, a, span")].filter(
    (el) => {
      const t = txt(el);
      return (
        t.length >= 4 &&
        t.length <= 60 &&
        /kart/i.test(t) &&
        !/\?$/.test(t) &&
        el.children.length === 0
      );
    }
  );

  for (const node of titleNodes) {
    const titleText = txt(node);
    let root = node.parentElement;
    let found = null;
    for (let d = 0; d < 8 && root; d++) {
      const imgs = [...root.querySelectorAll("img")]
        .map((img) => ({
          url: clean(img.currentSrc || img.src),
          w: img.naturalWidth || 0,
        }))
        .filter(
          (x) =>
            x.url.includes("cdn.abb-bank.az") &&
            !/icon_|Twitter|Youtube|Facebook|Instagram|Linkedin|favicon/i.test(
              x.url
            ) &&
            x.w >= 80
        );
      const unique = [...new Map(imgs.map((x) => [x.url, x])).values()];
      if (unique.length === 1) {
        const descs = [...root.querySelectorAll("p")]
          .map(txt)
          .filter(
            (t) =>
              t !== titleText &&
              t.length > 15 &&
              t.length < 220 &&
              !/Fikirlərinizi|cookie|hüquqlar/i.test(t)
          );
        const link = root.closest("a") || root.querySelector("a");
        found = {
          title: titleText,
          desc: (descs[0] || "").slice(0, 280),
          image: unique[0].url,
          href: link?.getAttribute("href") || null,
        };
        break;
      }
      root = root.parentElement;
    }
    if (
      found &&
      !cards.some((c) => c.title === found.title || c.image === found.image)
    ) {
      cards.push(found);
    }
    if (cards.length >= 10) break;
  }

  // Stats bar
  const stats = [];
  const values = [
    "Pulsuz",
    "10%-ə qədər",
    "*İllik 6% gəlir",
    "Tam rəqəmsal",
    "0 AZN",
  ];
  for (const v of values) {
    const el = [...main.querySelectorAll("p,span,div")].find(
      (e) => txt(e) === v && e.children.length === 0
    );
    if (!el) continue;
    const parent = el.parentElement;
    const labels = [...(parent?.querySelectorAll("p,span") || [])]
      .map(txt)
      .filter((t) => t && t !== v && t.length < 50);
    stats.push({ value: v, label: labels[0] || "" });
  }

  // Content sections
  const contentSections = [];
  for (const h of main.querySelectorAll("h2")) {
    const hTitle = txt(h);
    if (!hTitle || hTitle.length < 8) continue;
    let n = h.nextElementSibling;
    let desc = "";
    for (let k = 0; k < 6 && n; k++) {
      if (/^H[1-4]$/.test(n.tagName)) break;
      if (n.matches("p") && txt(n).length > 40) {
        desc = txt(n);
        break;
      }
      const p = n.querySelector?.("p");
      if (p && txt(p).length > 40) {
        desc = txt(p);
        break;
      }
      n = n.nextElementSibling;
    }
    if (desc && !contentSections.some((s) => s.title === hTitle)) {
      contentSections.push({ title: hTitle, desc: desc.slice(0, 900) });
    }
  }

  // FAQ
  const faqs = [];
  for (const btn of document.querySelectorAll("button")) {
    const q0 = txt(btn);
    if (!/\?/.test(q0) || q0.length < 12 || q0.length > 160) continue;
    try {
      btn.click();
    } catch {
      /* */
    }
    await new Promise((r) => setTimeout(r, 100));
    const item =
      btn.closest('[class*="border-b"], details, li, div') || btn.parentElement;
    const full = txt(item);
    const q = q0.match(/^[^?]{8,140}\?/)?.[0] || q0.split("?")[0] + "?";
    let a = full.startsWith(q) ? full.slice(q.length).trim() : full.replace(q, "").trim();
    a = a.replace(/\s+/g, " ").trim();
    if (a.length > 30 && !faqs.some((f) => f.q === q)) {
      faqs.push({ q, a: a.slice(0, 700) });
    }
  }

  const crumbs = [];
  const crumb = main.querySelector('[aria-label="breadcrumb"]');
  if (crumb) {
    for (const el of crumb.querySelectorAll("a, li, span")) {
      const t = txt(el);
      if (t && t.length < 40 && t !== "›" && t !== "•" && !crumbs.includes(t))
        crumbs.push(t);
    }
  }

  // Section headings
  const sections = [...main.querySelectorAll("h2, p")]
    .map(txt)
    .filter((t) => /kart|üstünlük|ABB mobile|Tez-tez|növ/i.test(t) && t.length < 80)
    .filter((t, i, a) => a.indexOf(t) === i)
    .slice(0, 10);

  // Full flow of visible card-related blocks
  const flow = [...main.querySelectorAll("h1,h2,h3,p")]
    .map((el) => ({
      tag: el.tagName,
      text: txt(el).slice(0, 160),
    }))
    .filter((x) => x.text.length > 3 && x.text.length < 160)
    .slice(0, 40);

  return {
    title,
    description,
    cta,
    heroImage,
    cards,
    stats: stats.slice(0, 4),
    contentSections,
    faqs,
    breadcrumbs: crumbs.slice(0, 6),
    sections,
    flow,
    ok: true,
  };
});

function toLarge(url) {
  if (!url || !url.includes("cdn.abb-bank.az")) return url;
  if (/\/(large_|icon_|small_)/i.test(url) || /\.svg$/i.test(url)) return url;
  if (/\/medium_/i.test(url)) return url.replace("/medium_", "/large_");
  return url.replace("cdn.abb-bank.az/", "cdn.abb-bank.az/large_");
}

data.heroImage = toLarge(data.heroImage);
data.cards = (data.cards || []).map((c) => ({
  ...c,
  image: toLarge(c.image),
}));

fs.writeFileSync("scripts/_kartlar-gold.json", JSON.stringify(data, null, 2));
console.log(JSON.stringify(data, null, 2));
await browser.close();
