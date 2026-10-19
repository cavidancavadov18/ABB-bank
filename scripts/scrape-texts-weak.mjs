/**
 * Re-scrape Fərdi pages that still lack contentSections / FAQ answers.
 * More aggressive DOM extraction for pages without h2 article sections.
 */
import fs from "fs";
import { chromium } from "playwright";

const existing = JSON.parse(
  fs.readFileSync("src/lib/data/sectionPages.json", "utf8")
);

const WEAK = Object.keys(existing).filter((route) => {
  if (!ROUTES_SET_HAS(route)) return false;
  const x = existing[route];
  const secs = (x.contentSections || []).length;
  const faqs = x.faqs || [];
  const faqA = faqs.filter(
    (f) => typeof f === "object" && (f.a || "").length > 40
  ).length;
  const cardsWithDesc = (x.cards || []).filter((c) => (c.desc || "").length > 40)
    .length;
  return secs === 0 && faqA === 0 && cardsWithDesc < 2;
});

function ROUTES_SET_HAS(route) {
  return (
    route.startsWith("/ferdi") ||
    route === "/abb-mobile" ||
    route === "/abb-esim" ||
    route === "/faydali-linkler"
  );
}

// Always include known product pages that need card/step text
const EXTRA = [
  "/ferdi/emanetler/klassik-emaneti",
  "/ferdi/emanetler/usaq-yigim-emaneti",
  "/ferdi/emanetler/depozit-seyfi",
  "/ferdi/emanetler/emanetli-ipoteka-krediti",
  "/ferdi/kreditler/avans-kredit-xetti",
  "/ferdi/kreditler/emanetci-nagd-krediti",
  "/ferdi/kreditler/emanetci-kredit-limiti",
  "/ferdi/kreditler/indi-al-sonra-ode",
  "/ferdi/kreditler/avtomobil-krediti",
  "/ferdi/kreditler/ipoteka-krediti",
  "/ferdi/butun-hesablar/digihesab",
  "/ferdi/butun-hesablar/digihesab-max",
  "/ferdi/butun-hesablar/cari-hesab",
  "/ferdi/butun-hesablar/dama-dama",
  "/ferdi/kesbek/faydali-kesbek",
  "/ferdi/kesbek/fayda-max",
  "/ferdi/kesbek/faydali-klub",
  "/ferdi/sigorta",
  "/ferdi/investisiya",
  "/abb-esim",
  "/ferdi/digitravel",
  "/ferdi/cash-by-code",
  "/ferdi/pul-kocurmesi",
  "/ferdi/karta-medaxil",
  "/ferdi/pin-kod-deyisimi",
  "/ferdi/iane-et",
  "/ferdi/randevu",
];

