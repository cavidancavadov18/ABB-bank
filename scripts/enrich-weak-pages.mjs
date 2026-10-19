/**
 * Enrich weak mega-menu pages from live abb-bank.az (HTML fetch).
 * Smart merge: fill empty / weaker fields only.
 */
import fs from "fs";
import { parse } from "node-html-parser";

const SKIP =
  /Banner_ABB_Mobile|onelinkto|favicon|Twitter_|Youtube_|Instagram_|Facebook_|Linkedin_|apple-touch|image_506_edd0057a05|qr_|infobank|logo_msp|logo_esg|virtual_qarabag|yenilogo/i;
const BAD =
  /Fikirlərinizi|cookie|©|hüquqlar qorunur|Karyera|Səhifəni dəyərləndirin|ABB mobile yükləmək|Mobil nömrə|FİN kod|Davam et|razılıq verirəm|Şifrə|OTP/i;
const NAV =
  /^(Fərdi|Biznes|Haqqımızda|İnvestorlarla əlaqə|Xəbərlər|AZ|EN|937|Xidmət şəbəkəsi|Ödəniş|FAQ|Ana səhifə|ABB)$/i;

function text(el) {
  return (el?.textContent || "").replace(/\s+/g, " ").trim();
}

function toLarge(url) {
  if (!url || !url.includes("cdn.abb-bank.az")) return url;
  if (/\/(large_|icon_|small_)/i.test(url) || /\.svg$/i.test(url)) return url;
  if (/\/medium_/i.test(url)) return url.replace("/medium_", "/large_");
  return url.replace("cdn.abb-bank.az/", "cdn.abb-bank.az/large_");
}

