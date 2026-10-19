const res = await fetch("https://abb-bank.az/");
const t = await res.text();
const hrefs = [...t.matchAll(/href="(\/[^"#?][^"]*)"/g)].map((m) => m[1]);
const uniq = [...new Set(hrefs)]
  .filter((h) =>
    /ferdi|biznes|haqq|investor|xeber|kampaniya|kredit|kart|emanet|hesab|ipotek|kesbek|prime|online|tarif/i.test(
      h
    )
  )
  .sort();
console.log("html", t.length);
console.log(uniq.join("\n"));
