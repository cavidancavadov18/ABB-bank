import fs from "fs";

const path = "src/lib/data/sectionPages.json";
const p = JSON.parse(fs.readFileSync(path, "utf8"));

const BAD =
  /menuAttached|uiRouterKey|@type|contactPoint|schema\.org|\\\\"|\\"path\\"|INTERNAL/;

let n = 0;
for (const x of Object.values(p)) {
  if (!x.plans?.length) continue;
  const before = x.plans.length;
  x.plans = x.plans.filter((pl) => {
    const d = pl.desc || "";
    if (BAD.test(d) || BAD.test(pl.title || "")) return false;
    if (d.length > 160) return false;
    // single-word leftovers from regex
    if (/^(krediti|almaq|etmək)$/i.test(d.trim())) return false;
    return true;
  });
  n += before - x.plans.length;
}

// Digideposit shouldn't show credit plans
if (p["/ferdi/emanetler/digideposit"]) {
  p["/ferdi/emanetler/digideposit"].plans = [];
}

fs.writeFileSync(path, JSON.stringify(p, null, 2), "utf8");
console.log("removed bad plans", n);
