import fs from "fs";

const path = "src/lib/data/sectionPages.json";
const p = JSON.parse(fs.readFileSync(path, "utf8"));

const people = [
  {
    title: "Abbas İbrahimov",
    desc: "İdarə Heyətinin üzvü",
    image: "https://cdn.abb-bank.az/rehberlik_Abbas_Ibrahimov_0412c73e4e.jpg",
  },
  {
    title: "Ağşin Əmirov",
    desc: "İdarə Heyətinin üzvü",
    image: "https://cdn.abb-bank.az/Agshin_Amirov_c2dd0a12b7.jpg",
  },
  {
    title: "Elmir Hüseynov",
    desc: "İdarə Heyətinin üzvü",
    image: "https://cdn.abb-bank.az/Elmir_H_69408cb732.jpg",
  },
  {
    title: "Nəbi Əliyev",
    desc: "İdarə Heyətinin üzvü",
    image: "https://cdn.abb-bank.az/Nabi_Aliyev_aebde76d13.jpg",
  },
  {
    title: "Taleh Tahirli",
    desc: "İdarə Heyətinin üzvü",
    image: "https://cdn.abb-bank.az/Taleh_Tahirli_1a6976be3f.jpg",
  },
  {
    title: "Vasif Əhmədov",
    desc: "İdarə Heyətinin üzvü",
    image: "https://cdn.abb-bank.az/Vasif_Ahmadov_0530aac38d.jpg",
  },
  {
    title: "Nərgizxanım Biləndarli",
    desc: "İdarə Heyətinin üzvü",
    image: "https://cdn.abb-bank.az/Nargizxanim_Bilandarli_fe03866ea2.jpg",
  },
  {
    title: "Aynur Süleymanlı",
    desc: "İdarə Heyətinin üzvü",
    image: "https://cdn.abb-bank.az/Aynurr_Suleymanli_b91b403cf0.jpg",
  },
  {
    title: "Nihat Şenyuva",
    desc: "İdarə Heyətinin üzvü",
    image: "https://cdn.abb-bank.az/Nihat_Shenyuva_a556dec63b.jpg",
  },
  {
    title: "Anar Abbasov",
    desc: "İdarə Heyətinin üzvü",
    image: "https://cdn.abb-bank.az/Anar_Abbasov_33aff09dcd.jpg",
  },
  {
    title: "Ülvi Məmmədov",
    desc: "İdarə Heyətinin üzvü",
    image: "https://cdn.abb-bank.az/Ulvi_muellim_e85323d47e.PNG",
  },
];

const prev = p["/haqqimizda/rehberlik"] || {};
p["/haqqimizda/rehberlik"] = {
  ...prev,
  route: "/haqqimizda/rehberlik",
  ok: true,
  title: "Rəhbərlik & İdarəetmə",
  description:
    "İdarəçi komandamız gördüyümüz hər işdə davamlı inkişaf və mükəmməlliyi təmin etmək üçün təcrübə, innovasiya və strateji istiqamət gətirir.",
  cta: "Ətraflı",
  heroImage:
    "https://cdn.abb-bank.az/Governance_and_Committees_10a92e708d.png",
  gallery: people.map((x) => x.image),
  cards: people,
  contentSections: people.map((x) => ({ title: x.title, desc: x.desc })),
  blocks: people.map((x) => ({
    title: x.title,
    desc: x.desc,
    image: x.image,
  })),
  sections: ["Rəhbərlik"],
  breadcrumbs: ["Haqqımızda", "Rəhbərlik"],
  plans: [],
  faqs: [],
  stepDetails: [],
  steps: [],
};

fs.writeFileSync(path, JSON.stringify(p, null, 2), "utf8");
console.log("fixed rehberlik", people.length);
