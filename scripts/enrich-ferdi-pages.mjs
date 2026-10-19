/**
 * Deep-enrich every Fərdi mega-menu route from abb-bank.az
 * — titles, descriptions, CTAs, stats, cards, images, logos
 */
import fs from "fs";
import { parse } from "node-html-parser";

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
  /Banner_ABB_Mobile_AZ_1d0d27e342|onelinkto|favicon|Twitter_|Youtube_|Instagram_|Facebook_|Linkedin_|qr_|infobank|174359|logo_msp|logo_esg|virtual_qarabag|yenilogo|apple-touch|image_506_edd0057a05/i;

const NAV =
  /^(Fərdi|Biznes|Haqqımızda|İnvestorlarla əlaqə|Xəbərlər|AZ|937|Xidmət şəbəkəsi|Ana səhifə|Davam et|ABB|Tətbiqi yüklə)$/i;

const BAD =
  /Fikirlərinizi|Rəyləriniz|cookie|©|hüquqlar qorunur|Karyera|Uğur hekayənizi|Səhifəni dəyərləndirin/i;

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
  if (/\/medium_/i.test(s)) s = s.replace("/medium_", "/large_");
  return s;
}

function preferLarge(u, html) {
  if (!u || /\/large_/i.test(u)) return u;
  const file = u.split("/").pop() || "";
  if (/^[0-9a-f]{16,}/i.test(file)) return u;
  if (html.includes(`large_${file}`)) return `https://cdn.abb-bank.az/large_${file}`;
  return u;
}

function text(el) {
  return (el?.textContent || "").replace(/\s+/g, " ").trim();
}

