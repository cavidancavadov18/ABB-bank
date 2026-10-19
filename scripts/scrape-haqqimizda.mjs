/**
 * High-fidelity scrape of every Haqqımızda mega-menu page:
 * full-res CDN images + AZ texts.
 */
import fs from "fs";
import { chromium } from "playwright";

const ROUTES = [
  "/haqqimizda",
  "/haqqimizda/rekvizitler",
  "/haqqimizda/missiya-ve-strateji-baxis",
  "/haqqimizda/korporativ-sosial-mesuliyyet",
  "/haqqimizda/muxbir-banklar",
  "/haqqimizda/istirak-payi",
  "/haqqimizda/mukafatlar",
  "/standart-sertler-ve-melumatlandirma-formalari",
  "/haqqimizda/rehberlik",
  "/haqqimizda/idareetme-ve-komiteler",
  "/haqqimizda/senedler",
  "/haqqimizda/siyasetlerimiz",
  "/korporativ-teqdimat",
  "/haqqimizda/arasdirma",
  "/haqqimizda/hesabatlar",
  "/haqqimizda/huquqi-icmal",
  "/haqqimizda/teklif-ve-iradlar",
  "/haqqimizda/investisiya-bankciligi",
  "/haqqimizda/brend-merkezi",
  "/haqqimizda/satinalmalar/musabiqelerin-elani",
  "/haqqimizda/satinalmalar/bildirisler",
  "/haqqimizda/satinalmalar/baglanmis-muqavilelerin-reyestri",
  "/haqqimizda/satinalmalar/satinalma-plani",
  "/haqqimizda/satinalmalar/techizatci-anketi",
];

const SKIP =
  /Banner_ABB_Mobile_AZ_1d0d27e342|onelinkto|favicon|Twitter_|Youtube_|Instagram_|Facebook_|Linkedin_|infobank|174359|logo_msp|logo_esg|virtual_qarabag|yenilogo|apple-touch|image_506_edd0057a05/i;

const BAD_PLAN =
  /menuAttached|uiRouterKey|@type|contactPoint|schema\.org/;

const existing = JSON.parse(
  fs.readFileSync("src/lib/data/sectionPages.json", "utf8")
);
let imagesDb = {};
try {
  imagesDb = JSON.parse(
    fs.readFileSync("src/lib/data/sectionImages.json", "utf8")
  );
} catch {
  imagesDb = {};
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  locale: "az-AZ",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
});