const ROUTES = [...new Set([...WEAK, ...EXTRA])];

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
    await page.waitForTimeout(1400);
    for (const y of [800, 1600, 2800, 4000]) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(250);
    }

    // Open FAQ tab if present
    try {
      const faqTab = page.getByRole("button", { name: /^FAQ$/i });
      if (await faqTab.count()) await faqTab.first().click({ timeout: 1500 });
    } catch {
      /* */
    }
    await page.waitForTimeout(400);

    const texts = await page.evaluate(async () => {
      const txt = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
      const BAD =
        /Fikirlərinizi|Rəyləriniz|cookie|©|Karyera|Səhifəni dəyərləndirin|ABB mobile yükləmək|Mobil nömrə|FİN kod|Davam et|razılıq verirəm|Şifrə|OTP/i;
      const NAV = /^(Fərdi|Biznes|Haqqımızda|AZ|EN|AZN|USD|EUR|Ödəniş|FAQ|Qeydlər|Şərtlər)$/i;
      const main = document.querySelector("main") || document.body;

      const title = txt(main.querySelector("h1")) || "";
      const allPs = [...main.querySelectorAll("p")]
        .map(txt)
        .filter((t) => t.length > 35 && t.length < 900 && !BAD.test(t));
      const description =
        allPs.find((t) =>
          /AZN|kredit|faiz|əmanət|kart|keşbek|hesab|ipoteka|onlayn|bank|rəqəmsal|depozit|ödəniş|səyahət|avans|keşbek/i.test(
            t
          )
        ) ||
        allPs[0] ||
        "";

      // Pair short headings (h2/h3/h4/strong) with following long paragraphs
      const contentSections = [];
      const headings = [...main.querySelectorAll("h2, h3, h4")];
      for (const h of headings) {
        const hTitle = txt(h);
        if (!hTitle || hTitle.length < 6 || hTitle.length > 120 || NAV.test(hTitle))
          continue;
        if (
          /^(Onlayn kredit|Sürətli təsdiq|Kredit məbləğini|ABB mobile-a daxil|“\+|Açılan pəncərə)/i.test(
            hTitle
          )
        )
          continue;

        const paras = [];
        let n = h.nextElementSibling;
        for (let k = 0; k < 10 && n; k++) {
          if (/^H[1-4]$/.test(n.tagName)) break;
          if (n.matches("p")) {
            const t = txt(n);
            if (t.length > 40 && !BAD.test(t)) paras.push(t);
          } else {
            for (const p of n.querySelectorAll?.("p") || []) {
              const t = txt(p);
              if (t.length > 40 && !BAD.test(t)) paras.push(t);
            }
          }
          if (paras.length >= 2) break;
          n = n.nextElementSibling;
        }
        if (!paras.length) {
          const parent = h.closest("section, article, div") || h.parentElement;
          const near = [...(parent?.querySelectorAll("p") || [])]
            .map(txt)
            .filter((t) => t.length > 50 && !BAD.test(t));
          if (near[0]) paras.push(near[0]);
        }
        const desc = paras.join("\n").slice(0, 900);
        if (desc.length > 50 && !contentSections.some((s) => s.title === hTitle)) {
          contentSections.push({ title: hTitle, desc });
        }
      }

      // Card-like blocks: find containers with an image + short title + desc
      const cards = [];
      const candidates = [
        ...main.querySelectorAll("article, [class*='card'], section > div > div"),
      ];
      for (const el of candidates) {
        const h = el.querySelector("h2, h3, h4, p strong, strong");
        const ps = [...el.querySelectorAll("p")].map(txt);
        const t = txt(h);
        const desc = ps.find((p) => p !== t && p.length > 40 && p.length < 400);
        if (
          t &&
          t.length >= 4 &&
          t.length <= 80 &&
          desc &&
          !NAV.test(t) &&
          !BAD.test(desc) &&
          !cards.some((c) => c.title === t)
        ) {
          cards.push({ title: t, desc: desc.slice(0, 320) });
        }
        if (cards.length >= 8) break;
      }

      // Fallback cards from title+next paragraph pattern in body text chunks
      if (cards.length < 2) {
        const shortTitles = [...main.querySelectorAll("h3, h4, p")]
          .map(txt)
          .filter((t) => t.length >= 4 && t.length <= 55 && !/\?$/.test(t) && !NAV.test(t));
        for (const st of shortTitles.slice(0, 40)) {
          const idx = allPs.findIndex(
            (p) => p.startsWith(st) === false && allPs.some(() => true)
          );
          // find paragraph that appears after this title in DOM
          const el = [...main.querySelectorAll("h3, h4, p")].find(
            (e) => txt(e) === st
          );
          if (!el) continue;
          let n = el.nextElementSibling;
          for (let k = 0; k < 4 && n; k++) {
            const t = txt(n);
            if (t.length > 45 && t.length < 400 && !BAD.test(t) && t !== st) {
              if (!cards.some((c) => c.title === st)) {
                cards.push({ title: st, desc: t.slice(0, 320) });
              }
              break;
            }
            n = n.nextElementSibling;
          }
          if (cards.length >= 6) break;
        }
      }

      // Steps: h3 titles that look like steps + following p
      const stepPairs = [];
      for (const h of main.querySelectorAll("h3")) {
        const hTitle = txt(h);
        if (!hTitle || hTitle.length < 8 || hTitle.length > 100) continue;
        if (
          !/daxil olun|klik|seçin|toxun|sifariş|təsdiq|alın|açın|başla|əlavə|yüklə/i.test(
            hTitle
          )
        )
          continue;
        let n = h.nextElementSibling;
        let desc = "";
        for (let k = 0; k < 4 && n; k++) {
          const t = txt(n);
          if (n.matches("p") && t.length > 20 && t.length < 280) {
            desc = t;
            break;
          }
          n = n.nextElementSibling;
        }
        if (!stepPairs.some((s) => s.title === hTitle)) {
          stepPairs.push({ title: hTitle, desc: desc.slice(0, 220) });
        }
        if (stepPairs.length >= 6) break;
      }

      // FAQ — click every button that looks like a question
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
        await new Promise((r) => setTimeout(r, 160));
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
        // cut if another question starts
        const cut = a.search(/\s[A-ZƏÖÜĞIŞÇa-zəöüğışç][^?]{10,90}\?\s/);
        if (cut > 40) a = a.slice(0, cut).trim();
        if (a.length > 30 && !faqs.some((f) => f.q === q)) {
          faqs.push({ q, a: a.slice(0, 700) });
        }
      }

      // If still no contentSections, build from unique long paragraphs
      if (contentSections.length === 0) {
        const uniq = [];
        for (const p of allPs) {
          if (p.length < 80) continue;
          if (uniq.some((u) => u.slice(0, 60) === p.slice(0, 60))) continue;
          uniq.push(p);
          if (uniq.length >= 5) break;
        }
        uniq.forEach((p, i) => {
          contentSections.push({
            title: i === 0 ? title || "Ətraflı məlumat" : `Əlavə məlumat ${i + 1}`,
            desc: p.slice(0, 800),
          });
        });
      }

      return {
        title,
        description,
        contentSections: contentSections.slice(0, 8),
        cards: cards.slice(0, 8),
        stepPairs: stepPairs.slice(0, 6),
        faqs: faqs.slice(0, 20),
        paragraphs: allPs.slice(0, 12),
      };
    });

    const prev = existing[route] || { route, ok: true };

    // Merge cards: keep images, update desc from scrape
    let cards = (prev.cards || []).map((c) => {
      const hit = texts.cards.find(
        (t) =>
          t.title === c.title ||
          t.title.includes(c.title) ||
          c.title.includes(t.title)
      );
      return hit ? { ...c, desc: hit.desc } : c;
    });
    if (cards.filter((c) => (c.desc || "").length > 30).length < 2 && texts.cards.length) {
      const gal = prev.gallery || [];
      cards = texts.cards.map((t, idx) => ({
        title: t.title,
        desc: t.desc,
        image:
          prev.cards?.[idx]?.image || gal[idx] || prev.heroImage || "",
      }));
    }

    const contentSections =
      texts.contentSections.length > 0
        ? texts.contentSections
        : prev.contentSections || [];

    // Prefer scraped FAQ with answers
    const faqs =
      texts.faqs.length > 0
        ? texts.faqs
        : (prev.faqs || []).map((f) =>
            typeof f === "string" ? { q: f, a: "" } : f
          );

    const stepDetails =
      texts.stepPairs.length > 0
        ? texts.stepPairs
        : prev.stepDetails || [];

    existing[route] = {
      ...prev,
      title: texts.title || prev.title,
      description: texts.description || prev.description,
      cards,
      contentSections,
      faqs,
      stepDetails,
      steps:
        stepDetails.length > 0
          ? stepDetails.map((s) => s.title)
          : prev.steps || [],
      blocks: contentSections.slice(0, 6).map((s, idx) => ({
        title: s.title,
        desc: s.desc,
        image:
          prev.blocks?.[idx]?.image ||
          prev.gallery?.[idx] ||
          prev.heroImage ||
          "",
      })),
      sections: [
        ...new Set([
          ...contentSections.map((s) => s.title),
          ...(prev.sections || []),
        ]),
      ].slice(0, 12),
    };

    console.log(
      `OK | secs=${contentSections.length} cards=${cards.length} faqs=${faqs.length} steps=${stepDetails.length}`
    );
  } catch (e) {
    console.log("ERR", e.message);
  }
}