function uniq(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function scoreImg(u) {
  let s = 0;
  if (/large_/i.test(u)) s += 6;
  if (/\.(png|jpe?g|webp)$/i.test(u)) s += 3;
  if (/\.svg$/i.test(u)) s -= 8;
  if (/icon_/i.test(u)) s -= 4;
  if (
    /kredit|Deposit|Digi|Visa|Tam_|Kart|cashloan|kids|Mask|fly_|ani_|Rotation|step|Vizual|Loan|master|campaign_|pul_|Calend|rehberlik|header_mockup|sldier|slider/i.test(
      u
    )
  )
    s += 10;
  return s;
}

function isDesktop(img) {
  const cls = (img.getAttribute("class") || "").toString();
  if (/lg:hidden/i.test(cls) && !/hidden\s+lg:block/i.test(cls)) return false;
  return true;
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
  if (!res.ok) return { route, ok: false, status: res.status };

  const html = Buffer.from(await res.arrayBuffer()).toString("utf8");
  const root = parse(html);
  const main = root.querySelector("main") || root.querySelector("body");

  const title =
    text(main.querySelector("h1")) ||
    text(root.querySelector("title")).split("|")[0].trim();

  const paragraphs = main
    .querySelectorAll("p")
    .map(text)
    .filter((t) => t.length > 40 && t.length < 400)
    .filter((t) => !BAD.test(t));

  const description =
    paragraphs.find((t) =>
      /AZN|kredit|faiz|əmanət|kart|keşbek|hesab|ipoteka|onlayn|bank|rəqəmsal|depozit|ödəniş|köçürm|sığorta|invest/i.test(
        t
      )
    ) ||
    paragraphs[0] ||
    "";

  // subtitle under h1 often shorter
  const h1 = main.querySelector("h1");
  let subtitle = "";
  if (h1?.parentNode) {
    const near = h1.parentNode
      .querySelectorAll("p")
      .map(text)
      .filter((t) => t.length > 20 && t.length < 200 && !BAD.test(t));
    subtitle = near[0] || "";
  }

  const imgEls = main.querySelectorAll("img").filter(isDesktop);
  const images = uniq(
    imgEls
      .map((img) =>
        preferLarge(
          cleanUrl(img.getAttribute("src") || img.getAttribute("data-src")),
          html
        )
      )
      .filter(Boolean)
  ).sort((a, b) => scoreImg(b) - scoreImg(a));

  // logos (svg/png with logo_ in name — keep separate)
  const logos = uniq(
    [...html.matchAll(/https:\\u002F\\u002Fcdn\.abb-bank\.az\\u002F[^"'\\\s]+/gi)]
      .map((m) => cleanUrl(m[0]))
      .filter((u) => u && (/logo/i.test(u) || /\.svg$/i.test(u)))
      .filter((u) => !/Twitter|Youtube|Instagram|Facebook|Linkedin|favicon/i.test(u))
  ).slice(0, 12);

  const productImgs = images.filter((u) => !/\.svg$/i.test(u) && !/icon_/i.test(u));

  let heroImage = productImgs[0] || null;
  try {
    const curated = JSON.parse(
      fs.readFileSync("src/lib/data/sectionImages.json", "utf8")
    );
    if (curated[route]?.image) heroImage = curated[route].image;
  } catch {
    /* */
  }

  const gallery = productImgs.filter((u) => u !== heroImage).slice(0, 14);

  const cta =
    main
      .querySelectorAll("a,button")
      .map(text)
      .find(
        (t) =>
          /sifariş et|müraciət|hesab aç|ətraflı|əldə et|indi al|hesabla|başla|ödə|köçür|yüklə|randevu/i.test(
            t
          ) &&
          t.length < 40 &&
          !/tətbiqi yüklə/i.test(t)
      ) || "Ətraflı";

  // stats
  const stats = [];
  const seen = new Set();
  const bodyText = text(main);
  for (const [rv, label] of [
    [/(\d[\d\s]*AZN-dək)/i, "Məbləğ"],
    [/(\d+\s*ayadək)/i, "Müddət"],
    [/(\d+[.,]\d+%-dən|\d+%-dən|\d+%-dək)/i, "Faiz / gəlir"],
    [/(Zaminsiz)/i, "Zamin tələb olunmur"],
    [/(Cəriməsiz)/i, "Vaxtından əvvəl çıxarış"],
    [/(\d+-a qədər|\d+-ə qədər)/i, "Limit"],
  ]) {
    const m = bodyText.match(rv);
    if (m && !seen.has(m[1])) {
      seen.add(m[1]);
      stats.push({ value: m[1], label });
    }
  }

  // Feature cards: look for short title + following paragraph patterns in divs
  const cards = [];
  const cardTitles = uniq(
    main
      .querySelectorAll("h3,h4")
      .map(text)
      .filter((t) => t.length > 3 && t.length < 70 && !NAV.test(t))
      .filter((t) => !/\?$/.test(t))
      .filter(
        (t) =>
          !/Fərdi|Biznes|Haqqımızda|hesablanması|nədir$/i.test(t) ||
          /onlayn|gəlir|çıxarış|şərt|rəsmiləş|keşbek|kart|əmanət|hesab/i.test(t)
      )
  ).slice(0, 8);

  for (let i = 0; i < Math.min(cardTitles.length, 6); i++) {
    const titleC = cardTitles[i];
    // find description near this title in HTML
    let desc = "";
    for (const el of main.querySelectorAll("h3,h4")) {
      if (text(el) !== titleC) continue;
      let p = el.nextElementSibling;
      for (let k = 0; k < 4 && p; k++) {
        if (p.tagName === "P") {
          const pt = text(p);
          if (pt.length > 30 && !BAD.test(pt)) {
            desc = pt;
            break;
          }
        }
        p = p.nextElementSibling;
      }
      if (!desc) {
        const parent = el.parentNode;
        const pp = parent
          ?.querySelectorAll("p")
          .map(text)
          .find((t) => t.length > 30 && !BAD.test(t));
        if (pp) desc = pp;
      }
      break;
    }
    cards.push({
      title: titleC,
      desc: (desc || paragraphs[i + 1] || "").slice(0, 240),
      image: gallery[i] || heroImage,
    });
  }

  // Named advantages for loan pages
  const advPairs = [
    [/Rahat şərtlər\s+(.{40,220})/i, "Rahat şərtlər"],
    [/Sürətli rəsmiləşdirmə\s+(.{40,220})/i, "Sürətli rəsmiləşdirmə"],
    [/Kredit ödənişi tarixinin dəyişdirilməsi imkanı\s+(.{40,220})/i, "Kredit ödənişi tarixinin dəyişdirilməsi imkanı"],
    [/Könüllü kredit həyat sığortası\s+(.{40,220})/i, "Könüllü kredit həyat sığortası"],
    [/Tamamilə onlayn\s+(.{40,220})/i, "Tamamilə onlayn"],
    [/Yüksək gəlir\s+(.{40,220})/i, "Yüksək gəlir"],
    [/Sərbəst çıxarış\s+(.{40,220})/i, "Sərbəst çıxarış"],
  ];
  const namedCards = [];
  const advImgs = gallery.filter((u) =>
    /campaign_|pul_|web_Calend|image_9|image_3bed|cashloan|Digi_|Deposit|Visa|Tam_|kids|step/i.test(u)
  );
  for (const [re, titleA] of advPairs) {
    const m = bodyText.match(re);
    if (m) {
      namedCards.push({
        title: titleA,
        desc: m[1].replace(/\s+/g, " ").slice(0, 220),
        image: advImgs[namedCards.length] || gallery[namedCards.length] || heroImage,
      });
    }
  }

  const finalCards = (namedCards.length >= 2 ? namedCards : cards)
    .filter((c) => c.title && c.image)
    .slice(0, 6);

  // steps
  const steps = uniq(
    main
      .querySelectorAll("h3")
      .map(text)
      .filter((t) => /daxil olun|seçin|klikləyin|addım|toxunun|başla/i.test(t))
  ).slice(0, 6);

  const sections = uniq(
    main
      .querySelectorAll("h2")
      .map(text)
      .filter((t) => t.length > 3 && t.length < 110 && !NAV.test(t))
  ).slice(0, 10);

  const faqs = uniq(
    main
      .querySelectorAll("h3")
      .map(text)
      .filter((t) => /\?$/.test(t) && t.length > 12 && t.length < 140)
  ).slice(0, 10);

  // breadcrumbs from nav[aria] or links
  const breadcrumbs = [];
  const crumbNav = main.querySelector('[aria-label="breadcrumb"], nav[aria-label="breadcrumb"], nav.breadcrumb');
  if (crumbNav) {
    for (const a of crumbNav.querySelectorAll("a, span, li")) {
      const t = text(a);
      if (t && t.length < 40 && !breadcrumbs.includes(t)) breadcrumbs.push(t);
    }
  }
  if (!breadcrumbs.length) {
    for (const a of main.querySelectorAll("a")) {
      const t = text(a);
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("/") || t.length < 2 || t.length > 36) continue;
      if (/937|AZ|Xidmət|Axtar|İnvestor|Xəbər/i.test(t)) continue;
      if (!breadcrumbs.includes(t)) breadcrumbs.push(t);
      if (breadcrumbs.length >= 3) break;
    }
  }

  // blocks
  const blocks = [];
  for (const img of imgEls) {
    const src = preferLarge(
      cleanUrl(img.getAttribute("src") || img.getAttribute("data-src")),
      html
    );
    if (!src || src === heroImage || /\.svg$/i.test(src) || /icon_/i.test(src)) continue;
    if (finalCards.some((c) => c.image === src)) continue;
    let node = img.parentNode;
    let heading = "";
    let desc = "";
    for (let i = 0; i < 6 && node; i++) {
      const h = node.querySelector?.("h2,h3");
      if (h) {
        const ht = text(h);
        if (!NAV.test(ht) && !/\?$/.test(ht)) heading = ht;
      }
      for (const p of node.querySelectorAll?.("p") || []) {
        const pt = text(p);
        if (pt.length > 40 && !BAD.test(pt) && pt !== description) {
          desc = pt;
          break;
        }
      }
      if (heading && desc) break;
      node = node.parentNode;
    }
    if (!heading) continue;
    if (blocks.some((b) => b.title === heading || b.image === src)) continue;
    blocks.push({ title: heading, desc: desc.slice(0, 240), image: src });
    if (blocks.length >= 6) break;
  }

  return {
    route,
    ok: true,
    status: 200,
    title,
    description: description || subtitle,
    subtitle,
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
    breadcrumbs: breadcrumbs.slice(0, 4),
    features: finalCards.map((c) => c.title),
    plans: [],
  };
}

// Keep hand-tuned gold pages
const GOLD = {
  "/ferdi/kreditler/nagd-kredit": {
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
      "Nağd krediti nədir və kimlər üçün uyğundur?",
    ],
  },
  "/ferdi/emanetler/digideposit": {
    title: "DigiDeposit - Tamamilə rəqəmsal",
    description:
      "Pulunuzun dəyərini etibarlı və rahat şəkildə artırın. DigiDeposit ilə qazanmağa başlayın.",
    cta: "Hesab açın",
    heroImage:
      "https://cdn.abb-bank.az/large_Digi_Deposit_step1_2_e311ac4618.png",
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
    sections: ["3 addımda DigiDeposit hesabı açın.", "Əmanətlərin sığortalanması şərtləri"],
  },
};

const existing = JSON.parse(
  fs.readFileSync("src/lib/data/sectionPages.json", "utf8")
);

let i = 0;
for (const route of ROUTES) {
  i++;
  process.stdout.write(`[${i}/${ROUTES.length}] ${route} ... `);
  try {
    let data = await scrape(route);
    if (GOLD[route]) {
      data = {
        ...data,
        ...GOLD[route],
        ok: true,
        features: (GOLD[route].cards || []).map((c) => c.title),
        gallery: uniq([
          ...(GOLD[route].cards || []).map((c) => c.image),
          ...(data.gallery || []),
        ]).filter((u) => u !== (GOLD[route].heroImage || data.heroImage)),
      };
    }
    existing[route] = { ...existing[route], ...data };
    console.log(
      data.ok
        ? `OK | ${String(data.title).slice(0, 40)} | imgs=${data.gallery?.length || 0} cards=${data.cards?.length || 0}`
        : `FAIL ${data.status}`
    );
  } catch (e) {
    console.log("ERR", e.message);
  }
  await new Promise((r) => setTimeout(r, 100));
}

fs.writeFileSync(
  "src/lib/data/sectionPages.json",
  JSON.stringify(existing, null, 2),
  "utf8"
);
console.log("enriched", ROUTES.length, "total keys", Object.keys(existing).length);