for (let i = 0; i < ROUTES.length; i++) {
  const route = ROUTES[i];
  process.stdout.write(`[${i + 1}/${ROUTES.length}] ${route} ... `);
  try {
    await page.goto(`https://abb-bank.az${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(1600);

    await page.evaluate(async () => {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const h = Math.min(document.body.scrollHeight, 6000);
      for (let y = 0; y < h; y += 800) {
        window.scrollTo(0, y);
        await sleep(90);
      }
      window.scrollTo(0, 0);
      await sleep(200);
    });

    try {
      const faqTab = page.getByRole("button", { name: /^FAQ$/i });
      if (await faqTab.count()) await faqTab.first().click({ timeout: 1200 });
    } catch {
      /* */
    }
    await page.waitForTimeout(300);

    const data = await page.evaluate(async (skipSrc) => {
      const SKIP = new RegExp(skipSrc, "i");
      const clean = (u) => (u || "").split("?")[0];
      const txt = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
      const BAD =
        /Fikirlərinizi|Rəyləriniz|cookie|©|hüquqlar qorunur|Karyera|Uğur hekayənizi|Səhifəni dəyərləndirin|ABB mobile yükləmək|Mobil nömrə|FİN kod|Davam et|razılıq verirəm/i;
      const NAV =
        /^(Fərdi|Biznes|Haqqımızda|İnvestorlarla əlaqə|Xəbərlər|AZ|EN|937|Xidmət şəbəkəsi|Ana səhifə|ABB|Tətbiqi yüklə|Ödəniş|FAQ|Qeydlər|Şərtlər)$/i;

      const main = document.querySelector("main") || document.body;
      const title =
        txt(main.querySelector("h1")) ||
        document.title.split("|")[0].trim();

      const allPs = [...main.querySelectorAll("p")]
        .map(txt)
        .filter((t) => t.length > 30 && t.length < 900 && !BAD.test(t));

      const description =
        allPs.find((t) =>
          /bank|ABB|missiya|strateji|rəhbər|idarə|siyasət|hesabat|araşdırma|satınal|brend|investisiya|hüquqi|təklif|mükafat|rekvizit|müxbir|sponsor|sosial|təqdimat|tarif|sənəd/i.test(
            t
          )
        ) ||
        allPs[0] ||
        "";

      const imgNodes = [...main.querySelectorAll("img")];
      const scored = [];
      for (const img of imgNodes) {
        const cls = (img.className || "").toString();
        if (/lg:hidden/.test(cls) && !/hidden\s+lg:block/.test(cls)) continue;
        let url = "";
        if (img.srcset) {
          let bestW = 0;
          for (const part of img.srcset.split(",")) {
            const [u, w] = part.trim().split(/\s+/);
            const n =
              parseInt(String(w || "").replace("w", ""), 10) ||
              img.naturalWidth ||
              0;
            if (u && n >= bestW) {
              bestW = n;
              url = u;
            }
          }
        }
        url = clean(url || img.currentSrc || img.src);
        if (!url.includes("cdn.abb-bank.az")) continue;
        if (SKIP.test(url) || /\.pdf$/i.test(url)) continue;
        const w = img.naturalWidth || 0;
        const h = img.naturalHeight || 0;
        let score = w * h;
        if (/large_/i.test(url)) score += 5_000_000;
        if (/medium_/i.test(url)) score += 1_000_000;
        if (/icon_/i.test(url) || /\.svg$/i.test(url)) score -= 10_000_000;
        if (
          /rehber|leadership|award|mukafat|brand|brend|haqqimizda|about|board|komite|csr|sponsor|mission|strateg|report|hesabat|invest|satinal|presentation|teqdimat|portrait|team|Vizual|campaign_|photo|image_/i.test(
            url
          )
        )
          score += 3_000_000;
        // Leadership photos often useful even without keyword
        if (w >= 200 && h >= 200) score += 500_000;
        scored.push({ url, score, w, h });
      }
      scored.sort((a, b) => b.score - a.score);
      const images = [];
      const seenImg = new Set();
      for (const s of scored) {
        let u = s.url;
        if (/\/medium_/i.test(u)) u = u.replace("/medium_", "/large_");
        if (seenImg.has(u)) continue;
        seenImg.add(u);
        images.push(u);
      }
      const heroImage =
        images.find((u) => !/icon_/i.test(u) && !/\.svg$/i.test(u)) || null;
      const gallery = images
        .filter((u) => u !== heroImage && !/\.svg$/i.test(u))
        .slice(0, 20);
      const logos = images
        .filter((u) => /logo/i.test(u) || /\.svg$/i.test(u))
        .filter((u) => !/Twitter|Youtube|Instagram|Facebook|Linkedin/i.test(u))
        .slice(0, 12);

      const cta =
        [...main.querySelectorAll("a,button")]
          .map(txt)
          .find(
            (t) =>
              /ətraflı|yüklə|bax|əlaqə|müraciət|göndər|endir|oxu|daha çox/i.test(
                t
              ) &&
              t.length < 40 &&
              !/tətbiqi yüklə/i.test(t)
          ) || "Ətraflı";

      const contentSections = [];
      for (const h of main.querySelectorAll("h2, h3")) {
        const hTitle = txt(h);
        if (!hTitle || hTitle.length < 4 || hTitle.length > 120 || NAV.test(hTitle))
          continue;
        if (/\?$/.test(hTitle)) continue;

        const paras = [];
        let n = h.nextElementSibling;
        for (let k = 0; k < 10 && n; k++) {
          if (/^H[1-4]$/.test(n.tagName)) break;
          if (n.matches("p")) {
            const t = txt(n);
            if (t.length > 35 && !BAD.test(t)) paras.push(t);
          } else {
            for (const p of n.querySelectorAll?.("p") || []) {
              const t = txt(p);
              if (t.length > 35 && !BAD.test(t)) paras.push(t);
            }
          }
          if (paras.length >= 2) break;
          n = n.nextElementSibling;
        }
        if (!paras.length) {
          const parent = h.closest("section, article, div") || h.parentElement;
          const near = [...(parent?.querySelectorAll("p") || [])]
            .map(txt)
            .filter((t) => t.length > 40 && !BAD.test(t));
          if (near[0]) paras.push(near[0]);
        }
        const desc = paras.join("\n").slice(0, 900);
        if (desc.length > 40 && !contentSections.some((s) => s.title === hTitle)) {
          contentSections.push({ title: hTitle, desc });
        }
        if (contentSections.length >= 10) break;
      }

      if (contentSections.length === 0) {
        const uniq = [];
        for (const p of allPs) {
          if (p.length < 60) continue;
          if (uniq.some((u) => u.slice(0, 50) === p.slice(0, 50))) continue;
          uniq.push(p);
          if (uniq.length >= 5) break;
        }
        uniq.forEach((p, idx) => {
          const first = p.split(/[.!]/)[0].trim();
          contentSections.push({
            title:
              idx === 0
                ? title || "Ətraflı məlumat"
                : first.length > 8 && first.length <= 70
                  ? first
                  : `Bölmə ${idx + 1}`,
            desc: p.slice(0, 800),
          });
        });
      }

      // Leadership / people cards: photo + name + role
      const cards = [];
      for (const img of imgNodes) {
        const cls = (img.className || "").toString();
        if (/lg:hidden/.test(cls) && !/hidden\s+lg:block/.test(cls)) continue;
        let url = clean(img.currentSrc || img.src);
        if (!url.includes("cdn.abb-bank.az") || SKIP.test(url)) continue;
        if (/icon_/i.test(url) || /\.svg$/i.test(url)) continue;
        if (/\/medium_/i.test(url)) url = url.replace("/medium_", "/large_");

        let el = img.parentElement;
        let heading = "";
        let desc = "";
        for (let d = 0; d < 8 && el; d++) {
          const h = el.querySelector("h2, h3, h4, strong");
          if (h) {
            const ht = txt(h);
            if (!NAV.test(ht) && ht.length >= 3 && ht.length < 90 && !/\?$/.test(ht))
              heading = ht;
          }
          const p = [...el.querySelectorAll("p")]
            .map(txt)
            .find((t) => t.length > 15 && t.length < 400 && !BAD.test(t) && t !== heading);
          if (p) desc = p;
          if (heading && desc) break;
          el = el.parentElement;
        }
        if (
          heading &&
          !cards.some((c) => c.title === heading || c.image === url)
        ) {
          cards.push({
            title: heading,
            desc: (desc || "").slice(0, 320),
            image: url,
          });
        }
        if (cards.length >= 12) break;
      }

      if (cards.length < 2) {
        for (const h of main.querySelectorAll("h3, h4")) {
          const hTitle = txt(h);
          if (!hTitle || hTitle.length < 3 || hTitle.length > 80 || NAV.test(hTitle))
            continue;
          if (/\?$/.test(hTitle)) continue;
          let n = h.nextElementSibling;
          let desc = "";
          for (let k = 0; k < 5 && n; k++) {
            const t = txt(n);
            if (n.matches("p") && t.length > 20 && t.length < 400 && !BAD.test(t)) {
              desc = t;
              break;
            }
            n = n.nextElementSibling;
          }
          if (!cards.some((c) => c.title === hTitle)) {
            cards.push({
              title: hTitle,
              desc: (desc || "").slice(0, 320),
              image: gallery[cards.length] || heroImage || "",
            });
          }
          if (cards.length >= 8) break;
        }
      }

      const stepDetails = [];
      const faqs = [];
      const btns = [...document.querySelectorAll("button")].filter((b) => {
        const t = txt(b);
        return /\?/.test(t) && t.length > 12 && t.length < 180;
      });
      for (const btn of btns) {
        const q0 = txt(btn);
        try {
          btn.click();
        } catch {
          /* */
        }
        await new Promise((r) => setTimeout(r, 140));
        const item =
          btn.closest(
            '[class*="border-b"], [class*="accordion"], details, li, div'
          ) || btn.parentElement;
        const full = txt(item);
        const q = q0.match(/^[^?]{8,140}\?/)?.[0] || q0.split("?")[0] + "?";
        let a = full.startsWith(q)
          ? full.slice(q.length).trim()
          : full.replace(q, "").trim();
        a = a.replace(/\s+/g, " ").trim();
        if (a.length > 30 && !faqs.some((f) => f.q === q)) {
          faqs.push({ q, a: a.slice(0, 700) });
        }
      }

      const sections = [...main.querySelectorAll("h2")]
        .map(txt)
        .filter((t) => t.length > 3 && t.length < 110 && !NAV.test(t))
        .filter((t, idx, a) => a.indexOf(t) === idx)
        .slice(0, 12);

      const crumbs = [];
      const crumbRoot =
        main.querySelector('[aria-label="breadcrumb"]') ||
        main.querySelector('nav[aria-label="breadcrumb"]');
      if (crumbRoot) {
        for (const el of crumbRoot.querySelectorAll("a, li, span")) {
          const t = txt(el);
          if (t && t.length < 50 && !crumbs.includes(t) && t !== "›") crumbs.push(t);
        }
      }

      const blocks = contentSections.slice(0, 8).map((s, idx) => ({
        title: s.title,
        desc: s.desc,
        image: gallery[idx] || heroImage || "",
      }));

      return {
        title,
        description,
        cta,
        heroImage,
        gallery,
        logos,
        stats: [],
        cards: cards
          .filter((c) => c.image && !/^Əlavə məlumat/i.test(c.title))
          .slice(0, 12),
        plans: [],
        steps: stepDetails.map((s) => s.title),
        stepDetails,
        faqs,
        contentSections: contentSections
          .filter((s) => !/^Əlavə məlumat/i.test(s.title))
          .slice(0, 10),
        sections,
        blocks,
        breadcrumbs: crumbs.slice(0, 6),
        features: cards.slice(0, 8).map((c) => c.title),
      };
    }, SKIP.source);

    data.cards = (data.cards || []).map((c) => ({
      ...c,
      desc: (c.desc || "")
        .replace(/\{?"@type[\s\S]*$/i, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 320),
    }));
    data.plans = (data.plans || []).filter(
      (pl) => pl.desc && !BAD_PLAN.test(pl.desc)
    );

    const prev = existing[route] || { route, ok: true };
    existing[route] = {
      ...prev,
      ...data,
      ok: true,
      route,
      heroImage: data.heroImage || prev.heroImage || null,
      gallery: data.gallery?.length > 0 ? data.gallery : prev.gallery || [],
      cards:
        data.cards?.length > 0
          ? data.cards
          : (prev.cards || []).map((c) => ({
              ...c,
              image: c.image || data.heroImage,
            })),
      faqs:
        data.faqs?.length > 0
          ? data.faqs
          : (prev.faqs || []).map((f) =>
              typeof f === "string" ? { q: f, a: "" } : f
            ),
      contentSections:
        data.contentSections?.length > 0
          ? data.contentSections
          : prev.contentSections || [],
      stepDetails:
        data.stepDetails?.length > 0
          ? data.stepDetails
          : prev.stepDetails || [],
    };

    imagesDb[route] = {
      image: data.heroImage || imagesDb[route]?.image || null,
      gallery: data.gallery || [],
      logos: data.logos || [],
    };

    console.log(
      `OK | img=${data.gallery.length + (data.heroImage ? 1 : 0)} cards=${data.cards.length} secs=${data.contentSections.length} faqs=${data.faqs.length}`
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
fs.writeFileSync(
  "src/lib/data/sectionImages.json",
  JSON.stringify(imagesDb, null, 2),
  "utf8"
);
console.log("DONE haqqimizda scrape", ROUTES.length);
await browser.close();
