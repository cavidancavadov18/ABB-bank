import fs from "fs";

const CDN = "https://cdn.abb-bank.az";
const scraped = JSON.parse(fs.readFileSync("section-images.json", "utf8"));

const overrides = {
  "/ferdi": `${CDN}/large_sldier_Deposit_f526c8b406.png`,
  "/ferdi/kreditler": `${CDN}/large_kredit_Rotation0_d954fe4ee5.png`,
  "/ferdi/kreditler/nagd-kredit": `${CDN}/689316b85302e0ffde2e9d46ffb48279f7d446ca_63a07d9b03.png`,
  "/ferdi/kreditler/avans-kredit-xetti": `${CDN}/large_cashloan_3_3d1d162e1d.png`,
  "/ferdi/kreditler/indi-al-sonra-ode": `${CDN}/Vizual1_digi_c20e9959ba.png`,
  "/ferdi/kreditler/avtomobil-krediti": `${CDN}/v30000_1_88847b9b69.png`,
  "/ferdi/kreditler/emanetci-nagd-krediti": `${CDN}/komissiyasiz_m_daxil_f69d5973e9.png`,
  "/ferdi/kreditler/emanetci-kredit-limiti": `${CDN}/Loan_f_deposit_1_fa46de8ab1.png`,
  "/ferdi/kreditler/ipoteka-krediti": `${CDN}/quick_action_de1924bd9a.png`,
  "/ferdi/kartlar": `${CDN}/large_Tam_Digi_Card_1_VISA_fe324fd4bc.png`,
  "/ferdi/kartlar/kredit-kartlari": `${CDN}/large_Tam_Digi_Card_1_VISA_fe324fd4bc.png`,
  "/ferdi/kartlar/debet-kartlari": `${CDN}/large_Digitam_visa_vizual_03568ac997.png`,
  "/ferdi/emanetler": `${CDN}/large_sldier_Deposit_f526c8b406.png`,
  "/ferdi/emanetler/digideposit": `${CDN}/large_Digi_Deposit_step1_2_e311ac4618.png`,
  "/ferdi/emanetler/klassik-emaneti": `${CDN}/large_deposit_insurance_terms_2_1_36d6e52e1e.png`,
  "/ferdi/emanetler/usaq-yigim-emaneti": `${CDN}/large_kids_Deposit_ac56ec8f53.png`,
  "/ferdi/emanetler/depozit-seyfi": `${CDN}/Deposit_purple0000_2_1_a7e73c0a10_243da87f0f.png`,
  "/ferdi/emanetler/emanetli-ipoteka-krediti": `${CDN}/quick_action_de1924bd9a.png`,
  "/ferdi/butun-hesablar": `${CDN}/Deposit_purple0000_2_1_a7e73c0a10_243da87f0f.png`,
  "/ferdi/butun-hesablar/digihesab-max": `${CDN}/large_Digi_Deposit_step1_6_8f18c28f1e.png`,
  "/ferdi/butun-hesablar/digihesab": `${CDN}/large_Digi_Deposit_step1_6_2c6ab534a9.png`,
  "/ferdi/butun-hesablar/cari-hesab": `${CDN}/Deposit_purple0000_2_1_a7e73c0a10_243da87f0f.png`,
  "/ferdi/butun-hesablar/dama-dama": `${CDN}/large_Loan_f_deposit_1_fa46de8ab1.png`,
  "/ferdi/kesbek": `${CDN}/D_app_5_0eca73b01a.png`,
  "/ferdi/kesbek/faydali-kesbek": `${CDN}/D_app_5_0eca73b01a.png`,
  "/ferdi/kesbek/fayda-max": `${CDN}/master_8ec815b00f.png`,
  "/ferdi/kesbek/faydali-klub": `${CDN}/image_204956752_845ec35044.png`,
  "/ferdi/kampaniyalar": `${CDN}/masterliqa_sayt_c53782fec8.png`,
  "/ferdi/butun-emeliyyatlar": `${CDN}/service_82020ab072.png`,
  "/ferdi/butun-emeliyyatlar/olkedaxili-ve-olkexarici-kocurmeler": `${CDN}/service_658cbbc816.png`,
  "/ferdi/butun-emeliyyatlar/bank-kocurmeleri": `${CDN}/service_f4855cf540_2_fd8767cbde.png`,
  "/ferdi/randevu": `${CDN}/service_658cbbc816.png`,
  "/ferdi/digitravel": `${CDN}/large_Mask_group_90c1fb8f04.png`,
  "/ferdi/melumat-merkezi": `${CDN}/service_f4855cf540_2_fd8767cbde.png`,
  "/ferdi/arayis-sifarisi": `${CDN}/image_506_edd0057a05.png`,
  "/ferdi/kredit-odenisi": `${CDN}/sayt_183b93695e.png`,
  "/ferdi/karta-medaxil": `${CDN}/komissiyasiz_m_daxil_f69d5973e9.png`,
  "/ferdi/pul-kocurmesi": `${CDN}/service_82020ab072.png`,
  "/ferdi/cash-by-code": `${CDN}/infobank_1_88c9dffdcd.png`,
  "/ferdi/iane-et": `${CDN}/image_506_edd0057a05.png`,
  "/ferdi/pin-kod-deyisimi": `${CDN}/ABB_mobile0000_1_2_b8cca87be8.png`,
  "/ferdi/sigorta": `${CDN}/deposit_insurance_terms_2_1_36d6e52e1e.png`,
  "/ferdi/investisiya": `${CDN}/quick_action_f917461d10.png`,
  "/ferdi/abb-mobile-odenisler": `${CDN}/Banner_AZ_2_d9c919d797.png`,
  "/ferdi/xidmet-sebekesi": `${CDN}/63_1_a8fb2ffbb8.png`,
  "/abb-mobile": `${CDN}/Banner_ABB_Mobile_AZ_f87088c4b1.png`,
  "/abb-esim": `${CDN}/large_header_mockup_az_e6e36f288d.png`,
  "/faydali-linkler": `${CDN}/large_image_cd12ec623d.png`,
  "/biznes": `${CDN}/large_fly_Desk_slider_dd442dbcc5.png`,
  "/biznes/korporativ": `${CDN}/large_fly_Desk_slider_dd442dbcc5.png`,
  "/biznes/korporativ/korporativ-kreditler": `${CDN}/large_fly_Desk_slider_dd442dbcc5.png`,
  "/biznes/korporativ/odenis-kartlari-1": `${CDN}/large_Digitam_visa_vizual_03568ac997.png`,
  "/biznes/korporativ/hesablar-1": `${CDN}/ABB_mobile0000_1_35e5063f51.png`,
  "/biznes/korporativ/kocurmeler-1": `${CDN}/service_82020ab072.png`,
  "/biznes/korporativ/senedli-emeliyyatlar-1": `${CDN}/large_Documents_and_Resources_b54f4a575b.png`,
  "/biznes/kicik-ve-orta-biznes": `${CDN}/large_ani_kredit_slider_cbe07fbc00.png`,
  "/biznes/kicik-ve-orta-biznes/islam-bankcilig": `${CDN}/large_ani_kredit_slider_cbe07fbc00.png`,
  "/biznes/mikro-biznes": `${CDN}/large_Mask_group_b1251b2121.png`,
  "/haqqimizda": `${CDN}/large_Vizual1_digi_c20e9959ba.png`,
  "/haqqimizda/siyasetlerimiz": `${CDN}/large_Documents_and_Resources_b54f4a575b.png`,
  "/haqqimizda/satinalmalar/musabiqelerin-elani": `${CDN}/large_Documents_and_Resources_b54f4a575b.png`,
  "/korporativ-teqdimat": `${CDN}/large_Meet_the_Brandbook_665e61a7eb.png`,
};

