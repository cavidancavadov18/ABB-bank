export type NewsItem = {
  id: string;
  date: string;
  title: { az: string; en: string };
  excerpt?: { az: string; en: string };
  image: string;
  href: string;
  badge?: string | null;
};

export const newsItems: NewsItem[] = [
  {
    id: "abb-den-usaq-yigim-emaneti",
    date: "19.10.2026",
    title: {
      az: 'ABB-dən "Uşaq yığım" əmanəti',
      en: 'ABB launches "Child savings" deposit',
    },
    excerpt: {
      az: "Övladınızın gələcəyi üçün illik 8.5%-dək gəlirli əmanət.",
      en: "A deposit with up to 8.5% annual return for your child's future.",
    },
    image: "https://cdn.abb-bank.az/usaqyigium1_38169c9ca3.png",
    href: "/xeberler/abb-den-usaq-yigim-emaneti",
    badge: "8.5%",
  },
  {
    id: "abb-beynelxalq-risk-forumu-kecirdi",
    date: "19.10.2026",
    title: {
      az: "ABB Beynəlxalq Risk Forumu keçirdi",
      en: "ABB held the International Risk Forum",
    },
    excerpt: {
      az: "Risk idarəetməsi üzrə beynəlxalq ekspertlər Bakıda bir araya gəldi.",
      en: "International risk management experts gathered in Baku.",
    },
    image: "https://cdn.abb-bank.az/S_kil6_ad59b19019.png",
    href: "/xeberler/abb-beynelxalq-risk-forumu-kecirdi",
  },
  {
    id: "digitravel-ile-aviabiletleri",
    date: "14.10.2026",
    title: {
      az: "DigiTravel ilə aviabiletləri də indi alıb, sonra ödəyin!",
      en: "Buy flights now, pay later with DigiTravel!",
    },
    excerpt: {
      az: "Səyahət biletlərini ABB mobile-da 0% faizlə alın.",
      en: "Buy travel tickets in ABB mobile at 0% interest.",
    },
    image: "https://cdn.abb-bank.az/Vizual1_digi_c20e9959ba.png",
    href: "/xeberler/digitravel-ile-aviabiletleri-de-indi-alib-sonra-odeyin",
    badge: "0%",
  },
  {
    id: "beynelxalq-risk-forumu-kecirilecek",
    date: "13.10.2026",
    title: {
      az: "ABB-nin təşkilatçılığı ilə Beynəlxalq Risk Forumu keçiriləcək",
      en: "International Risk Forum to be held by ABB",
    },
    excerpt: {
      az: "Risk idarəetməsi üzrə beynəlxalq ekspertlər Bakıda bir araya gəlir.",
      en: "International risk management experts gather in Baku.",
    },
    image: "https://cdn.abb-bank.az/thinkk_0331e2e1ef.png",
    href: "/xeberler/abb-nin-teskilatciligi-ile-beynelxalq-risk-forumu-kecirilecek",
  },
  {
    id: "iticket-artiq-abb-mobile-da",
    date: "13.10.2026",
    title: {
      az: "iTicket artıq ABB mobile-da!",
      en: "iTicket is now in ABB mobile!",
    },
    excerpt: {
      az: "Tətbiqi yeniləyin və ilk biletinizi indi seçin.",
      en: "Update the app and choose your first ticket now.",
    },
    image: "https://cdn.abb-bank.az/itickettt_ba380574eb.jpeg",
    href: "/xeberler/iticket-artiq-abb-mobile-da",
    badge: "Yeni",
  },
  {
    id: "tamkart-max",
    date: "08.10.2026",
    title: {
      az: "ABB 12 ay faizsiz ödəniş imkanı yaradan “TamKart Max” kredit kartını təqdim etdi!",
      en: "ABB introduces TamKart Max with 12 months interest-free!",
    },
    excerpt: {
      az: "Yeni kredit kartı ilə alışlarınızı daha rahat planlaşdırın.",
      en: "Plan your purchases more comfortably with the new credit card.",
    },
    image: "https://cdn.abb-bank.az/tammaxpres_c294e8b961.jpeg",
    href: "/xeberler/abb-12-ay-faizsiz-odenis-imkani-yaradan-tamkart-max-kredit-kartini-teqdim-etdi",
    badge: "12 ay",
  },
  {
    id: "money2020-final",
    date: "07.10.2026",
    title: {
      az: "ABB-nin süni intellekt həlli Las Veqas-da keçiriləcək “Money20/20”-də finalçı kimi yarışacaq",
      en: "ABB's AI solution to compete as a finalist at Money20/20 in Las Vegas",
    },
    image: "https://cdn.abb-bank.az/avard12_e56cdf8e91.jpeg",
    href: "/xeberler/abb-nin-suni-intellekt-helli-las-veqas-da-kecirilecek-money2020-de-finalci-kimi-yarisacaq",
  },
  {
    id: "ie-biznes-mektebi",
    date: "05.10.2026",
    title: {
      az: "Qlobal IE Biznes Məktəbi ABB-nin transformasiya təcrübəsini tədris nümunəsinə çevirdi",
      en: "IE Business School turned ABB's transformation into a teaching case",
    },
    image: "https://cdn.abb-bank.az/Vizual111111_c6d70e41c0.png",
    href: "/xeberler/qlobal-ie-biznes-mektebi-abb-nin-transformasiya-tecrubesini-tedris-numunesine-cevirdi",
  },
  {
    id: "sehmdarlar-yigincagi",
    date: "02.10.2026",
    title: {
      az: "ABB Səhmdarlarının Ümumi Yığıncağı keçirilib",
      en: "ABB Shareholders' General Meeting held",
    },
    image: "https://cdn.abb-bank.az/suyy_186f0bb69b.png",
    href: "/xeberler/abb-sehmdarlarinin-umumi-yigincagi-kecirilib-0210",
  },
  {
    id: "innovasiya-park",
    date: "17.09.2026",
    title: {
      az: "ABB İnnovasiya Pirallahı Yüksək Texnologiyalar Parkının rezidenti statusunu əldə etdi",
      en: "ABB Innovation obtained resident status at Pirallahi High-Tech Park",
    },
    image: "https://cdn.abb-bank.az/innovasiyaaaaa_8029926be4.png",
    href: "/xeberler/abb-innovasiya-pirallahi-yuksek-texnologiyalar-parkinin-rezidenti-statusunu-elde-etdi",
  },
  {
    id: "reqemsal-bank",
    date: "17.09.2026",
    title: {
      az: "ABB ölkə üzrə ən yaxşı və innovativ rəqəmsal bank elan edildi!",
      en: "ABB named the country's best and most innovative digital bank!",
    },
    image: "https://cdn.abb-bank.az/Vizual_MUKAFAT_b9272857c0.png",
    href: "/xeberler/abb-olke-uzre-en-yaxsi-ve-innovativ-reqemsal-bank-elan-edildi",
  },
  {
    id: "partnyor-gorusu",
    date: "16.09.2026",
    title: {
      az: "ABB partnyorları ilə görüş keçirildi",
      en: "ABB held a meeting with partners",
    },
    image: "https://cdn.abb-bank.az/Reliz_1609_44d95dec5f.png",
    href: "/xeberler/abb-partnyorlari-ile-gorus-kecirildi",
  },
];

export function getNewsById(id: string): NewsItem | undefined {
  return newsItems.find((n) => n.id === id);
}

export function getNewsBySlug(slug: string): NewsItem | undefined {
  const clean = slug.replace(/^\/+/, "").replace(/^xeberler\//, "");
  return newsItems.find((n) => {
    const hrefSlug = n.href.replace(/^\/xeberler\//, "");
    return hrefSlug === clean || n.id === clean;
  });
}