function cleanUrl(u) {
  if (!u) return null;
  let s = String(u)
    .replace(/\\u002F/g, "/")
    .replace(/&amp;/g, "&")
    .replace(/^\/\//, "https://")
    .split("?")[0]
    .trim();
  if (!s.includes("cdn.abb-bank.az")) return null;
  if (SKIP.test(s) || /\.pdf$/i.test(s)) return null;
  return toLarge(s);
}

function scorePage(x) {
  if (!x) return 0;
  let s = 0;
  if (x.heroImage) s += 2;
  if ((x.description || "").length > 80) s += 2;
  else if ((x.description || "").length > 20) s += 1;
  s += Math.min(x.cards?.length || 0, 4);
  s += Math.min(x.contentSections?.length || 0, 3);
  const faqA = (x.faqs || []).filter((f) =>
    typeof f === "object" ? (f.a || "").length > 30 : false
  ).length;
  if (faqA >= 2) s += 2;
  if ((x.plans?.length || 0) >= 2) s += 2;
  if ((x.stepDetails?.length || 0) >= 2 || (x.steps?.length || 0) >= 2) s += 2;
  if ((x.stats?.length || 0) >= 2) s += 1;
  return s;
}

function betterArr(a, b, minLen = 1) {
  const aa = Array.isArray(a) ? a : [];
  const bb = Array.isArray(b) ? b : [];
  if (bb.length < minLen) return aa;
  if (aa.length < minLen) return bb;
  if (bb.length > aa.length + 1) return bb;
  const q = (arr) =>
    arr.reduce((n, c) => {
      if (c?.image) n += 2;
      if ((c?.desc || "").length > 30) n += 2;
      if ((c?.a || "").length > 30) n += 2;
      if ((c?.title || c?.q || "").length > 3) n += 1;
      return n;
    }, 0);
  return q(bb) > q(aa) ? bb : aa;
}

function uniq(arr) {
  return [...new Set(arr.filter(Boolean))];
}

async function scrape(route) {
  const res = await fetch(`https://abb-bank.az${route}`, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "accept-language": "az-AZ,az;q=0.9",
      accept: "text/html",
    },
  });
  if (!res.ok) return { ok: false, status: res.status };

  const html = Buffer.from(await res.arrayBuffer()).toString("utf8");
  const root = parse(html);
  const main = root.querySelector("main") || root.querySelector("body");

  const title =
    text(main.querySelector("h1")) ||
    text(root.querySelector("title")).split("|")[0].trim();

  const paragraphs = main
    .querySelectorAll("p")
    .map(text)
    .filter((t) => t.length > 35 && t.length < 700)
    .filter((t) => !BAD.test(t));

  const description =
    paragraphs.find((t) =>
      /AZN|kredit|faiz|əmanət|kart|keşbek|hesab|bank|onlayn|rəqəmsal|depozit|ödəniş|biznes|korporativ|missiya|sənəd|hesabat|satınalma|investisiya|randevu|arayış|köçürm|sığorta/i.test(
        t
      )
    ) ||
    paragraphs[0] ||
    "";

  const ctaEl = main
    .querySelectorAll("a,button")
    .map((el) => ({ t: text(el), href: el.getAttribute("href") || "" }))
    .find(
      (x) =>
        /sifariş et|müraciət|hesab aç|ətraflı|əldə et|indi al|başla|əlaqə|yüklə|göndər|bax|randevu|ödə/i.test(
          x.t
        ) &&
        x.t.length < 42 &&
        !/tətbiqi yüklə/i.test(x.t)
    );

  // CDN images from img tags + escaped JSON in HTML
  const fromImgs = main
    .querySelectorAll("img")
    .map((img) =>
      cleanUrl(img.getAttribute("src") || img.getAttribute("data-src"))
    )
    .filter(Boolean);

  const fromHtml = [
    ...html.matchAll(
      /https:\\u002F\\u002Fcdn\.abb-bank\.az\\u002F[^"'\\\s]+/gi
    ),
  ]
    .map((m) => cleanUrl(m[0]))
    .filter(Boolean);

  const images = uniq([...fromImgs, ...fromHtml])
    .filter((u) => !/\.svg$/i.test(u) && !/icon_/i.test(u))
    .sort((a, b) => {
      let sa = /large_/i.test(a) ? 5 : 0;
      let sb = /large_/i.test(b) ? 5 : 0;
      return sb - sa;
    });

  let heroImage = images[0] || null;
  try {
    const curated = JSON.parse(
      fs.readFileSync("src/lib/data/sectionImages.json", "utf8")
    );
    if (curated[route]?.image) heroImage = curated[route].image;
  } catch {
    /* */
  }
  const gallery = images.filter((u) => u !== heroImage).slice(0, 16);

  // Cards from h3/h4
  const cards = [];
  for (const el of main.querySelectorAll("h3,h4")) {
    const titleC = text(el);
    if (
      !titleC ||
      titleC.length < 4 ||
      titleC.length > 90 ||
      NAV.test(titleC) ||
      /\?$/.test(titleC) ||
      BAD.test(titleC)
    )
      continue;

    let desc = "";
    let p = el.nextElementSibling;
    for (let k = 0; k < 5 && p; k++) {
      if (p.tagName === "P") {
        const pt = text(p);
        if (pt.length > 25 && !BAD.test(pt)) {
          desc = pt;
          break;
        }
      }
      const inner = p.querySelector?.("p");
      if (inner && text(inner).length > 25) {
        desc = text(inner);
        break;
      }
      p = p.nextElementSibling;
    }
    if (!desc) {
      const parentPs = el.parentNode
        ?.querySelectorAll("p")
        .map(text)
        .find((t) => t.length > 25 && t !== titleC && !BAD.test(t));
      if (parentPs) desc = parentPs;
    }

    // Find nearby image in parent
    let image = "";
    let root = el.parentNode;
    for (let d = 0; d < 6 && root; d++) {
      const imgs = root
        .querySelectorAll("img")
        .map((img) =>
          cleanUrl(img.getAttribute("src") || img.getAttribute("data-src"))
        )
        .filter((u) => u && !/\.svg$/i.test(u) && !/icon_/i.test(u));
      const unique = uniq(imgs);
      if (unique.length === 1) {
        image = unique[0];
        break;
      }
      root = root.parentNode;
    }

    if (!desc && !image) continue;
    if (cards.some((c) => c.title === titleC)) continue;
    cards.push({
      title: titleC,
      desc: (desc || "").slice(0, 300),
      image: image || gallery[cards.length] || heroImage || "",
    });
    if (cards.length >= 10) break;
  }

  // Content sections from h2
  const contentSections = [];
  for (const h of main.querySelectorAll("h2")) {
    const hTitle = text(h);
    if (!hTitle || hTitle.length < 6 || NAV.test(hTitle) || /\?$/.test(hTitle))
      continue;
    if (
      /üstünlük|planınız|addım|ABB mobile-dan|Tez-tez|Səhifəni/i.test(hTitle) &&
      hTitle.length < 55
    )
      continue;
    let n = h.nextElementSibling;
    let desc = "";
    for (let k = 0; k < 10 && n; k++) {
      if (/^H[1-4]$/.test(n.tagName)) break;
      if (n.tagName === "P") {
        const t = text(n);
        if (t.length > 50 && !BAD.test(t)) {
          desc = t;
          break;
        }
      }
      const p = n.querySelector?.("p");
      if (p && text(p).length > 50 && !BAD.test(text(p))) {
        desc = text(p);
        break;
      }
      n = n.nextElementSibling;
    }
    if (desc && !contentSections.some((s) => s.title === hTitle)) {
      contentSections.push({ title: hTitle, desc: desc.slice(0, 900) });
    }
    if (contentSections.length >= 8) break;
  }

  // FAQ from button-like text in HTML (accordion often SSR'd closed)
  const faqs = [];
  // Pattern: question? answer in adjacent text
  for (const btn of main.querySelectorAll("button, [role='button']")) {
    const q0 = text(btn).replace(/\+$/, "").trim();
    if (!/\?/.test(q0) || q0.length < 12 || q0.length > 180) continue;
    const parent = btn.parentNode;
    const full = text(parent);
    const q = q0.match(/^[^?]{8,140}\?/)?.[0] || q0.split("?")[0] + "?";
    let a = full.startsWith(q) ? full.slice(q.length).trim() : full.replace(q, "").trim();
    a = a.replace(/\s+/g, " ").replace(/\+$/, "").trim();
    if (a.length > 30 && !faqs.some((f) => f.q === q)) {
      faqs.push({ q, a: a.slice(0, 700) });
    }
    if (faqs.length >= 16) break;
  }

  // Steps
  const stepDetails = [];
  for (const h of main.querySelectorAll("h3")) {
    const hTitle = text(h);
    if (!hTitle || hTitle.length < 8 || hTitle.length > 100) continue;
    if (
      !/daxil olun|klik|seçin|toxun|sifariş|təsdiq|alın|açın|başla|müraciət|addım|yükləyin/i.test(
        hTitle
      )
    )
      continue;
    const desc =
      h.parentNode
        ?.querySelectorAll("p")
        .map(text)
        .find((t) => t.length > 15 && t.length < 260) || "";
    if (!stepDetails.some((s) => s.title === hTitle)) {
      stepDetails.push({ title: hTitle, desc: desc.slice(0, 220) });
    }
    if (stepDetails.length >= 4) break;
  }

  // Stats
  const stats = [];
  const bodyText = text(main);
  for (const [rv, label] of [
    [/(\d[\d\s]*AZN-dək)/i, "Məbləğ"],
    [/(\d+\s*ayadək)/i, "Müddət"],
    [/(\d+[.,]\d+%-dən|\d+%-dən|\d+%-dək)/i, "Faiz / gəlir"],
    [/(Zaminsiz)/i, "Zamin tələb olunmur"],
  ]) {
    const m = bodyText.match(rv);
    if (m && !stats.some((s) => s.value === m[1])) {
      stats.push({ value: m[1], label });
    }
  }

  // Document links for about/docs pages
  const docLinks = [];
  for (const a of main.querySelectorAll("a[href]")) {
    const href = a.getAttribute("href") || "";
    const t = text(a);
    if (
      t.length > 8 &&
      t.length < 140 &&
      (/\.pdf/i.test(href) ||
        /sənəd|hesabat|siyasət|qayda|tarif|müqavilə|bildiriş|anket|plan/i.test(t))
    ) {
      if (!docLinks.some((d) => d.title === t)) {
        docLinks.push({
          title: t,
          desc: "Sənədə baxın",
          image: heroImage || gallery[0] || "",
          href: href.startsWith("http")
            ? href
            : href.startsWith("/")
              ? `https://abb-bank.az${href}`
              : href,
        });
      }
    }
    if (docLinks.length >= 12) break;
  }

  // Useful links page: collect external/internal useful links as cards
  const linkCards = [];
  if (/faydali-linkler|rekvizitler|melumat-merkezi/i.test(route)) {
    for (const a of main.querySelectorAll("a[href]")) {
      const href = a.getAttribute("href") || "";
      const t = text(a);
      if (t.length < 4 || t.length > 80 || NAV.test(t) || BAD.test(t)) continue;
      if (/^(http|tel:|mailto:)/i.test(href) || href.startsWith("/")) {
        if (!linkCards.some((c) => c.title === t)) {
          linkCards.push({
            title: t,
            desc: href.startsWith("http") ? href.replace(/^https?:\/\//, "") : t,
            image: gallery[linkCards.length] || heroImage || "",
            href,
          });
        }
      }
      if (linkCards.length >= 10) break;
    }
  }

  return {
    ok: true,
    title,
    description,
    cta: ctaEl?.t || "Ətraflı",
    ctaHref: ctaEl?.href?.startsWith("/") ? ctaEl.href : undefined,
    heroImage,
    gallery,
    cards: cards.length ? cards : docLinks.length ? docLinks : linkCards,
    contentSections,
    faqs,
    stepDetails,
    steps: stepDetails.map((s) => s.title),
    stats,
    plans: [],
  };
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
    const s = scorePage(x);
    const noCards = !(x?.cards?.length);
    const noFaq = !(x?.faqs?.length);
    const noSecs = !(x?.contentSections?.length);
    return s <= 7 || (noCards && noFaq) || (noCards && noSecs);
  })
  .sort((a, b) => scorePage(existing[a]) - scorePage(existing[b]));

