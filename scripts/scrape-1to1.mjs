/**
 * 1:1 scrape of every mega-menu internal page from abb-bank.az
 * Pairs cards by finding title nodes whose nearest container has exactly one CDN image.
 */
import fs from "fs";
import { chromium } from "playwright";
import { pathToFileURL } from "url";

// Inline mega routes (keep in sync with src/lib/data/megaMenu.ts)
const ROUTES = [
  // Fərdi
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
  "/faydali-linkler",
  // Biznes
  "/biznes/korporativ",
  "/biznes/kicik-ve-orta-biznes",
  "/biznes/mikro-biznes",
  "/biznes/korporativ/korporativ-kreditler",
  "/biznes/korporativ/korporativ-kreditler/iri-korporativ-musterilerin-kreditlesdirilmesi",
  "/biznes/korporativ/korporativ-kreditler/ixraca-destek-krediti",
  "/biznes/korporativ/odenis-kartlari-1",
  "/biznes/korporativ/odenis-kartlari-1/visa-business-platinum-1",
  "/biznes/korporativ/odenis-kartlari-1/mastercard-corporate-travel-expense",
  "/biznes/korporativ/odenis-kartlari-1/mastercard-business-1",
  "/biznes/korporativ/odenis-kartlari-1/visa-business-1",
  "/biznes/korporativ/odenis-kartlari-1/visa-business-gold-1",
  "/biznes/korporativ/odenis-kartlari-1/gomruk-karti-1",
  "/biznes/korporativ/odenis-kartlari-1/emekhaqqi-kartlari-1",
  "/biznes/korporativ/hesablar-1",
  "/biznes/korporativ/kocurmeler-1",
  "/biznes/korporativ/kocurmeler-1/pul-kocurmeleri-1",
  "/biznes/korporativ/kocurmeler-1/ani-odenis-sistemi",
  "/biznes/korporativ/senedli-emeliyyatlar-1",
  "/biznes/korporativ/senedli-emeliyyatlar-1/qarantiya-1",
  "/biznes/korporativ/senedli-emeliyyatlar-1/qarantiya-xetti-1",
  "/biznes/korporativ/senedli-emeliyyatlar-1/akkreditiv-1",
  "/biznes/korporativ/senedli-emeliyyatlar-1/inkasso-1",
  "/biznes/korporativ/senedli-emeliyyatlar-1/layihelerin-maliyyelesmesi-1",
  "/biznes/kicik-ve-orta-biznes/islam-bankcilig",
  // Haqqımızda
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
  /Banner_ABB_Mobile|onelinkto|favicon|Twitter_|Youtube_|Instagram_|Facebook_|Linkedin_|apple-touch|image_506_edd0057a05/i;

function toLarge(url) {
  if (!url || !url.includes("cdn.abb-bank.az")) return url;
  if (/\/(large_|icon_|small_)/i.test(url) || /\.svg$/i.test(url)) return url;
  if (/\/medium_/i.test(url)) return url.replace("/medium_", "/large_");
  return url.replace("cdn.abb-bank.az/", "cdn.abb-bank.az/large_");
}

const existing = JSON.parse(
  fs.readFileSync("src/lib/data/sectionPages.json", "utf8")
);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  locale: "az-AZ",
});

