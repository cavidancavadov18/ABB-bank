import fs from "fs";
const t = fs.readFileSync("tmp-abb.html", "utf8");
const hrefs = [...t.matchAll(/href="(\/[^"]+)"/g)].map((m) => m[1]);
const uniq = [...new Set(hrefs)].sort();
const routes = uniq.filter(
  (h) =>
    h.startsWith("/ferdi") ||
    h.startsWith("/biznes") ||
    h.startsWith("/haqq") ||
    h.startsWith("/investor") ||
    h.startsWith("/xeber") ||
    h.startsWith("/kampaniya")
);
console.log(routes.join("\n"));
console.log("---COUNT---", routes.length);