// Keep gold overrides
existing["/ferdi/kreditler/nagd-kredit"] = {
  ...existing["/ferdi/kreditler/nagd-kredit"],
  title: "Güzəştli Şərtlərlə Tam Onlayn Nağd Kredit",
  description:
    "70 000 AZN-dək nağd krediti filiala gəlmədən, elə olduğunuz yerdən əldə edin! Üstəlik, müraciət üçün rəsmi gəlir tələbi yoxdur.",
  contentSections: [
    {
      title: "Nağd krediti nədir və kimlər üçün uyğundur?",
      desc: "Nağd kredit şəxsi maliyyə ehtiyaclarını qarşılamaq üçün bank tərəfindən təqdim olunan kredit növüdür. Bu kredit bir çox hallarda səyahət xərcləri, təhsil ödənişləri, avtomobil təmiri və ya gündəlik ehtiyacların qarşılanması üçün seçilir. Nağd kredit xidmətinin üstünlüklərindən biri müraciətin onlayn şəkildə həyata keçirilə bilməsidir. Beləliklə, banka getmədən kredit sifarişi verərək vəsaiti qısa müddətdə əldə etmək mümkündür. Rahat ödəniş qrafiki və müxtəlif müddət seçimləri də istifadəçilərə büdcələrini daha rahat planlaşdırmağa kömək edir.",
    },
    {
      title: "Nağd pul kredit götürmək üçün hansı şərtlər tələb olunur?",
      desc: "Nağd pul kredit əldə etmək üçün müraciət edən şəxsin müəyyən bank tələblərinə uyğun olması lazımdır. Adətən kredit üçün müraciət edən şəxsin rəsmi gəliri, yaş tələbi və kredit tarixçəsi nəzərə alınır. Nağd pul krediti üçün müraciət prosesi sadədir və kredit zaminsiz təqdim olunur. Müştərilər kredit məbləğini və müddətini seçərək müraciət edə və təsdiq olunduqdan sonra vəsaiti kart hesablarına köçürə bilərlər.",
    },
    {
      title: "Onlayn nağd pul kreditinə müraciət qaydaları",
      desc: "Onlayn nağd pul krediti almaq üçün bankın mobil tətbiqi və ya rəsmi internet səhifəsi vasitəsilə müraciət etmək mümkündür. İstifadəçi əlaqə nömrəsi və şəxsiyyət vəsiqəsinin FİN kodunu daxil edərək ilkin müraciət formasını doldurur, məlumatlar sistem tərəfindən qiymətləndirilir. Müraciət təsdiqləndikdən sonra kredit vəsaiti qısa müddətdə müştərinin hesabına köçürülə bilər. Onlayn nağd pul krediti xidməti banka getmədən maliyyə ehtiyaclarını qarşılamağa imkan verir.",
    },
  ],
};

