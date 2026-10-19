import fs from "fs";
import { parse } from "node-html-parser";

const ROUTE_LIST = [
  "/ferdi",
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
  "/ferdi/digitravel",
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
  "/ferdi/abb-mobile-odenisler",
  "/ferdi/xidmet-sebekesi",
  "/abb-mobile",
  "/abb-esim",
  "/faydali-linkler",
  "/biznes",
  "/biznes/korporativ",
  "/biznes/korporativ/korporativ-kreditler",
  "/biznes/korporativ/odenis-kartlari-1",
  "/biznes/korporativ/hesablar-1",
  "/biznes/korporativ/kocurmeler-1",
  "/biznes/korporativ/senedli-emeliyyatlar-1",
  "/biznes/kicik-ve-orta-biznes",
  "/biznes/kicik-ve-orta-biznes/islam-bankcilig",
  "/biznes/mikro-biznes",
  "/haqqimizda",
  "/haqqimizda/rekvizitler",
  "/haqqimizda/missiya-ve-strateji-baxis",
  "/haqqimizda/korporativ-sosial-mesuliyyet",
  "/haqqimizda/muxbir-banklar",
  "/haqqimizda/istirak-payi",
  "/haqqimizda/mukafatlar",
  "/haqqimizda/rehberlik",
  "/haqqimizda/idareetme-ve-komiteler",
  "/haqqimizda/senedler",
  "/haqqimizda/siyasetlerimiz",
  "/haqqimizda/arasdirma",
  "/haqqimizda/hesabatlar",
  "/haqqimizda/huquqi-icmal",
  "/haqqimizda/teklif-ve-iradlar",
  "/haqqimizda/investisiya-bankciligi",
  "/haqqimizda/brend-merkezi",
  "/haqqimizda/satinalmalar/musabiqelerin-elani",
  "/korporativ-teqdimat",
  "/standart-sertler-ve-melumatlandirma-formalari",
  "/investorlarla-elaqe",
];

const SKIP =
  /Banner_ABB_Mobile|onelinkto|favicon|logo_|Twitter|Youtube|Instagram|Facebook|Linkedin|qr_|QR|infobank|174359|logo_msp|logo_esg|virtual_qarabag|yenilogo|apple-touch|image_506_edd0057a05|icon_/i;

const NAV =
  /^(Fərdi|Biznes|Haqqımızda|İnvestorlarla əlaqə|Xəbərlər|AZ|937|Xidmət şəbəkəsi|Ana səhifə|Davam et|ABB)$/i;

const BAD_DESC =
  /Fikirlərinizi|Rəyləriniz|cookie|©|hüquqlar qorunur|Karyera|Uğur hekayənizi|Bu bölmə real/i;

