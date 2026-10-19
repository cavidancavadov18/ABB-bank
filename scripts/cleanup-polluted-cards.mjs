import fs from "fs";

const pages = JSON.parse(
  fs.readFileSync("src/lib/data/sectionPages.json", "utf8")
);

const POLLUTED_CARD =
  /^(Tariflər|Siyasətlərimiz|Hesabatlar|Satınalmalar|Araşdırma|Brend|Hüquqi|Təklif|Korporativ təqdimat|İdarəetmə və Komitələr|Fərdi|Biznes|Haqqımızda|İnvestorlarla əlaqə|Xəbərlər|Bütün kreditlər|Kartlar|Əmanətlər|Keşbek|Kampaniyalar)(,.*)?$/i;

const LOAN_STAT_ROUTE =
  /kredit|ipoteka|emanet|hesab|kesbek|kart|avans|digi|sigorta|invest/i;

let cleanedCards = 0;
let cleanedStats = 0;
let cleanedDescs = 0;

for (const [route, page] of Object.entries(pages)) {
  if (!page || typeof page !== "object") continue;

  if (Array.isArray(page.cards)) {
    const before = page.cards.length;
    page.cards = page.cards.filter((c) => {
      if (!c?.title) return false;
      if (POLLUTED_CARD.test(c.title.trim())) return false;
      if (c.desc === "Sənədə baxın" && POLLUTED_CARD.test(c.title)) return false;
      // footer mega leftovers
      if (
        /Sənədə baxın/.test(c.desc || "") &&
        /siyasət|hesabat|tarif|sənəd/i.test(c.title)
      )
        return false;
      return true;
    });
    cleanedCards += before - page.cards.length;
  }

  // Wrong loan stats on non-product pages
  if (
    Array.isArray(page.stats) &&
    page.stats.length &&
    !LOAN_STAT_ROUTE.test(route)
  ) {
    const bad = page.stats.filter((s) =>
      /AZN-dək|%-dən|ayadək|Zaminsiz/i.test(s.value || "")
    );
    if (bad.length) {
      page.stats = page.stats.filter(
        (s) => !/AZN-dək|%-dən|ayadək|Zaminsiz/i.test(s.value || "")
      );
      cleanedStats += bad.length;
    }
  }

  // Also strip loan-like stats from service pages explicitly
  if (
    /randevu|melumat-merkezi|arayis|pin-kod|iane|faydali-link|rekvizit|senedler|hesabatlar|siyaset|arasdirma|satinalma|teklif|huquqi|korporativ-teqdimat|idareetme|standart-sertler/i.test(
      route
    )
  ) {
    if (page.stats?.length) {
      cleanedStats += page.stats.length;
      page.stats = [];
    }
  }

  // Fix wrong research description on rekvizitler
  if (
    route === "/haqqimizda/rekvizitler" &&
    /Trendləri araşdırmaq|tədqiqatımız/i.test(page.description || "")
  ) {
    page.description =
      "ABB-nin bank rekvizitləri: VÖEN, SWIFT, müxbir hesablar və digər rəsmi məlumatlar.";
    cleanedDescs++;
  }
}

fs.writeFileSync(
  "src/lib/data/sectionPages.json",
  JSON.stringify(pages, null, 2),
  "utf8"
);
console.log({ cleanedCards, cleanedStats, cleanedDescs });
