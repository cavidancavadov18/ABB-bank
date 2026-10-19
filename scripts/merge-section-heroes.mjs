import fs from "fs";

const pages = JSON.parse(fs.readFileSync("src/lib/data/sectionPages.json", "utf8"));
const images = JSON.parse(fs.readFileSync("src/lib/data/sectionImages.json", "utf8"));

function fixHashLarge(u) {
  if (!u) return u;
  return u.replace(
    /cdn\.abb-bank\.az\/large_([0-9a-f]{20,}[^/]*)$/i,
    "cdn.abb-bank.az/$1"
  );
}

for (const [route, page] of Object.entries(pages)) {
  const curated = images[route]?.image;
  if (curated) page.heroImage = curated;
  else page.heroImage = fixHashLarge(page.heroImage);

  page.gallery = (page.gallery || [])
    .map(fixHashLarge)
    .filter((u) => u && u !== page.heroImage);

  // Prefer curated gallery first
  if (images[route]?.gallery?.length) {
    page.gallery = [
      ...images[route].gallery.filter((u) => u !== page.heroImage),
      ...page.gallery,
    ].filter((u, i, a) => a.indexOf(u) === i).slice(0, 10);
  }

  page.blocks = (page.blocks || []).map((b) => ({
    ...b,
    image: fixHashLarge(b.image),
  }));
}

fs.writeFileSync(
  "src/lib/data/sectionPages.json",
  JSON.stringify(pages, null, 2),
  "utf8"
);
console.log(
  "merged",
  Object.keys(pages).length,
  "nagd=",
  pages["/ferdi/kreditler/nagd-kredit"].heroImage.split("/").pop()
);
