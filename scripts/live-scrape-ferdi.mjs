/**
 * Visit every Fərdi mega-menu page on abb-bank.az in a real browser.
 * Capture exact rendered text + highest-res CDN images.
 */
import fs from "fs";
import { chromium } from "playwright";

const ROUTES = [
  "/ferdi/kreditler",
  "/ferdi/kreditler/nagd-kredit",
  "/ferdi/kreditler/avans-kredit-xetti",
  "/ferdi/kreditler/indi-al-sonra-ode",
  "/ferdi/kreditler/avtomobil-krediti",
  "/ferdi/kreditler/emanetci-nagd-krediti",
  "/ferdi/kreditler/emanetci-kredit-limiti",
  "/ferdi/kreditler/ipoteka-krediti",
  "/ferdi/kartlar",
  "/ferdi/kartlar/kredit-kartlari",
  "/ferdi/kartlar/debet-kartlari",
  "/ferdi/emanetler",
  "/ferdi/emanetler/digideposit",
  "/ferdi/emanetler/klassik-emaneti",
  "/ferdi/emanetler/usaq-yigim-emaneti",
  "/ferdi/emanetler/depozit-seyfi",
  "/ferdi/emanetler/emanetli-ipoteka-krediti",
  "/ferdi/butun-hesablar",
  "/ferdi/butun-hesablar/digihesab-max",
  "/ferdi/butun-hesablar/digihesab",
  "/ferdi/butun-hesablar/cari-hesab",
  "/ferdi/butun-hesablar/dama-dama",
  "/ferdi/kesbek",
  "/ferdi/kesbek/faydali-kesbek",
  "/ferdi/kesbek/fayda-max",
  "/ferdi/kesbek/faydali-klub",
  "/ferdi/kampaniyalar",
  "/ferdi/butun-emeliyyatlar",
  "/ferdi/butun-emeliyyatlar/olkedaxili-ve-olkexarici-kocurmeler",
  "/ferdi/butun-emeliyyatlar/bank-kocurmeleri",
  "/ferdi/randevu",
  "/abb-mobile",
  "/ferdi/melumat-merkezi",
  "/ferdi/arayis-sifarisi",
  "/ferdi/kredit-odenisi",
  "/ferdi/karta-medaxil",
  "/ferdi/pul-kocurmesi",
  "/ferdi/cash-by-code",
  "/ferdi/iane-et",
  "/ferdi/pin-kod-deyisimi",
  "/ferdi/sigorta",
  "/ferdi/investisiya",
  "/abb-esim",
  "/ferdi/abb-mobile-odenisler",
  "/ferdi/digitravel",
  "/haqqimizda/senedler",
  "/faydali-linkler",
  "/ferdi/xidmet-sebekesi",
];

const SKIP =
  /Banner_ABB_Mobile_AZ_1d0d27e342|onelinkto|favicon|Twitter_|Youtube_|Instagram_|Facebook_|Linkedin_|infobank|174359|logo_msp|logo_esg|virtual_qarabag|yenilogo|apple-touch|image_506_edd0057a05/i;

function pickBestUrl(img) {
  // Prefer largest from srcset
  const srcset = img.srcset || "";
  if (srcset) {
    const parts = srcset.split(",").map((p) => p.trim().split(/\s+/));
    let best = null;
    let bestW = 0;
    for (const [url, w] of parts) {
      const n = parseInt(String(w).replace("w", ""), 10) || 0;
      if (url && n >= bestW) {
        bestW = n;
        best = url;
      }
    }
    if (best) return best.split("?")[0];
  }
  const src = (img.currentSrc || img.src || "").split("?")[0];
  return src || null;
}