for (let i = 0; i < ROUTES.length; i++) {
  const route = ROUTES[i];
  process.stdout.write(`[${i + 1}/${ROUTES.length}] ${route} ... `);
  try {
    await page.goto(`https://abb-bank.az${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(1500);
    for (const y of [600, 1400, 2400, 3600]) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(200);
    }

    try {
      const faqTab = page.getByRole("button", { name: /^FAQ$/i });
      if (await faqTab.count()) await faqTab.first().click({ timeout: 800 });
    } catch {
      /* */
    }

    const data = await page.evaluate(async (skipSrc) => {
      const SKIP = new RegExp(skipSrc, "i");
      const txt = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
      const clean = (u) => (u || "").split("?")[0];
      const BAD =
        /Fikirlərinizi|cookie|©|hüquqlar qorunur|Karyera|Səhifəni dəyərləndirin|ABB mobile yükləmək|Mobil nömrə|FİN kod|Davam et|razılıq verirəm/i;
      const NAV =
        /^(Fərdi|Biznes|Haqqımızda|İnvestorlarla əlaqə|Xəbərlər|AZ|EN|937|Xidmət şəbəkəsi|Ödəniş|FAQ)$/i;

      const main = document.querySelector("main") || document.body;
      const title = txt(main.querySelector("h1")) || "";

      const paragraphs = [...main.querySelectorAll("p")]
        .map(txt)
        .filter((t) => t.length > 35 && t.length < 500 && !BAD.test(t));
      const description =
        paragraphs.find((t) =>
          /AZN|kredit|faiz|əmanət|kart|keşbek|hesab|bank|onlayn|rəqəmsal|depozit|ödəniş|biznes|korporativ|rəhbər|missiya/i.test(
            t
          )
        ) ||
        paragraphs[0] ||
        "";

      const cta =
        [...main.querySelectorAll("a,button")]
          .map(txt)
          .find(
            (t) =>
              /sifariş et|müraciət|hesab aç|ətraflı|əldə et|indi al|başla|əlaqə|yüklə/i.test(
                t
              ) &&
              t.length < 40 &&
              !/tətbiqi yüklə/i.test(t)
          ) || "Ətraflı";

      // Images
      const imgs = [];
      for (const img of main.querySelectorAll("img")) {
        let url = clean(img.currentSrc || img.src);
        if (!url.includes("cdn.abb-bank.az") || SKIP.test(url)) continue;
        if (/icon_/i.test(url) && (img.naturalWidth || 0) < 80) continue;
        imgs.push({
          url,
          w: img.naturalWidth || 0,
          near: txt(img.closest("div") || img.parentElement).slice(0, 160),
        });
      }
      const heroImage =
        imgs.find((i) => i.w >= 400 && !/\.svg$/i.test(i.url))?.url ||
        imgs[0]?.url ||
        null;
      const gallery = [
        ...new Set(
          imgs
            .map((i) => i.url)
            .filter((u) => u !== heroImage && !/\.svg$/i.test(u))
        ),
      ].slice(0, 16);

      // Cards: title node whose ancestor has exactly 1 non-icon CDN image
      const cards = [];
      const titleNodes = [...main.querySelectorAll("p, h3, h4, span")].filter(
        (el) => {
          const t = txt(el);
          return (
            t.length >= 4 &&
            t.length <= 90 &&
            !/\?$/.test(t) &&
            !NAV.test(t) &&
            !BAD.test(t) &&
            el.children.length === 0
          );
        }
      );

      for (const node of titleNodes) {
        const titleText = txt(node);
        let root = node.parentElement;
        let found = null;
        for (let d = 0; d < 8 && root; d++) {
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
                x.w >= 80
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
                  !BAD.test(t)
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
          !cards.some((c) => c.title === found.title || c.image === found.image)
        ) {
          cards.push(found);
        }
        if (cards.length >= 8) break;
      }

      // Content sections from h2
      const contentSections = [];
      for (const h of main.querySelectorAll("h2")) {
        const hTitle = txt(h);
        if (!hTitle || hTitle.length < 6 || NAV.test(hTitle) || /\?$/.test(hTitle))
          continue;
        if (/üstünlük|planınız|addım|ABB mobile-dan/i.test(hTitle) && hTitle.length < 50)
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
        if (desc && !contentSections.some((s) => s.title === hTitle)) {
          contentSections.push({ title: hTitle, desc: desc.slice(0, 900) });
        }
      }

      // Steps
      const stepDetails = [];
      for (const h of main.querySelectorAll("h3")) {
        const hTitle = txt(h);
        if (!hTitle || hTitle.length < 8 || hTitle.length > 100) continue;
        if (
          !/daxil olun|klik|seçin|toxun|sifariş|təsdiq|alın|açın|başla|müraciət/i.test(
            hTitle
          )
        )
          continue;
        const root = h.parentElement;
        const desc =
          [...(root?.querySelectorAll("p") || [])]
            .map(txt)
            .find((t) => t.length > 15 && t.length < 260) || "";
        if (!stepDetails.some((s) => s.title === hTitle)) {
          stepDetails.push({ title: hTitle, desc: desc.slice(0, 220) });
        }
        if (stepDetails.length >= 4) break;
      }

      // Plans
      const plans = [];
      for (const name of ["Səyahət", "Təhsil", "Avtomobil", "Şəxsi ehtiyaclar"]) {
        const el = [...main.querySelectorAll("p,h3,h4,div")].find(
          (e) => txt(e) === name
        );
        if (!el) continue;
        let root = el.parentElement;
        let desc = "";
        for (let d = 0; d < 5 && root; d++) {
          const ps = [...root.querySelectorAll("p")]
            .map(txt)
            .filter((p) => p !== name && p.length > 12 && p.length < 160);
          if (ps[0]) {
            desc = ps[0];
            break;
          }
          root = root.parentElement;
        }
        if (desc) plans.push({ title: name, desc });
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
        await new Promise((r) => setTimeout(r, 120));
        const item =
          btn.closest('[class*="border-b"], details, li, div') ||
          btn.parentElement;
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

      const sections = [...main.querySelectorAll("h2, [class*='text-']")]
        .map(txt)
        .filter((t) =>
          /üstünlük|planınız|addım|ABB mobile-dan|Tez-tez/i.test(t)
        )
        .filter((t, idx, a) => a.indexOf(t) === idx)
        .slice(0, 8);

      const crumbs = [];
      const crumb =
        main.querySelector('[aria-label="breadcrumb"]') ||
        main.querySelector('nav[aria-label="breadcrumb"]');
      if (crumb) {
        for (const el of crumb.querySelectorAll("a, li, span")) {
          const t = txt(el);
          if (t && t.length < 50 && t !== "›" && !crumbs.includes(t)) crumbs.push(t);
        }
      }

      return {
        title,
        description,
        cta,
        heroImage,
        gallery,
        cards,
        plans,
        stepDetails,
        steps: stepDetails.map((s) => s.title),
        contentSections,
        faqs,
        sections: [
          ...sections,
          ...contentSections.map((s) => s.title),
        ].filter((t, idx, a) => a.indexOf(t) === idx).slice(0, 12),
        breadcrumbs: crumbs.slice(0, 6),
        stats: [],
        logos: [],
        ok: true,
      };
    }, SKIP.source);

    // Upgrade images to large_
    const upgrade = (u) => (u ? toLarge(u) : u);
    data.heroImage = upgrade(data.heroImage);
    data.gallery = (data.gallery || []).map(upgrade);
    data.cards = (data.cards || []).map((c) => ({
      ...c,
      image: upgrade(c.image),
    }));

    const prev = existing[route] || { route };
    existing[route] = {
      ...prev,
      ...data,
      route,
      ok: true,
      blocks: (data.contentSections || []).slice(0, 6).map((s, idx) => ({
        title: s.title,
        desc: s.desc,
        image: data.gallery[idx] || data.heroImage || "",
      })),
    };

    console.log(
      `OK cards=${data.cards.length} secs=${data.contentSections.length} faqs=${data.faqs.length} plans=${data.plans.length}`
    );
  } catch (e) {
    console.log("ERR", e.message);
  }
}

// Exact gold for nagd-kredit (verified live DOM)
existing["/ferdi/kreditler/nagd-kredit"] = {
  ...existing["/ferdi/kreditler/nagd-kredit"],
  route: "/ferdi/kreditler/nagd-kredit",
  ok: true,
  title: "Güzəştli Şərtlərlə Tam Onlayn Nağd Kredit",
  description:
    "70 000 AZN-dək nağd krediti filiala gəlmədən, elə olduğunuz yerdən əldə edin! Üstəlik, müraciət üçün rəsmi gəlir tələbi yoxdur.",
  cta: "İndi sifariş et",
  heroImage:
    "https://cdn.abb-bank.az/large_689316b85302e0ffde2e9d46ffb48279f7d446ca_63a07d9b03.png",
  stats: [],
  cards: [
    {
      title: "Rahat şərtlər",
      desc: "10.9%-dən başlayan 70 000 AZN-dək nağd pul kreditini banka gəlmədən tam onlayn və zaminsiz əldə edin.",
      image:
        "https://cdn.abb-bank.az/large_campaign_1be8dd5f07_1_0da8c5c62c.png",
    },
    {
      title: "Sürətli rəsmiləşdirmə",
      desc: "Nağd pul kreditini onlayn sifariş edib sürətli rəsmiləşdirmə ilə qısa müddətdə əldə edə bilərsiniz.",
      image: "https://cdn.abb-bank.az/large_image_3bed4cc145_ed838f246d.png",
    },
    {
      title: "Kredit ödənişi tarixinin dəyişdirilməsi imkanı",
      desc: "Filiallarımızda rəsmiləşdirilən nağd kreditlər üçün kredit ödənişi tarixinin 15 günədək uzadılması imkanı mövcuddur.",
      image: "https://cdn.abb-bank.az/large_web_Calend_d39f56b5d7.png",
    },
    {
      title: "Könüllü kredit həyat sığortası",
      desc: "Kredit həyat sığortası ilə kreditinizi sığortalayaraq illik faiz dərəcəsinə güzəşt əldə edin.",
      image: "https://cdn.abb-bank.az/large_image_9dbdeb7c29.png",
    },
  ],
  plans: [
    {
      title: "Səyahət",
      desc: "Aviabilet almaq, hotel rezervasiya etmək və əvəzolunmaz tərcübələr yaşamaq",
    },
    { title: "Təhsil", desc: "Təhsil haqqını və kurs ödənişlərini qarşılamaq" },
    { title: "Avtomobil", desc: "Avtomobil almaq, təmir etmək və yeniləmək" },
    {
      title: "Şəxsi ehtiyaclar",
      desc: "Mebel və elektronika almaq, xüsusi günlər qeyd etmək",
    },
  ],
  stepDetails: [
    {
      title: "Onlayn kredit sifariş edin",
      desc: "Kredit müraciətini tez və asanlıqla onlayn tamamlamaq mümkündür.",
    },
    { title: "Sürətli təsdiq", desc: "Sizin müraciət dərhal qeydə alınır." },
    {
      title: "Kredit məbləğini alın",
      desc: "ABB kartına köçürmə, Bakı və Abşeron üzrə pulsuz kuryer çatdırılması və ya istənilən ABB filialından əldə edə bilərsiniz.",
    },
  ],
  steps: [
    "Onlayn kredit sifariş edin",
    "Sürətli təsdiq",
    "Kredit məbləğini alın",
  ],
  sections: [
    "Nağd kreditin üstünlükləri",
    "Nə planınız var?",
    "ABB mobile-dan 3 addıma nağd kredit alın",
  ],
  breadcrumbs: ["Fərdi", "Bütün kreditlər", "Nağd kredit"],
};

fs.writeFileSync(
  "src/lib/data/sectionPages.json",
  JSON.stringify(existing, null, 2),
  "utf8"
);
console.log("DONE 1:1 scrape", ROUTES.length);
await browser.close();
