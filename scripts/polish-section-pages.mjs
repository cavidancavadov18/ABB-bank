import fs from "fs";

const pages = JSON.parse(
  fs.readFileSync("src/lib/data/sectionPages.json", "utf8")
);
let sectionImages = {};
try {
  sectionImages = JSON.parse(
    fs.readFileSync("src/lib/data/sectionImages.json", "utf8")
  );
} catch {
  /* */
}

const BAD_HERO =
  /yenilogo|logo_|favicon|Twitter_|Youtube_|Instagram_|Facebook_|Linkedin_|qr_|icon_/i;

function toLarge(url) {
  if (!url || !url.includes("cdn.abb-bank.az")) return url;
  if (/\/(large_|icon_|small_)/i.test(url) || /\.svg$/i.test(url)) return url;
  if (/\/medium_/i.test(url)) return url.replace("/medium_", "/large_");
  return url.replace("cdn.abb-bank.az/", "cdn.abb-bank.az/large_");
}

function cleanDocTitle(t) {
  return String(t || "")
    .replace(/PDF\s*[\d.,]+\s*(MB|kB|KB|GB)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

let fixedHero = 0;
let fixedTitles = 0;
let fixedDesc = 0;

for (const [route, page] of Object.entries(pages)) {
  if (!page || typeof page !== "object") continue;

  // Fix PDF titles
  if (Array.isArray(page.cards)) {
    for (const c of page.cards) {
      if (c.title && /PDF/i.test(c.title)) {
        const nt = cleanDocTitle(c.title);
        if (nt !== c.title) {
          c.title = nt;
          fixedTitles++;
        }
        if (!c.desc || /Rəsmi sənəd|Onlayn xidmətə keçid/i.test(c.desc)) {
          c.desc = "PDF sənədə baxın";
        }
      }
    }
    // Drop self-titled duplicate first card that just repeats page title with no value
    if (
      page.cards[0] &&
      page.title &&
      page.cards[0].title === page.title &&
      page.cards.length > 1
    ) {
      page.cards = page.cards.slice(1);
    }
  }

  // Fix bad heroes
  const curated = sectionImages[route]?.image;
  if (!page.heroImage || BAD_HERO.test(page.heroImage)) {
    const fromGallery = (page.gallery || []).find((u) => u && !BAD_HERO.test(u));
    const fromCard = (page.cards || []).find(
      (c) => c.image && !BAD_HERO.test(c.image)
    )?.image;
    const next = toLarge(curated || fromGallery || fromCard || page.heroImage);
    if (next && next !== page.heroImage) {
      page.heroImage = next;
      fixedHero++;
    }
  } else {
    page.heroImage = toLarge(page.heroImage);
  }

  // Clean gallery of logos
  if (Array.isArray(page.gallery)) {
    page.gallery = page.gallery
      .filter((u) => u && !BAD_HERO.test(u))
      .map(toLarge);
  }

  // Kampaniyalar wrong desc
  if (
    route === "/ferdi/kampaniyalar" &&
    /4\.9 reytinq|mobil tətbiq/i.test(page.description || "")
  ) {
    page.description =
      "ABB-nin aktual kampaniyaları: nağd kredit endirimləri, kart təklifləri və digər fürsətlər.";
    page.title = "Kampaniyalar";
    fixedDesc++;
  }

  // butun-hesablar hub title should be Hesablar not DigiHesab Max product
  if (
    route === "/ferdi/butun-hesablar" &&
    /DigiHesab Max/i.test(page.title || "")
  ) {
    page.title = "Hesablar";
    page.description =
      "DigiHesab Max, DigiHesab, cari hesab və Dama-Dama — ehtiyacınıza uyğun hesab seçin.";
    fixedDesc++;
  }

  // mikro-biznes wrong brand title
  if (
    route === "/biznes/mikro-biznes" &&
    /Müasir, Faydalı, Universal/i.test(page.title || "")
  ) {
    page.title = "Mikro fərdi sahibkar";
    fixedDesc++;
  }
}

fs.writeFileSync(
  "src/lib/data/sectionPages.json",
  JSON.stringify(pages, null, 2),
  "utf8"
);
console.log({ fixedHero, fixedTitles, fixedDesc });
