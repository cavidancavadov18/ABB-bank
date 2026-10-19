import fs from "fs";

const routes = [
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

const GENERIC = /Banner_ABB_Mobile|onelinkto|favicon|logo_|Twitter|Youtube|Instagram|Facebook|Linkedin|qr|QR|infobank|174359|logo_msp|logo_esg|service_|quick_action/i;

function clean(u) {
  return u
    .replace(/\\u002F/g, "/")
    .replace(/&amp;/g, "&")
    .replace(/\\+$/, "")
    .split("?")[0];
}

function score(u, route) {
  let s = 0;
  if (/\.png$/i.test(u) || /\.PNG$/.test(u) || /\.webp$/i.test(u) || /\.jpe?g$/i.test(u)) s += 4;
  if (/\.svg$/i.test(u)) s -= 10;
  if (GENERIC.test(u)) s -= 20;
  if (/large_/i.test(u)) s += 6;
  if (/medium_/i.test(u)) s += 3;
  if (/sldier|slider|Deposit|Digi_|kredit|Loan|kart|Kart|kids|Tam_|Visa|master|fly_|ani_kredit|Rotation|step1|Vizual|Mask_group/i.test(u))
    s += 8;
  // keyword overlap with route
  const bits = route.split("/").filter(Boolean);
  for (const b of bits) {
    if (b.length > 4 && new RegExp(b.slice(0, 6), "i").test(u)) s += 4;
  }
  return s;
}

const out = {};

for (const route of routes) {
  try {
    const res = await fetch(`https://abb-bank.az${route}`, {
      headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });
    if (!res.ok) {
      out[route] = { status: res.status, image: null, gallery: [] };
      console.log(route, res.status);
      continue;
    }
    const html = await res.text();

    const og =
      html.match(/property="og:image"\s+content="([^"]+)"/i)?.[1] ||
      html.match(/content="(https:\/\/cdn\.abb-bank\.az\/[^"]+)"\s+property="og:image"/i)?.[1];

    const urls = [...html.matchAll(/https:\/\/cdn\.abb-bank\.az\/[^"'\\\s)>]+/g)].map((m) =>
      clean(m[0])
    );
    const uniq = [...new Set(urls)].filter((u) => u.startsWith("https://cdn.abb-bank.az/"));

    const ranked = uniq
      .map((u) => ({ u, s: score(u, route) }))
      .sort((a, b) => b.s - a.s);

    let image = og && og.includes("cdn.abb-bank.az") ? clean(og) : null;
    if (!image || GENERIC.test(image)) {
      image = ranked.find((x) => x.s > 0)?.u || ranked[0]?.u || null;
    }

    const gallery = ranked
      .filter((x) => x.s >= 4)
      .slice(0, 6)
      .map((x) => x.u);

    out[route] = { status: 200, image, og: og ? clean(og) : null, gallery };
    console.log(route, "->", image?.split("/").pop() || "NONE");
  } catch (e) {
    out[route] = { status: "err", image: null, gallery: [], error: String(e) };
    console.log(route, "ERR");
  }
}

fs.writeFileSync("section-images.json", JSON.stringify(out, null, 2));
console.log("done", Object.keys(out).length);
