/**
 * For thin online-service pages (real site is also mostly hero+CTA),
 * add sibling service cards with each page's own hero image — mirrors
 * the real left-rail “Onlayn xidmətlər” list.
 */
import fs from "fs";

const pages = JSON.parse(
  fs.readFileSync("src/lib/data/sectionPages.json", "utf8")
);

const SERVICES = [
  {
    route: "/ferdi/randevu",
    title: "E-Randevu",
    desc: "Filial və şöbələrdə görüşə əvvəlcədən yazılın, növbəsiz xidmət alın.",
  },
  {
    route: "/abb-mobile",
    title: "ABB mobile",
    desc: "Bank əməliyyatlarını mobil tətbiqdə sadə və sürətli tamamlayın.",
  },
  {
    route: "/ferdi/melumat-merkezi",
    title: "24/7 Məlumat mərkəzi",
    desc: "Günün istənilən vaxtı məlumat və dəstək üçün müraciət edin.",
  },
  {
    route: "/ferdi/arayis-sifarisi",
    title: "Arayış sifarişi",
    desc: "Hesabdan çıxarış və digər arayışları onlayn sifariş edin.",
  },
  {
    route: "/ferdi/kredit-odenisi",
    title: "Kredit ödənişi",
    desc: "Kredit ödənişinizi onlayn həyata keçirin.",
  },
  {
    route: "/ferdi/karta-medaxil",
    title: "Karta mədaxil",
    desc: "Kartınıza vəsait mədaxil edin.",
  },
  {
    route: "/ferdi/pul-kocurmesi",
    title: "Pul köçürməsi",
    desc: "Ölkədaxili və ölkəxarici köçürmələri rahat şəkildə edin.",
  },
  {
    route: "/ferdi/cash-by-code",
    title: "Cash by Code",
    desc: "Kart olmadan kodla nağd çıxarış edin.",
  },
  {
    route: "/ferdi/iane-et",
    title: "İanə edin",
    desc: "Fondlara onlayn ianə edin.",
  },
  {
    route: "/ferdi/pin-kod-deyisimi",
    title: "PIN-kod dəyişimi",
    desc: "Kartınızın PIN kodunu təhlükəsiz şəkildə dəyişin.",
  },
  {
    route: "/ferdi/sigorta",
    title: "Sığorta",
    desc: "Sığorta məhsulları ilə maliyyə təhlükəsizliyinizi gücləndirin.",
  },
  {
    route: "/ferdi/investisiya",
    title: "İnvestisiya",
    desc: "İnvestisiya imkanlarını araşdırın.",
  },
];

const FALLBACK_IMG =
  "https://cdn.abb-bank.az/large_service_658cbbc816.png";

function imgFor(route) {
  const p = pages[route];
  return p?.heroImage || p?.gallery?.[0] || FALLBACK_IMG;
}

const serviceRoutes = new Set(SERVICES.map((s) => s.route));
let patched = 0;

for (const svc of SERVICES) {
  const page = pages[svc.route];
  if (!page) continue;

  // Ensure title/desc quality
  if (!page.title || page.title.length < 3) page.title = svc.title;
  if (!page.description || page.description.length < 40) {
    page.description = svc.desc;
  }
  if (!page.heroImage) page.heroImage = imgFor(svc.route);
  page.cta = page.cta || "Ətraflı";

  const goodCards = (page.cards || []).filter(
    (c) =>
      c.image &&
      (c.desc || "").length > 20 &&
      !/Onlayn xidmətə keçid|Sənədə baxın|Rəsmi sənəd/i.test(c.desc || "")
  );

  if (goodCards.length >= 3) continue;

  // Sibling cards (exclude self)
  page.cards = SERVICES.filter((s) => s.route !== svc.route)
    .slice(0, 6)
    .map((s) => ({
      title: s.title,
      desc: s.desc,
      image: imgFor(s.route),
      href: s.route,
    }));

  page.sections = [
    ...(page.sections || []),
    "Digər onlayn xidmətlər",
  ].filter((t, i, a) => a.indexOf(t) === i);

  patched++;
}

// Korporativ təqdimat — brandbook page
if (pages["/korporativ-teqdimat"]) {
  const p = pages["/korporativ-teqdimat"];
  p.title = p.title || "Korporativ təqdimat";
  if (!p.description || p.description.length < 40) {
    p.description =
      "ABB brend kitabçası və korporativ təqdimat materialları ilə tanış olun. Vizual identifikasiya, loqo və kommunikasiya standartları.";
  }
  if (!p.cards?.length) {
    p.cards = [
      {
        title: "Brend kitabçası",
        desc: "ABB-nin vizual identifikasiya və brend standartları.",
        image:
          p.heroImage ||
          "https://cdn.abb-bank.az/large_Meet_the_Brandbook_665e61a7eb.png",
        href: "/haqqimizda/brend-merkezi",
      },
      {
        title: "Brend Mərkəzi",
        desc: "Loqo, rənglər və kommunikasiya materialları.",
        image: imgFor("/haqqimizda/brend-merkezi"),
        href: "/haqqimizda/brend-merkezi",
      },
      {
        title: "Haqqımızda",
        desc: "Bank haqqında ətraflı məlumat.",
        image: imgFor("/haqqimizda"),
        href: "/haqqimizda",
      },
    ];
  }
  patched++;
}

// Huquqi icmal
if (pages["/haqqimizda/huquqi-icmal"]) {
  const p = pages["/haqqimizda/huquqi-icmal"];
  if (!p.cards?.length) {
    p.cards = [
      {
        title: "Sənədlər və resurslar",
        desc: "Tariflər, şərtlər və digər rəsmi sənədlər.",
        image: imgFor("/haqqimizda/senedler"),
        href: "/haqqimizda/senedler",
      },
      {
        title: "Siyasətlərimiz",
        desc: "Korporativ siyasət və qaydalar.",
        image: imgFor("/haqqimizda/siyasetlerimiz"),
        href: "/haqqimizda/siyasetlerimiz",
      },
      {
        title: "Təklif və iradlar",
        desc: "Təklif və iradlarınızı bizə göndərin.",
        image: imgFor("/haqqimizda/teklif-ve-iradlar"),
        href: "/haqqimizda/teklif-ve-iradlar",
      },
    ];
    if (!p.description || p.description.length < 40) {
      p.description =
        "Hüquqi icmal və tənzimləyici məlumatlar. Bankın hüquqi sənədləri və açıqlamaları ilə tanış olun.";
    }
    patched++;
  }
}

fs.writeFileSync(
  "src/lib/data/sectionPages.json",
  JSON.stringify(pages, null, 2),
  "utf8"
);
console.log("patched service/docs pages:", patched);
console.log(
  "service routes touched:",
  [...serviceRoutes].filter((r) => (pages[r]?.cards || []).length >= 3).length
);
