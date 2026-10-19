import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

async function packByHint(hint) {
  return page.evaluate((reSrc) => {
    const re = new RegExp(reSrc, "i");
    const el = [...document.querySelectorAll("section,div")].find((node) => {
      const t = (node.innerText || "").slice(0, 220);
      const r = node.getBoundingClientRect();
      return re.test(t) && r.height > 280 && r.width > 700 && node.querySelector("img");
    });
    if (!el) return null;
    let root = el;
    for (let i = 0; i < 10; i++) {
      const bgi = getComputedStyle(root).backgroundImage;
      const cls = (root.className || "").toString();
      if (
        bgi.includes("radial") ||
        bgi.includes("36, 40, 47") ||
        /bg-gradient-black|bg-surface-invert/.test(cls)
      ) {
        break;
      }
      if (!root.parentElement) break;
      root = root.parentElement;
    }
    const cs = getComputedStyle(root);
    return {
      bgi: cs.backgroundImage.slice(0, 180),
      bg: cs.backgroundColor,
      radius: cs.borderRadius,
      pad: cs.padding,
      h: Math.round(root.getBoundingClientRect().height),
      imgs: [...root.querySelectorAll("img")].map((i) =>
        (i.currentSrc || i.src).split("?")[0]
      ),
      texts: [...root.querySelectorAll("h2,h3,p,div")]
        .map((e) => (e.textContent || "").replace(/\s+/g, " ").trim())
        .filter((t) => t.length > 4 && t.length < 140)
        .filter((t, i, a) => a.indexOf(t) === i)
        .slice(0, 14),
    };
  }, hint);
}

await page.goto("https://abb-bank.az/ferdi/kreditler/nagd-kredit", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForTimeout(1500);
for (const y of [1800, 2800, 3800]) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(200);
}

const nagd = {
  steps: await packByHint("ABB mobile-dan 3 addım"),
  mobile: await packByHint("ABB mobile yükləmək üçün QR"),
};

await page.goto("https://abb-bank.az/haqqimizda", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForTimeout(1200);
for (const y of [1500, 2800, 4000]) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(200);
}
const about = {
  career: await packByHint("Gələcəyinizi"),
  bankYear: await packByHint("İlin bankı"),
};

await page.goto("https://abb-bank.az/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForTimeout(1200);
for (const y of [4000, 5500, 7000]) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(200);
}
const home = {
  career: await packByHint("Gələcəyinizi"),
  mobile: await packByHint("ABB mobile yükləmək üçün QR"),
};

const out = { nagd, about, home };
fs.writeFileSync("scripts/_dark-blocks.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
await browser.close();