console.log(`Enriching ${ROUTES.length} routes via fetch...`);

const updated = [];
const unchanged = [];
const failed = [];

for (let i = 0; i < ROUTES.length; i++) {
  const route = ROUTES[i];
  process.stdout.write(`[${i + 1}/${ROUTES.length}] ${route} ... `);
  try {
    const data = await scrape(route);
    if (!data.ok) {
      failed.push({ route, err: `HTTP ${data.status}` });
      console.log("HTTP", data.status);
      continue;
    }

    const prev = existing[route] || { route };
    const before = scorePage(prev);

    const merged = {
      ...prev,
      route,
      ok: true,
      title:
        (data.title && data.title.length > 4 && data.title.length < 140
          ? data.title
          : null) ||
        prev.title ||
        route,
      description:
        (data.description || "").length > (prev.description || "").length
          ? data.description
          : prev.description || data.description || "",
      cta: data.cta || prev.cta || "Ətraflı",
      ctaHref: data.ctaHref || prev.ctaHref,
      heroImage: data.heroImage || prev.heroImage || null,
      gallery: betterArr(prev.gallery, data.gallery, 0),
      cards: betterArr(prev.cards, data.cards, 1),
      plans: betterArr(prev.plans, data.plans, 1),
      stepDetails: betterArr(prev.stepDetails, data.stepDetails, 1),
      steps: betterArr(prev.steps, data.steps, 1),
      contentSections: betterArr(prev.contentSections, data.contentSections, 1),
      faqs: betterArr(prev.faqs, data.faqs, 1),
      stats: betterArr(prev.stats, data.stats, 1),
      logos: prev.logos || [],
    };

    if ((merged.contentSections || []).length) {
      merged.blocks = merged.contentSections.slice(0, 6).map((s, idx) => ({
        title: s.title,
        desc: s.desc,
        image: merged.gallery[idx] || merged.heroImage || "",
      }));
    }

    merged.sections = [
      ...(prev.sections || []),
      ...(merged.contentSections || []).map((s) => s.title),
      ...(merged.steps || []),
    ]
      .filter((t, idx, a) => t && a.indexOf(t) === idx)
      .slice(0, 14);

    const after = scorePage(merged);
    const changed =
      after > before ||
      (merged.cards?.length || 0) > (prev.cards?.length || 0) ||
      (merged.faqs?.length || 0) > (prev.faqs?.length || 0) ||
      (merged.contentSections?.length || 0) >
        (prev.contentSections?.length || 0) ||
      (!!merged.heroImage && merged.heroImage !== prev.heroImage) ||
      (merged.description || "").length > (prev.description || "").length + 20;

    existing[route] = merged;

    if (changed) {
      updated.push({
        route,
        before,
        after,
        cards: merged.cards?.length || 0,
        faqs: merged.faqs?.length || 0,
        secs: merged.contentSections?.length || 0,
        hero: !!merged.heroImage,
        title: merged.title,
      });
      console.log(
        `UPD ${before}→${after} c=${merged.cards?.length || 0} f=${merged.faqs?.length || 0} s=${merged.contentSections?.length || 0}`
      );
    } else {
      unchanged.push(route);
      console.log(`same ${after}`);
    }
  } catch (e) {
    failed.push({ route, err: e.message });
    console.log("ERR", e.message);
  }
  await new Promise((r) => setTimeout(r, 200));
}

fs.writeFileSync(
  "src/lib/data/sectionPages.json",
  JSON.stringify(existing, null, 2),
  "utf8"
);
fs.writeFileSync(
  "scripts/_enrich-report.json",
  JSON.stringify({ updated, unchanged, failed, total: ROUTES.length }, null, 2),
  "utf8"
);

console.log("\n=== REPORT ===");
console.log("updated:", updated.length);
updated.forEach((u) => console.log(" -", u.route, `${u.before}→${u.after}`));
console.log("unchanged:", unchanged.length);
console.log("failed:", failed.length);