function cleanUrl(u) {
  if (!u) return null;
  let s = u
    .replace(/\\u002F/g, "/")
    .replace(/&amp;/g, "&")
    .replace(/^\/\//, "https://")
    .split("?")[0]
    .trim();
  if (!s.includes("cdn.abb-bank.az")) return null;
  if (SKIP.test(s) || /\.svg$/i.test(s) || /\.pdf$/i.test(s)) return null;
  if (/\/medium_/i.test(s)) s = s.replace("/medium_", "/large_");
  return s;
}

function preferLarge(u, html) {
  if (!u || /\/large_/i.test(u)) return u;
  const file = u.split("/").pop() || "";
  if (/^[0-9a-f]{16,}/i.test(file)) return u;
  if (html.includes(`large_${file}`)) {
    return `https://cdn.abb-bank.az/large_${file}`;
  }
  return u;
}

function text(el) {
  return (el?.textContent || "").replace(/\s+/g, " ").trim();
}

function uniq(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function scoreHero(u) {
  let s = 0;
  if (/large_/i.test(u)) s += 8;
  if (
    /689316|kredit_Rotation|cashloan|Digi_|kids_Deposit|Tam_Digi|Digitam|fly_Desk|ani_kredit|Mask_group|Deposit|Visa|sldier|slider|Vizual|rehberlik_|Governance|Documents|header_mockup|Meet_the_Brand/i.test(
      u
    )
  )
    s += 14;
  if (/campaign_|pul_|web_Calend|image_\d/i.test(u)) s += 3;
  return s;
}

function isDesktopImg(img) {
  const cls = (img.getAttribute("class") || "").toString();
  if (/lg:hidden/i.test(cls) && !/hidden lg:block/i.test(cls)) return false;
  return true;
}

async function scrape(route) {
  const res = await fetch(`https://abb-bank.az${route}`, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "accept-language": "az-AZ,az;q=0.9,en;q=0.8",
      accept: "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) return { route, status: res.status, ok: false };

  const html = Buffer.from(await res.arrayBuffer()).toString("utf8");
  const root = parse(html);
  const main = root.querySelector("main") || root.querySelector("body");

  const title =
    text(main.querySelector("h1")) ||
    text(root.querySelector("title")).split("|")[0].trim();

  const paragraphs = main
    .querySelectorAll("p")
    .map(text)
    .filter((t) => t.length > 55 && t.length < 380)
    .filter((t) => !BAD_DESC.test(t));

  const description =
    paragraphs.find((t) =>
      /AZN|kredit|faiz|əmanət|kart|keşbek|hesab|ipoteka|onlayn|bank|rəqəmsal|depozit/i.test(
        t
      )
    ) ||
    paragraphs[0] ||
    "";

  const imgEls = main.querySelectorAll("img").filter(isDesktopImg);
  const images = uniq(
    imgEls
      .map((img) =>
        preferLarge(
          cleanUrl(img.getAttribute("src") || img.getAttribute("data-src")),
          html
        )
      )
      .filter(Boolean)
  );

  const fromHtml = uniq(
    [
      ...html.matchAll(
        /https:\\u002F\\u002Fcdn\.abb-bank\.az\\u002F[A-Za-z0-9_.%-]+\.(?:png|jpe?g|webp)/gi
      ),
    ]
      .map((m) => preferLarge(cleanUrl(m[0]), html))
      .filter(Boolean)
  );

  const allImgs = uniq([...images, ...fromHtml]).sort(
    (a, b) => scoreHero(b) - scoreHero(a)
  );

  let heroImage = allImgs[0] || null;
  try {
    const curated = JSON.parse(
      fs.readFileSync("src/lib/data/sectionImages.json", "utf8")
    );
    if (curated[route]?.image) heroImage = curated[route].image;
  } catch {
    /* ignore */
  }

  const gallery = allImgs.filter((u) => u !== heroImage).slice(0, 12);

  const cta =
    main
      .querySelectorAll("a,button")
      .map(text)
      .find(
        (t) =>
          /sifariş et|müraciət et|ətraflı Bax|ətraflı|əldə et|indi al|hesabla|açın/i.test(
            t
          ) &&
          t.length < 36 &&
          !/tətbiqi yüklə/i.test(t)
      ) || "İndi sifariş et";

  // Stats
  const stats = [];
  const seen = new Set();
  const bodyText = text(main);
  const pairs = [
    [/(\d[\d\s]*AZN-dək)/i, "Məbləğ"],
    [/(\d+\s*ayadək)/i, "Müddət"],
    [/(\d+[.,]\d+%-dən|\d+%-dən)/i, "İllik faiz dərəcəsi"],
    [/(Zaminsiz)/i, "Zamin tələb olunmur"],
  ];
  for (const [rv, label] of pairs) {
    const mv = bodyText.match(rv);
    if (mv && !seen.has(mv[1])) {
      seen.add(mv[1]);
      stats.push({ value: mv[1], label });
    }
  }

  // Advantage cards: title + description pairs from compact text
  const advantages = [];
  const advPatterns = [
    /^(Rahat şərtlər)\s+(.+)$/i,
    /^(Sürətli rəsmiləşdirmə)\s+(.+)$/i,
    /^(Kredit ödənişi tarixinin dəyişdirilməsi imkanı)\s+(.+)$/i,
    /^(Könüllü kredit həyat sığortası)\s+(.+)$/i,
  ];
  for (const el of main.querySelectorAll("div,li,article,section")) {
    const t = text(el);
    if (t.length < 30 || t.length > 320) continue;
    for (const re of advPatterns) {
      const m = t.match(re);
      if (m && !advantages.some((a) => a.title === m[1])) {
        advantages.push({ title: m[1], desc: m[2].slice(0, 220) });
      }
    }
    if (advantages.length >= 4) break;
  }

  // Pair advantage images (desktop campaign/pul/calend)
  const advImages = uniq(
    imgEls
      .map((img) =>
        preferLarge(
          cleanUrl(img.getAttribute("src") || img.getAttribute("data-src")),
          html
        )
      )
      .filter(
        (u) =>
          u &&
          /campaign_|pul_|web_Calend|image_9db|image_3bed|cashloan|05_1_|Digi_|kids_|Tam_|Visa|Deposit|rehberlik_|fly_|ani_/i.test(
            u
          )
      )
  ).filter((u) => u !== heroImage);

  const cards = advantages.map((a, i) => ({
    title: a.title,
    desc: a.desc,
    image: advImages[i] || gallery[i] || heroImage,
  }));

  // Generic feature cards when no named advantages
  if (!cards.length) {
    const h3s = uniq(
      main
        .querySelectorAll("h3")
        .map(text)
        .filter((t) => t.length > 4 && t.length < 70 && !NAV.test(t))
        .filter(
          (t) =>
            !/nədir\?|necə |kimlər |hansı |mümkündür|vacibdir|hesablanması/i.test(
              t
            )
        )
    ).slice(0, 6);

    for (let i = 0; i < h3s.length; i++) {
      cards.push({
        title: h3s[i],
        desc: paragraphs[i + 1] || paragraphs[0] || "",
        image: advImages[i] || gallery[i] || null,
      });
    }
  }

  // Content blocks with unique images + nearby heading/desc
  const blocks = [];
  for (const img of imgEls) {
    const src = preferLarge(
      cleanUrl(img.getAttribute("src") || img.getAttribute("data-src")),
      html
    );
    if (!src || src === heroImage) continue;
    if (cards.some((c) => c.image === src)) continue;
    if (scoreHero(src) < 3 && !/Digi_|Deposit|Visa|Tam_|rehberlik|fly_/i.test(src))
      continue;

    let node = img.parentNode;
    let heading = "";
    let desc = "";
    for (let i = 0; i < 6 && node; i++) {
      const h = node.querySelector?.("h2,h3,h4");
      if (h) {
        const ht = text(h);
        if (!NAV.test(ht)) heading = ht;
      }
      for (const p of node.querySelectorAll?.("p") || []) {
        const pt = text(p);
        if (pt.length > 40 && !BAD_DESC.test(pt) && pt !== description) {
          desc = pt;
          break;
        }
      }
      if (heading && desc) break;
      node = node.parentNode;
    }
    if (!heading) continue;
    if (blocks.some((b) => b.image === src || b.title === heading)) continue;
    blocks.push({ title: heading, desc: desc.slice(0, 240), image: src });
    if (blocks.length >= 6) break;
  }

  const sections = uniq(
    main
      .querySelectorAll("h2")
      .map(text)
      .filter((t) => t.length > 4 && t.length < 110 && !NAV.test(t))
  ).slice(0, 8);

  // Plans section (Nə planınız var?) — title + desc pairs
  const plans = [];
  const planTitles = ["Səyahət", "Təhsil", "Avtomobil", "Şəxsi ehtiyaclar"];
  for (const name of planTitles) {
    const re = new RegExp(`${name}\\s+(.{20,160})`, "i");
    const m = bodyText.match(re);
    if (m) plans.push({ title: name, desc: m[1].split(/(?=[A-ZƏÖÜĞIŞÇ])/)[0].slice(0, 160) });
  }

  // Breadcrumbs
  const breadcrumbs = [];
  for (const a of main.querySelectorAll("a")) {
    const t = text(a);
    const href = a.getAttribute("href") || "";
    if (!href.startsWith("/") || t.length < 2 || t.length > 40) continue;
    if (/937|AZ|Xidmət|Axtar|İnvestor|Xəbər/i.test(t)) continue;
    if (!breadcrumbs.includes(t)) breadcrumbs.push(t);
    if (breadcrumbs.length >= 3) break;
  }

  // FAQ items (clean AZ questions)
  const faqs = uniq(
    main
      .querySelectorAll("h3")
      .map(text)
      .filter((t) => /\?$/.test(t) && t.length > 10 && t.length < 120)
  ).slice(0, 8);

  return {
    route,
    ok: true,
    status: 200,
    title,
    description,
    cta,
    heroImage,
    gallery,
    stats: stats.slice(0, 4),
    cards: cards.filter((c) => c.title && c.image).slice(0, 8),
    plans,
    faqs,
    sections,
    blocks,
    breadcrumbs: breadcrumbs.slice(0, 3),
    // legacy fields for compatibility
    features: cards.map((c) => c.title),
  };
}

// Gold overrides from live CDP for critical pages
const OVERRIDES = {
  "/ferdi/kreditler/nagd-kredit": {
    title: "Güzəştli Şərtlərlə Tam Onlayn Nağd Kredit",
    description:
      "70 000 AZN-dək nağd krediti filiala gəlmədən, elə olduğunuz yerdən əldə edin! Üstəlik, müraciət üçün rəsmi gəlir tələbi yoxdur.",
    cta: "İndi sifariş et",
    heroImage:
      "https://cdn.abb-bank.az/689316b85302e0ffde2e9d46ffb48279f7d446ca_63a07d9b03.png",
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
    breadcrumbs: ["Fərdi", "Bütün kreditlər", "Nağd kredit"],
  },
};

const out = {};
let i = 0;
for (const route of ROUTE_LIST) {
  i++;
  process.stdout.write(`[${i}/${ROUTE_LIST.length}] ${route} ... `);
  try {
    let data = await scrape(route);
    if (OVERRIDES[route]) {
      data = {
        ...data,
        ...OVERRIDES[route],
        ok: true,
        features: (OVERRIDES[route].cards || data.cards || []).map((c) => c.title),
        gallery: uniq([
          ...(OVERRIDES[route].cards || []).map((c) => c.image),
          ...(data.gallery || []),
        ]).filter((u) => u !== (OVERRIDES[route].heroImage || data.heroImage)),
      };
    }
    out[route] = data;
    console.log(
      data.ok
        ? `OK | ${data.title?.slice(0, 42)} | cards=${data.cards?.length || 0}`
        : `FAIL ${data.status}`
    );
  } catch (e) {
    console.log("ERR", e.message);
    out[route] = { route, ok: false, error: String(e.message) };
  }
  await new Promise((r) => setTimeout(r, 90));
}

fs.mkdirSync("src/lib/data", { recursive: true });
fs.writeFileSync(
  "src/lib/data/sectionPages.json",
  JSON.stringify(out, null, 2),
  "utf8"
);
console.log("wrote sectionPages.json", Object.keys(out).length);
