import { readFileSync, writeFileSync } from "fs";

const pages = JSON.parse(readFileSync("./src/lib/data/sectionPages.json", "utf8"));
const mega = readFileSync("./src/lib/data/megaMenu.ts", "utf8");
const hrefs = [
  ...new Set(
    [...mega.matchAll(/href:\s*["']([^"']+)["']/g)]
      .map((m) => m[1])
      .filter((h) => !h.startsWith("http"))
  ),
];

function score(hit) {
  if (!hit) return { score: 0, reasons: ["missing"] };
  const reasons = [];
  let s = 0;
  if (hit.heroImage) s += 2;
  else reasons.push("no-hero");
  if (hit.description?.length > 80) s += 2;
  else if (hit.description?.length > 20) s += 1;
  else reasons.push("weak-desc");
  const cards = hit.cards?.length || 0;
  s += Math.min(cards, 4);
  if (!cards) reasons.push("no-cards");
  const content = hit.contentSections?.length || 0;
  s += Math.min(content, 3);
  if ((hit.faqs?.length || 0) >= 2) s += 2;
  else if (!(hit.faqs?.length || 0)) reasons.push("no-faq");
  if ((hit.plans?.length || 0) >= 2) s += 2;
  if ((hit.stepDetails?.length || 0) >= 2 || (hit.steps?.length || 0) >= 2)
    s += 2;
  if ((hit.stats?.length || 0) >= 2) s += 1;
  if ((hit.blocks?.length || 0) >= 1) s += 1;
  return { score: s, reasons, cards, content, faqs: hit.faqs?.length || 0 };
}

const rows = hrefs
  .map((h) => {
    const hit = pages[h];
    const sc = score(hit);
    return {
      route: h,
      ok: hit?.ok !== false,
      title: hit?.title || "",
      ...sc,
      hero: !!hit?.heroImage,
    };
  })
  .sort((a, b) => a.score - b.score);

writeFileSync(
  "./scripts/_audit-out.json",
  JSON.stringify({ total: rows.length, rows }, null, 2)
);
console.log("weakest 40:");
for (const r of rows.slice(0, 40)) {
  console.log(
    `${String(r.score).padStart(2)}  ${r.route}  [${r.reasons.join(",")}] cards=${r.cards} faq=${r.faqs}`
  );
}
console.log("\nstrongest 10:");
for (const r of rows.slice(-10)) {
  console.log(`${String(r.score).padStart(2)}  ${r.route}`);
}