/** Homepage chrome that leaks into every scrape */
const CHROME = new Set([
  `${CDN}/large_sldier_Deposit_f526c8b406.png`,
  `${CDN}/large_ABB_slider_iticket_97c9602843.png`,
  `${CDN}/large_sldier_kids_App_1_30789c3ee3.png`,
  `${CDN}/large_Mask_group_90c1fb8f04.png`,
  `${CDN}/large_sldier_1_2tam_visa_6fe89cc41c.png`,
  `${CDN}/Banner_ABB_Mobile_AZ_1d0d27e342.png`,
]);

const BAD = /\.pdf($|\?)/i;

function cleanGallery(hero, list) {
  const out = [hero];
  for (const u of list || []) {
    if (!u || BAD.test(u)) continue;
    if (u === hero) continue;
    if (CHROME.has(u) && u !== hero) continue;
    if (/medium_/i.test(u) && list.some((x) => x && x.includes(u.replace("medium_", "large_"))))
      continue;
    out.push(u);
    if (out.length >= 5) break;
  }
  return out;
}

const map = {};

for (const [route, data] of Object.entries(scraped)) {
  let image = overrides[route] || data.image;
  if (!image || BAD.test(image) || String(image).endsWith(".pdf")) {
    image = overrides[route] || `${CDN}/v30000_1_88847b9b69.png`;
  }
  // Prefer large_ sibling when scraped picked medium_
  if (/\/medium_/i.test(image)) {
    const large = image.replace("/medium_", "/large_");
    image = large;
  }
  map[route] = {
    image,
    gallery: cleanGallery(image, data.gallery || []),
  };
}

for (const [route, image] of Object.entries(overrides)) {
  if (!map[route]) map[route] = { image, gallery: [image] };
  else {
    map[route].image = image;
    map[route].gallery = cleanGallery(image, map[route].gallery);
  }
}

fs.mkdirSync("src/lib/data", { recursive: true });
fs.writeFileSync("src/lib/data/sectionImages.json", JSON.stringify(map, null, 2));
console.log("wrote sectionImages.json", Object.keys(map).length);
