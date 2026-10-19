import fs from "fs";

const path = "src/lib/data/sectionPages.json";
const p = JSON.parse(fs.readFileSync(path, "utf8"));

const DIRTY = /@type|contactPoint|schema\.org|İndi məlumat al|İndi hesabla|"@context/;

function cleanDesc(d) {
  if (!d) return "";
  let s = d.replace(/\s+/g, " ").trim();
  // cut at JSON-LD leakage
  const cut = s.search(/\{?"@type|contactPoint|İndi məlumat al|İndi hesabla/);
  if (cut > 20) s = s.slice(0, cut).trim();
  // cut if glued next card title
  s = s.replace(
    /(Sürətli rəsmiləşdirmə|Könüllü kredit|Nə planınız|Kredit ödənişi).*$/i,
    ""
  ).trim();
  return s.slice(0, 280);
}

let cleaned = 0;
for (const x of Object.values(p)) {
  if (x.cards) {
    x.cards = x.cards.map((c) => {
      if (DIRTY.test(c.desc || "") || (c.desc || "").length > 260) {
        cleaned++;
        return { ...c, desc: cleanDesc(c.desc) };
      }
      return c;
    });
  }
  if (x.plans) {
    x.plans = x.plans.map((pl) => {
      if (DIRTY.test(pl.desc || "") || (pl.desc || "").length > 140) {
        cleaned++;
        return { ...pl, desc: cleanDesc(pl.desc).slice(0, 120) };
      }
      return pl;
    });
  }
}

// Gold cards + plans for nagd-kredit
const nk = p["/ferdi/kreditler/nagd-kredit"];
if (nk) {
  const imgs = (nk.cards || []).map((c) => c.image);
  nk.cards = [
    {
      title: "Rahat şərtlər",
      desc: "10.9%-dən başlayan 70 000 AZN-dək nağd pul kreditini banka gəlmədən tam onlayn və zaminsiz əldə edin.",
      image: imgs[0] || nk.heroImage,
    },
    {
      title: "Sürətli rəsmiləşdirmə",
      desc: "Nağd pul kreditini onlayn sifariş edib sürətli rəsmiləşdirmə ilə qısa müddətdə əldə edin.",
      image: imgs[1] || nk.heroImage,
    },
    {
      title: "Kredit ödənişi tarixinin dəyişdirilməsi imkanı",
      desc: "Filiallarımızda rəsmiləşdirilən nağd kreditlər üçün kredit ödənişi tarixinin 15 günədək uzadılması imkanı mövcuddur.",
      image: imgs[2] || nk.heroImage,
    },
    {
      title: "Könüllü kredit həyat sığortası",
      desc: "Kredit həyat sığortası ilə kreditinizi sığortalayaraq illik faiz dərəcəsinə güzəşt əldə edin.",
      image: imgs[3] || nk.heroImage,
    },
  ];
  nk.plans = [
    {
      title: "Səyahət",
      desc: "Aviabilet almaq, hotel rezervasiya etmək və əvəzolunmaz təcrübələr yaşamaq",
    },
    {
      title: "Təhsil",
      desc: "Təhsil haqqını və kurs ödənişlərini qarşılamaq",
    },
    {
      title: "Avtomobil",
      desc: "Avtomobil almaq, təmir etmək və yeniləmək",
    },
    {
      title: "Şəxsi ehtiyaclar",
      desc: "Mebel və elektronika almaq, xüsusi günlər qeyd etmək",
    },
  ];
}

fs.writeFileSync(path, JSON.stringify(p, null, 2), "utf8");
console.log("cleaned entries", cleaned);
console.log(
  "nagd cards",
  p["/ferdi/kreditler/nagd-kredit"].cards.map((c) => c.desc.slice(0, 50))
);