existing["/ferdi/emanetler/digideposit"] = {
  ...existing["/ferdi/emanetler/digideposit"],
  title: "DigiDeposit - Tamamilə rəqəmsal",
  description:
    "Pulunuzun dəyərini etibarlı və rahat şəkildə artırın. DigiDeposit ilə qazanmağa başlayın.",
  cards: [
    {
      title: "Tamamilə onlayn",
      desc: "ABB mobile vasitəsilə istənilən vaxt, istənilən yerdə 30-a qədər depozit yaradın. Rəsmiləşmə zamanı müqavilənin avtomatik uzanması seçimi mümkündür.",
      image:
        existing["/ferdi/emanetler/digideposit"]?.cards?.[0]?.image ||
        "https://cdn.abb-bank.az/large_Digi_Deposit_step1_2_e311ac4618.png",
    },
    {
      title: "Yüksək gəlir",
      desc: "18 ayadək depozit müddəti ilə illik 10%-dək qazanın. Üstəlik, müqavilənin bitmə tarixinə 90 gün qalanadək depozitinizi artırın.",
      image:
        existing["/ferdi/emanetler/digideposit"]?.cards?.[1]?.image ||
        "https://cdn.abb-bank.az/large_Digi_Deposit_step1_6_8f18c28f1e.png",
    },
    {
      title: "Sərbəst çıxarış",
      desc: "Vəsaiti vaxtından əvvəl onlayn şəkildə cəriməsiz çıxarın, maliyyə çevikliyindən yararlanın.",
      image:
        existing["/ferdi/emanetler/digideposit"]?.cards?.[2]?.image ||
        "https://cdn.abb-bank.az/large_Digi_Deposit_step1_6_2c6ab534a9.png",
    },
  ],
  stepDetails: [
    {
      title: "ABB mobile-a daxil olun",
      desc: "Tətbiqə daxil olun və DigiDeposit bölməsinə keçin.",
    },
    {
      title: "“+” ikonuna toxunub “DigiDeposit”i seçin",
      desc: "Yeni depozit yaratmaq üçün müvafiq seçimi edin.",
    },
    {
      title: "Açılan pəncərədə “İndi başla”ya klikləyin",
      desc: "Məlumatları doldurun və depoziti rəsmiləşdirin.",
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
  JSON.stringify(existing, null, 2),
  "utf8"
);
console.log("DONE weak text scrape", ROUTES.length);
await browser.close();
