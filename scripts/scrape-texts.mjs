/**
 * Scrape full Azerbaijani texts (sections + FAQ answers) from every Fərdi page.
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
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  locale: "az-AZ",
});

const existing = JSON.parse(
  fs.readFileSync("src/lib/data/sectionPages.json", "utf8")
);

for (let i = 0; i < ROUTES.length; i++) {
  const route = ROUTES[i];
  process.stdout.write(`[${i + 1}/${ROUTES.length}] ${route} ... `);
  try {
    await page.goto(`https://abb-bank.az${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(1200);

    // Scroll mid-page for content
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(400);

    const texts = await page.evaluate(async () => {
      const txt = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
      const BAD =
        /Fikirlərinizi|Rəyləriniz|cookie|©|Karyera|Səhifəni dəyərləndirin|ABB mobile yükləmək|Mobil nömrə|FİN kod|Davam et|razılıq verirəm/i;
      const NAV = /^(Fərdi|Biznes|Haqqımızda)$/i;
      const main = document.querySelector("main") || document.body;

      const title = txt(main.querySelector("h1")) || "";
      const paragraphs = [...main.querySelectorAll("p")]
        .map(txt)
        .filter((t) => t.length > 40 && t.length < 500 && !BAD.test(t));
      const description =
        paragraphs.find((t) =>
          /AZN|kredit|faiz|əmanət|kart|keşbek|hesab|ipoteka|onlayn|bank|rəqəmsal|depozit|ödəniş|səyahət/i.test(
            t
          )
        ) ||
        paragraphs[0] ||
        "";

      // Content sections: h2 + following paragraph(s)
      const contentSections = [];
      for (const h of main.querySelectorAll("h2")) {
        const hTitle = txt(h);
        if (!hTitle || hTitle.length < 5 || NAV.test(hTitle)) continue;
        if (/üstünlük|planınız|hesabla|addım/i.test(hTitle) && hTitle.length < 40)
          continue;

        let desc = "";
        let n = h.nextElementSibling;
        for (let k = 0; k < 8 && n; k++) {
          if (n.matches("p")) {
            const t = txt(n);
            if (t.length > 50 && !BAD.test(t)) {
              desc = t;
              break;
            }
          }
          const p = n.querySelector?.("p");
          if (p) {
            const t = txt(p);
            if (t.length > 50 && !BAD.test(t)) {
              desc = t;
              break;
            }
          }
          // collect multiple paragraphs
          n = n.nextElementSibling;
        }
        if (!desc) {
          const parent = h.closest("section, article, div") || h.parentElement;
          const ps = [...(parent?.querySelectorAll("p") || [])]
            .map(txt)
            .filter((t) => t.length > 60 && !BAD.test(t));
          desc = ps[0] || "";
        }
        if (desc && !contentSections.some((s) => s.title === hTitle)) {
          contentSections.push({ title: hTitle, desc: desc.slice(0, 700) });
        }
      }

      // Also h3 long content (e.g. faiz hesablanması)
      const subSections = [];
      for (const h of main.querySelectorAll("h3")) {
        const hTitle = txt(h);
        if (!hTitle || hTitle.length < 8 || /\?$/.test(hTitle) || NAV.test(hTitle))
          continue;
        let n = h.nextElementSibling;
        let desc = "";
        for (let k = 0; k < 5 && n; k++) {
          const t = txt(n);
          if (n.matches("p") && t.length > 50 && !BAD.test(t)) {
            desc = t;
            break;
          }
          n = n.nextElementSibling;
        }
        if (desc && !subSections.some((s) => s.title === hTitle)) {
          subSections.push({ title: hTitle, desc: desc.slice(0, 600) });
        }
      }

      // Steps with descriptions
      const stepPairs = [];
      const stepNames = [
        "Onlayn kredit sifariş edin",
        "Sürətli təsdiq",
        "Kredit məbləğini alın",
        "ABB mobile-a daxil olun",
      ];
      const body = txt(main);
      for (const name of stepNames) {
        const re = new RegExp(
          name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s+(.{15,220})"
        );
        const m = body.match(re);
        if (m && !BAD.test(m[1])) {
          stepPairs.push({ title: name, desc: m[1].slice(0, 220) });
        }
      }

      // FAQ accordion — click each item
      const items = [
        ...document.querySelectorAll(
          '[class*="border-b-border-separator"], [class*="border-b-border"]'
        ),
      ];
      const faqs = [];
      for (const item of items) {
        const btn = item.querySelector("button");
        if (!btn) continue;
        const q0 = txt(btn).replace(/\s+/g, " ").trim();
        if (!/\?/.test(q0) || q0.length < 10 || q0.length > 160) continue;
        try {
          btn.click();
        } catch {
          /* */
        }
        await new Promise((r) => setTimeout(r, 180));
        const full = txt(item);
        const q = q0.match(/^[^?]{8,140}\?/)?.[0] || q0.split("?")[0] + "?";
        let a = full.startsWith(q) ? full.slice(q.length).trim() : full.replace(q, "").trim();
        // strip other questions if leaked
        a = a.split(/\s(?=[A-ZƏÖÜĞIŞÇ][^?]{8,80}\?)/)[0] || a;
        a = a.replace(/\s+/g, " ").trim();
        if (a.length > 25 && !faqs.some((f) => f.q === q)) {
          faqs.push({ q, a: a.slice(0, 600) });
        }
      }

      // Advantage cards text
      const cards = [];
      const named = [
        ["Rahat şərtlər", /Rahat şərtlər\s+(.{30,240})/i],
        ["Sürətli rəsmiləşdirmə", /Sürətli rəsmiləşdirmə\s+(.{30,240})/i],
        [
          "Kredit ödənişi tarixinin dəyişdirilməsi imkanı",
          /Kredit ödənişi tarixinin dəyişdirilməsi imkanı\s+(.{30,240})/i,
        ],
        [
          "Könüllü kredit həyat sığortası",
          /Könüllü kredit həyat sığortası\s+(.{30,240})/i,
        ],
        ["Tamamilə onlayn", /Tamamilə onlayn\s+(.{30,240})/i],
        ["Yüksək gəlir", /Yüksək gəlir\s+(.{30,240})/i],
        ["Sərbəst çıxarış", /Sərbəst çıxarış\s+(.{30,240})/i],
      ];
      for (const [t, re] of named) {
        const m = body.match(re);
        if (m) cards.push({ title: t, desc: m[1].slice(0, 240) });
      }

      const plans = [];
      for (const name of ["Səyahət", "Təhsil", "Avtomobil", "Şəxsi ehtiyaclar"]) {
        const re = new RegExp(`${name}\\s+(.{15,140})`, "i");
        const m = body.match(re);
        if (m) plans.push({ title: name, desc: m[1].replace(/\s+/g, " ").slice(0, 140) });
      }

      return {
        title,
        description,
        contentSections,
        subSections,
        faqs,
        stepPairs,
        cardTexts: cards,
        plans,
      };
    });

    const prev = existing[route] || { route, ok: true };
    // Merge texts into existing page data (keep images)
    const cards = (prev.cards || []).map((c) => {
      const hit = texts.cardTexts.find((t) => t.title === c.title);
      return hit ? { ...c, desc: hit.desc } : c;
    });
    // If cards empty but we have cardTexts, rebuild with existing gallery images
    if (!cards.length && texts.cardTexts.length) {
      const gal = prev.gallery || [];
      texts.cardTexts.forEach((t, idx) => {
        cards.push({
          title: t.title,
          desc: t.desc,
          image: gal[idx] || prev.heroImage,
        });
      });
    }

    const steps =
      texts.stepPairs.length > 0
        ? texts.stepPairs.map((s) => s.title)
        : prev.steps || [];

    existing[route] = {
      ...prev,
      title: texts.title || prev.title,
      description: texts.description || prev.description,
      cards,
      plans: texts.plans.length ? texts.plans : prev.plans || [],
      steps,
      stepDetails: texts.stepPairs,
      contentSections: texts.contentSections,
      subSections: texts.subSections,
      faqs: texts.faqs.length
        ? texts.faqs
        : (prev.faqs || []).map((f) =>
            typeof f === "string" ? { q: f, a: "" } : f
          ),
      sections: [
        ...new Set([
          ...(texts.contentSections || []).map((s) => s.title),
          ...(prev.sections || []),
        ]),
      ].slice(0, 12),
      // blocks from content sections with images
      blocks: (texts.contentSections || []).slice(0, 6).map((s, idx) => ({
        title: s.title,
        desc: s.desc,
        image:
          prev.blocks?.[idx]?.image ||
          prev.gallery?.[idx] ||
          prev.heroImage ||
          "",
      })),
    };

    console.log(
      `OK | secs=${texts.contentSections.length} faqs=${texts.faqs.length} desc=${(texts.description || "").slice(0, 40)}`
    );
  } catch (e) {
    console.log("ERR", e.message);
  }
}

// Gold full texts for nagd-kredit (verified from live DOM)
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
  subSections: [
    {
      title: "Nağd kredit faizlərinin hesablanması",
      desc: "Nağd kredit faizləri kredit məbləği, seçilən müddət və bankın tətbiq etdiyi faiz dərəcəsinə əsasən hesablanır. Müştəri kredit üçün müraciət edərkən məbləğ və müddəti seçərək aylıq ödəniş məbləğini əvvəlcədən hesablaya bilər.",
    },
  ],
  stepDetails: [
    {
      title: "Onlayn kredit sifariş edin",
      desc: "Kredit müraciətini tez və asanlıqla onlayn tamamlamaq mümkündür.",
    },
    {
      title: "Sürətli təsdiq",
      desc: "Sizin müraciət dərhal qeydə alınır.",
    },
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
};

// Digideposit texts
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
    { title: "ABB mobile-a daxil olun", desc: "Tətbiqə daxil olun və DigiDeposit bölməsinə keçin." },
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
console.log("DONE text scrape", ROUTES.length);
await browser.close();