function upgradeLarge(url) {
  if (!url || !url.includes("cdn.abb-bank.az")) return null;
  if (SKIP.test(url) || /\.pdf$/i.test(url)) return null;
  // Prefer large_ if not hash-named
  const file = url.split("/").pop() || "";
  if (/^[0-9a-f]{16,}/i.test(file)) return url;
  if (/\/medium_/i.test(url)) return url.replace("/medium_", "/large_");
  if (!/\/large_/i.test(url) && !/\.svg$/i.test(url) && !/icon_/i.test(url)) {
    // try large_ sibling — keep original; verifier will prefer existing
    const large = url.replace("cdn.abb-bank.az/", "cdn.abb-bank.az/large_");
    return { url, large };
  }
  return url;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  locale: "az-AZ",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
});

const existing = JSON.parse(
  fs.readFileSync("src/lib/data/sectionPages.json", "utf8")
);
const out = { ...existing };

for (let i = 0; i < ROUTES.length; i++) {
  const route = ROUTES[i];
  process.stdout.write(`[${i + 1}/${ROUTES.length}] ${route} ... `);
  try {
    await page.goto(`https://abb-bank.az${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(1800);
    // scroll to load lazy images
    await page.evaluate(async () => {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const h = Math.min(document.body.scrollHeight, 4000);
      for (let y = 0; y < h; y += 900) {
        window.scrollTo(0, y);
        await sleep(80);
      }
      window.scrollTo(0, 0);
      await sleep(150);
    });

    const data = await page.evaluate((skipReSource) => {
      const SKIP = new RegExp(skipReSource, "i");
      const clean = (u) => (u || "").split("?")[0];
      const txt = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
      const BAD =
        /Fikirlərinizi|Rəyləriniz|cookie|©|hüquqlar qorunur|Karyera|Uğur hekayənizi|Səhifəni dəyərləndirin/i;
      const NAV =
        /^(Fərdi|Biznes|Haqqımızda|İnvestorlarla əlaqə|Xəbərlər|AZ|937|Xidmət şəbəkəsi|Ana səhifə|Davam et|ABB|Tətbiqi yüklə)$/i;

      const main = document.querySelector("main") || document.body;
      const title = txt(main.querySelector("h1")) || document.title.split("|")[0].trim();

      const paragraphs = [...main.querySelectorAll("p")]
        .map(txt)
        .filter((t) => t.length > 40 && t.length < 420 && !BAD.test(t));

      const description =
        paragraphs.find((t) =>
          /AZN|kredit|faiz|əmanət|kart|keşbek|hesab|ipoteka|onlayn|bank|rəqəmsal|depozit|ödəniş|köçürm|sığorta|invest|səyahət/i.test(
            t
          )
        ) ||
        paragraphs[0] ||
        "";

      // Collect images with natural dimensions — prefer largest
      const imgNodes = [...main.querySelectorAll("img")];
      const scored = [];
      for (const img of imgNodes) {
        // skip mobile-only duplicates
        const cls = (img.className || "").toString();
        if (/lg:hidden/.test(cls) && !/hidden\s+lg:block/.test(cls)) continue;

        let url = "";
        if (img.srcset) {
          let bestW = 0;
          for (const part of img.srcset.split(",")) {
            const [u, w] = part.trim().split(/\s+/);
            const n = parseInt(String(w || "").replace("w", ""), 10) || img.naturalWidth || 0;
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
          /kredit|Deposit|Digi|Visa|Tam_|Kart|cashloan|kids|Mask|fly_|ani_|Rotation|step|Vizual|Loan|master|campaign_|pul_|Calend|rehberlik|header_mockup|sldier|slider|689316/i.test(
            url
          )
        )
          score += 3_000_000;
        scored.push({ url, w, h, score, cls });
      }
      scored.sort((a, b) => b.score - a.score);

      // Upgrade medium_ → large_ in list
      const images = [];
      const seen = new Set();
      for (const s of scored) {
        let u = s.url;
        if (/\/medium_/i.test(u)) u = u.replace("/medium_", "/large_");
        if (seen.has(u)) continue;
        seen.add(u);
        images.push(u);
      }

      const heroImage = images.find((u) => !/icon_/i.test(u) && !/\.svg$/i.test(u)) || null;
      const gallery = images.filter((u) => u !== heroImage && !/\.svg$/i.test(u)).slice(0, 16);

      const logos = images
        .filter((u) => /logo/i.test(u) || /\.svg$/i.test(u))
        .filter((u) => !/Twitter|Youtube|Instagram|Facebook|Linkedin/i.test(u))
        .slice(0, 12);

      const cta =
        [...main.querySelectorAll("a,button")]
          .map(txt)
          .find(
            (t) =>
              /sifariş et|müraciət|hesab aç|ətraflı|əldə et|indi al|hesabla|başla|ödə|köçür|randevu/i.test(
                t
              ) &&
              t.length < 40 &&
              !/tətbiqi yüklə/i.test(t)
          ) || "Ətraflı";

      // stats
      const bodyText = txt(main);
      const stats = [];
      const seenStat = new Set();
      for (const [re, label] of [
        [/(\d[\d\s]*AZN-dək)/i, "Məbləğ"],
        [/(\d+\s*ayadək)/i, "Müddət"],
        [/(\d+[.,]\d+%-dən|\d+%-dən|\d+%-dək)/i, "İllik faiz / gəlir"],
        [/(Zaminsiz)/i, "Zamin tələb olunmur"],
        [/(Cəriməsiz)/i, "Vaxtından əvvəl çıxarış"],
      ]) {
        const m = bodyText.match(re);
        if (m && !seenStat.has(m[1])) {
          seenStat.add(m[1]);
          stats.push({ value: m[1], label });
        }
      }

      // Advantage-style cards: title+desc pairs + nearby images
      const named = [
        ["Rahat şərtlər", /Rahat şərtlər\s+(.{30,220})/i],
        ["Sürətli rəsmiləşdirmə", /Sürətli rəsmiləşdirmə\s+(.{30,220})/i],
        [
          "Kredit ödənişi tarixinin dəyişdirilməsi imkanı",
          /Kredit ödənişi tarixinin dəyişdirilməsi imkanı\s+(.{30,220})/i,
        ],
        ["Könüllü kredit həyat sığortası", /Könüllü kredit həyat sığortası\s+(.{30,220})/i],
        ["Tamamilə onlayn", /Tamamilə onlayn\s+(.{30,220})/i],
        ["Yüksək gəlir", /Yüksək gəlir\s+(.{30,220})/i],
        ["Sərbəst çıxarış", /Sərbəst çıxarış\s+(.{30,220})/i],
      ];
      const cards = [];
      const cardImgs = gallery.filter((u) =>
        /campaign_|pul_|web_Calend|image_|cashloan|Digi_|Deposit|Visa|Tam_|kids|step|Vizual/i.test(u)
      );
      for (const [title, re] of named) {
        const m = bodyText.match(re);
        if (m) {
          cards.push({
            title,
            desc: m[1].replace(/\s+/g, " ").slice(0, 240),
            image: cardImgs[cards.length] || gallery[cards.length] || heroImage,
          });
        }
      }

      if (cards.length < 2) {
        const h3s = [...main.querySelectorAll("h3")]
          .map(txt)
          .filter((t) => t.length > 3 && t.length < 70 && !NAV.test(t) && !/\?$/.test(t))
          .filter((t, i, a) => a.indexOf(t) === i)
          .slice(0, 6);
        for (let i = 0; i < h3s.length; i++) {
          cards.push({
            title: h3s[i],
            desc: paragraphs[i + 1] || paragraphs[0] || "",
            image: gallery[i] || heroImage,
          });
        }
      }

      // Pair cards with images from DOM: find articles with img+heading
      const domCards = [];
      for (const img of imgNodes) {
        const cls = (img.className || "").toString();
        if (/lg:hidden/.test(cls) && !/hidden\s+lg:block/.test(cls)) continue;
        let url = clean(img.currentSrc || img.src);
        if (!url.includes("cdn.abb-bank.az") || SKIP.test(url) || /icon_/i.test(url)) continue;
        if (!/campaign_|pul_|web_Calend|image_9|image_3|cashloan|Digi_|Deposit|Visa|Tam_|kids|step/i.test(url))
          continue;
        let el = img.parentElement;
        let heading = "";
        let desc = "";
        for (let d = 0; d < 7 && el; d++) {
          const h = el.querySelector("h3,h4");
          if (h) {
            const ht = txt(h);
            if (!NAV.test(ht) && ht.length < 80) heading = ht;
          }
          const p = [...el.querySelectorAll("p")]
            .map(txt)
            .find((t) => t.length > 35 && !BAD.test(t));
          if (p) desc = p;
          if (heading && desc) break;
          el = el.parentElement;
        }
        if (heading && !domCards.some((c) => c.title === heading || c.image === url)) {
          if (/\/medium_/i.test(url)) url = url.replace("/medium_", "/large_");
          domCards.push({ title: heading, desc: desc.slice(0, 240), image: url });
        }
        if (domCards.length >= 6) break;
      }

      const finalCards = (domCards.length >= 2 ? domCards : cards)
        .filter((c) => c.title && c.image)
        .slice(0, 6);

      const steps = [...main.querySelectorAll("h3")]
        .map(txt)
        .filter((t) => /daxil olun|seçin|klikləyin|addım|toxunun|başla/i.test(t))
        .filter((t, i, a) => a.indexOf(t) === i)
        .slice(0, 6);

      const sections = [...main.querySelectorAll("h2")]
        .map(txt)
        .filter((t) => t.length > 3 && t.length < 110 && !NAV.test(t))
        .filter((t, i, a) => a.indexOf(t) === i)
        .slice(0, 10);

      const faqs = [...main.querySelectorAll("h3")]
        .map(txt)
        .filter((t) => /\?$/.test(t) && t.length > 12 && t.length < 140)
        .filter((t, i, a) => a.indexOf(t) === i)
        .slice(0, 12);

      // breadcrumbs
      const crumbs = [];
      const crumbRoot =
        main.querySelector('[aria-label="breadcrumb"]') ||
        main.querySelector("nav[aria-label=\"breadcrumb\"]");
      if (crumbRoot) {
        for (const el of crumbRoot.querySelectorAll("a, li, span")) {
          const t = txt(el);
          if (t && t.length < 40 && !crumbs.includes(t) && t !== "›") crumbs.push(t);
        }
      }

      // blocks: h2 + nearby image
      const blocks = [];
      for (const h2 of main.querySelectorAll("h2")) {
        const heading = txt(h2);
        if (!heading || NAV.test(heading)) continue;
        let root = h2.parentElement;
        let imgUrl = null;
        let desc = "";
        for (let d = 0; d < 5 && root; d++) {
          const img = root.querySelector("img");
          if (img) {
            const u = clean(img.currentSrc || img.src);
            if (u.includes("cdn.abb-bank.az") && !SKIP.test(u) && !/icon_/i.test(u)) {
              imgUrl = /\/medium_/i.test(u) ? u.replace("/medium_", "/large_") : u;
            }
          }
          const p = [...root.querySelectorAll("p")]
            .map(txt)
            .find((t) => t.length > 40 && !BAD.test(t) && t !== description);
          if (p) desc = p;
          if (imgUrl && desc) break;
          root = root.parentElement;
        }
        if (imgUrl && heading) {
          if (!blocks.some((b) => b.title === heading)) {
            blocks.push({ title: heading, desc: desc.slice(0, 260), image: imgUrl });
          }
        }
        if (blocks.length >= 6) break;
      }

      // plans
      const plans = [];
      for (const name of ["Səyahət", "Təhsil", "Avtomobil", "Şəxsi ehtiyaclar"]) {
        const re = new RegExp(`${name}\\s+(.{20,160})`, "i");
        const m = bodyText.match(re);
        if (m) plans.push({ title: name, desc: m[1].slice(0, 160) });
      }

      return {
        title,
        description,
        cta,
        heroImage,
        gallery,
        logos,
        stats: stats.slice(0, 4),
        cards: finalCards,
        steps,
        faqs,
        sections,
        blocks,
        plans,
        breadcrumbs: crumbs.slice(0, 4),
        features: finalCards.map((c) => c.title),
        imageMeta: scored.slice(0, 8).map((s) => ({ url: s.url, w: s.w, h: s.h })),
      };
    }, SKIP.source);

    // Verify large_ URLs exist; fall back to original
    async function resolveUrl(u) {
      if (!u) return u;
      if (/\/large_/i.test(u) || /^[0-9a-f]{16,}/i.test(u.split("/").pop() || "")) return u;
      if (/\.svg$/i.test(u) || /icon_/i.test(u)) return u;
      const large = u.replace("cdn.abb-bank.az/", "cdn.abb-bank.az/large_");
      try {
        const r = await fetch(large, { method: "HEAD" });
        if (r.ok) return large;
      } catch {
        /* */
      }
      return u;
    }

    data.heroImage = await resolveUrl(data.heroImage);
    data.gallery = (
      await Promise.all((data.gallery || []).map((u) => resolveUrl(u)))
    ).filter(Boolean);
    data.cards = await Promise.all(
      (data.cards || []).map(async (c) => ({
        ...c,
        image: await resolveUrl(c.image),
      }))
    );
    data.blocks = await Promise.all(
      (data.blocks || []).map(async (b) => ({
        ...b,
        image: await resolveUrl(b.image),
      }))
    );

    out[route] = {
      route,
      ok: true,
      status: 200,
      ...data,
    };

    const heroFile = (data.heroImage || "").split("/").pop();
    const meta = data.imageMeta?.[0];
    console.log(
      `OK | ${data.title.slice(0, 36)} | hero=${heroFile} ${meta ? meta.w + "x" + meta.h : ""} | cards=${data.cards.length} imgs=${data.gallery.length}`
    );
  } catch (e) {
    console.log("ERR", e.message);
  }
}

// Gold overrides (verified from live site)
out["/ferdi/kreditler/nagd-kredit"] = {
  ...out["/ferdi/kreditler/nagd-kredit"],
  title: "Güzəştli Şərtlərlə Tam Onlayn Nağd Kredit",
  description:
    "70 000 AZN-dək nağd krediti filiala gəlmədən, elə olduğunuz yerdən əldə edin! Üstəlik, müraciət üçün rəsmi gəlir tələbi yoxdur.",
  cta: "İndi sifariş et",
  heroImage:
    "https://cdn.abb-bank.az/689316b85302e0ffde2e9d46ffb48279f7d446ca_63a07d9b03.png",
  breadcrumbs: ["Fərdi", "Bütün kreditlər", "Nağd kredit"],
  stats: [
    { value: "70 000 AZN-dək", label: "Məbləğ" },
    { value: "60 ayadək", label: "Müddət" },
    { value: "10.9%-dən", label: "İllik faiz dərəcəsi" },
    { value: "Zaminsiz", label: "Zamin tələb olunmur" },
  ],
  cards: [
    {
      title: "Rahat şərtlər",
      desc: "10.9%-dən başlayan 70 000 AZN-dək nağd pul kreditini banka gəlmədən tam onlayn və zaminsiz əldə edin.",
      image: "https://cdn.abb-bank.az/campaign_1be8dd5f07_1_0da8c5c62c.png",
    },
    {
      title: "Sürətli rəsmiləşdirmə",
      desc: "Nağd pul kreditini onlayn sifariş edib sürətli rəsmiləşdirmə ilə qısa müddətdə əldə edə bilərsiniz.",
      image: "https://cdn.abb-bank.az/image_3bed4cc145_ed838f246d.png",
    },
    {
      title: "Kredit ödənişi tarixinin dəyişdirilməsi imkanı",
      desc: "Filiallarımızda rəsmiləşdirilən nağd kreditlər üçün kredit ödənişi tarixinin 15 günədək uzadılması imkanı mövcuddur.",
      image: "https://cdn.abb-bank.az/web_Calend_d39f56b5d7.png",
    },
    {
      title: "Könüllü kredit həyat sığortası",
      desc: "Kredit həyat sığortası ilə kreditinizi sığortalayaraq illik faiz dərəcəsinə güzəşt əldə edin.",
      image: "https://cdn.abb-bank.az/image_9dbdeb7c29.png",
    },
  ],
  plans: [
    {
      title: "Səyahət",
      desc: "Aviabilet almaq, hotel rezervasiya etmək və əvəzolunmaz təcrübələr yaşamaq.",
    },
    {
      title: "Təhsil",
      desc: "Təhsil haqqını və kurs ödənişlərini qarşılamaq.",
    },
    {
      title: "Avtomobil",
      desc: "Avtomobil almaq, təmir etmək və yeniləmək.",
    },
    {
      title: "Şəxsi ehtiyaclar",
      desc: "Mebel və elektronika almaq, xüsusi günlər qeyd etmək.",
    },
  ],
  sections: [
    "Nağd kreditin üstünlükləri",
    "Nə planınız var?",
    "İndi hesabla",
  ],
};

out["/ferdi/emanetler/digideposit"] = {
  ...out["/ferdi/emanetler/digideposit"],
  title: "DigiDeposit - Tamamilə rəqəmsal",
  description:
    "Pulunuzun dəyərini etibarlı və rahat şəkildə artırın. DigiDeposit ilə qazanmağa başlayın.",
  cta: "Hesab açın",
  heroImage: "https://cdn.abb-bank.az/large_Digi_Deposit_step1_2_e311ac4618.png",
  breadcrumbs: ["Fərdi", "Əmanətlər", "DigiDeposit"],
  stats: [
    { value: "30-a qədər", label: "Depozit sayı" },
    { value: "18 ayadək", label: "Müddət" },
    { value: "10%-dək", label: "İllik gəlir" },
    { value: "Cəriməsiz", label: "Vaxtından əvvəl çıxarış" },
  ],
  cards: [
    {
      title: "Tamamilə onlayn",
      desc: "ABB mobile vasitəsilə istənilən vaxt, istənilən yerdə 30-a qədər depozit yaradın. Rəsmiləşmə zamanı müqavilənin avtomatik uzanması seçimi mümkündür.",
      image: "https://cdn.abb-bank.az/large_Digi_Deposit_step1_2_e311ac4618.png",
    },
    {
      title: "Yüksək gəlir",
      desc: "18 ayadək depozit müddəti ilə illik 10%-dək qazanın. Üstəlik, müqavilənin bitmə tarixinə 90 gün qalanadək depozitinizi artırın.",
      image: "https://cdn.abb-bank.az/large_Digi_Deposit_step1_6_8f18c28f1e.png",
    },
    {
      title: "Sərbəst çıxarış",
      desc: "Vəsaiti vaxtından əvvəl onlayn şəkildə cəriməsiz çıxarın, maliyyə çevikliyindən yararlanın.",
      image: "https://cdn.abb-bank.az/large_Digi_Deposit_step1_6_2c6ab534a9.png",
    },
  ],
  steps: [
    "ABB mobile-a daxil olun",
    "“+” ikonuna toxunub “DigiDeposit”i seçin",
    "Açılan pəncərədə “İndi başla”ya klikləyin",
  ],
};

fs.writeFileSync(
  "src/lib/data/sectionPages.json",
  JSON.stringify(out, null, 2),
  "utf8"
);
console.log("DONE live scrape", ROUTES.length);

await browser.close();
