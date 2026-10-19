import fs from "fs";

const files = [
  "src/components/home/HeroSection.tsx",
  "src/components/home/Campaigns.tsx",
  "src/components/home/DigiCardPromo.tsx",
  "src/components/home/CareSection.tsx",
  "src/components/home/NewsSection.tsx",
  "src/components/home/QuickLinks.tsx",
  "src/components/home/ServicesSection.tsx",
  "src/app/[locale]/ferdi/page.tsx",
  "src/app/[locale]/biznes/page.tsx",
  "src/app/[locale]/haqqimizda/page.tsx",
  "src/app/[locale]/xeberler/page.tsx",
];

for (const f of files) {
  if (!fs.existsSync(f)) {
    console.log("missing", f);
    continue;
  }
  let s = fs.readFileSync(f, "utf8");
  if (!s.includes("next/image")) {
    console.log("skip", f);
    continue;
  }
  s = s.replace(
    /import Image from ["']next\/image["'];/,
    'import { CdnImage } from "@/components/CdnImage";'
  );
  s = s.replace(/<Image\b/g, "<CdnImage");
  s = s.replace(/<\/Image>/g, "</CdnImage>");
  s = s.replace(/\s*quality=\{?\d+\}?/g, "");
  fs.writeFileSync(f, s);
  console.log("ok", f);
}
