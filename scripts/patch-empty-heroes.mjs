import fs from "fs";

const pages = JSON.parse(fs.readFileSync("src/lib/data/sectionPages.json", "utf8"));
const imgs = JSON.parse(fs.readFileSync("src/lib/data/sectionImages.json", "utf8"));

const FORCE = {
  "/abb-mobile": {
    heroImage: "https://cdn.abb-bank.az/Banner_ABB_Mobile_AZ_f87088c4b1.png",
    title: "ABB mobile – Təhlükəsiz, sadə, sürətli",
  },
  "/ferdi/xidmet-sebekesi": {
    title: "Xidmət şəbəkəsi",
    description: "ABB filial və ATM şəbəkəsi — sizə ən yaxın xidmət nöqtəsini tapın.",
    heroImage: "https://cdn.abb-bank.az/63_1_a8fb2ffbb8.png",
    cta: "Xəritədə bax",
    breadcrumbs: ["Fərdi", "Xidmət şəbəkəsi"],
    ok: true,
  },
  "/ferdi/randevu": {
    heroImage: "https://cdn.abb-bank.az/service_658cbbc816.png",
  },
  "/ferdi/melumat-merkezi": {
    heroImage: "https://cdn.abb-bank.az/service_f4855cf540_2_fd8767cbde.png",
  },
  "/ferdi/arayis-sifarisi": {
    heroImage: "https://cdn.abb-bank.az/image_506_edd0057a05.png",
  },
  "/ferdi/kredit-odenisi": {
    heroImage: "https://cdn.abb-bank.az/sayt_183b93695e.png",
  },
  "/ferdi/karta-medaxil": {
    heroImage: "https://cdn.abb-bank.az/komissiyasiz_m_daxil_f69d5973e9.png",
  },
  "/ferdi/iane-et": {
    heroImage: "https://cdn.abb-bank.az/image_506_edd0057a05.png",
  },
  "/ferdi/pin-kod-deyisimi": {
    heroImage: "https://cdn.abb-bank.az/ABB_mobile0000_1_2_b8cca87be8.png",
  },
};

let n = 0;
for (const [route, p] of Object.entries(pages)) {
  const m = imgs[route];
  if (FORCE[route]) Object.assign(p, FORCE[route], { ok: true });
  if ((!p.heroImage || p.heroImage === "") && m?.image) {
    p.heroImage = m.image;
    n++;
  }
  if ((!p.gallery || p.gallery.length === 0) && m?.gallery?.length) {
    p.gallery = m.gallery.filter((u) => u !== p.heroImage);
    n++;
  }
  if ((!p.cards || p.cards.length === 0) && (p.gallery || []).length) {
    p.cards = p.gallery.slice(0, 4).map((image, i) => ({
      title: p.features?.[i] || p.sections?.[i] || p.title,
      desc: (p.description || "").slice(0, 180),
      image,
    }));
    n++;
  }
}

const kk = pages["/ferdi/kartlar/kredit-kartlari"];
if (kk) {
  kk.cards = [
    {
      title: "TamKart",
      desc: kk.description || "",
      image: kk.heroImage,
    },
    ...(kk.gallery || []).slice(0, 3).map((image, i) => ({
      title: `Kart ${i + 1}`,
      desc: "",
      image,
    })),
  ].filter((c) => c.image);
}

const dk = pages["/ferdi/kartlar/debet-kartlari"];
if (dk) {
  dk.cards = [
    { title: "Debet kartları", desc: dk.description || "", image: dk.heroImage },
    ...(dk.gallery || []).slice(0, 3).map((image) => ({
      title: "Kart vizualı",
      desc: "",
      image,
    })),
  ].filter((c) => c.image);
}

fs.writeFileSync("src/lib/data/sectionPages.json", JSON.stringify(pages, null, 2));
console.log("patched", n);
console.log("nagd", pages["/ferdi/kreditler/nagd-kredit"].heroImage.split("/").pop());
console.log("mobile", pages["/abb-mobile"].heroImage.split("/").pop());
