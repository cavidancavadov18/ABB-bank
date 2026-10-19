import { chromium } from "playwright";

const routes = [
  "/",
  "/ferdi/kreditler/nagd-kredit",
  "/ferdi/kartlar",
  "/ferdi/emanetler/digideposit",
  "/ferdi/kesbek/faydali-kesbek",
  "/abb-mobile",
  "/biznes/korporativ",
  "/haqqimizda",
  "/haqqimizda/rehberlik",
  "/ferdi/butun-hesablar/digihesab",
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const route of routes) {
  await page.goto(`https://abb-bank.az${route}`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(1200);
  for (const y of [600, 1600, 2800, 4200, 5600]) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(120);
  }

  const blocks = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll("section, div")) {
      const cs = getComputedStyle(el);
      const bg = cs.backgroundColor;
      const bgi = cs.backgroundImage || "";
      const cls = (el.className || "").toString();
      const r = el.getBoundingClientRect();
      if (r.width < 700 || r.height < 200 || r.height > 900) continue;

      const m = bg.match(/rgba?\(\s*(\d+)/);
      const darkSolid = m && Number(m[1]) < 70 && !bg.includes("0, 0, 0, 0");
      const darkGrad =
        bgi.includes("36, 40, 47") ||
        bgi.includes("24282f") ||
        /bg-gradient-black|bg-surface-invert|bg-neutral-900|bg-black/.test(cls) ||
        (bgi.includes("radial-gradient") && /rgb\(\s*[0-5]?\d/.test(bgi));

      if (!darkSolid && !darkGrad) continue;

      const text = (el.innerText || "").replace(/\s+/g, " ").trim().slice(0, 160);
      if (text.length < 25) continue;
      // skip whole page wrappers
      if (text.length > 500) continue;

      const imgs = [...el.querySelectorAll("img")]
        .slice(0, 4)
        .map((i) => (i.currentSrc || i.src).split("?")[0])
        .filter((u) => u.includes("cdn.abb-bank.az"));

      out.push({
        h: Math.round(r.height),
        text,
        imgs: imgs.map((u) => u.replace("https://cdn.abb-bank.az/", "")),
        cls: cls.slice(0, 120),
      });
    }

    const seen = new Set();
    return out.filter((b) => {
      const k = b.text.slice(0, 60);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }).slice(0, 8);
  });

  console.log("\n===", route, "===");
  for (const b of blocks) console.log(JSON.stringify(b));
}

await browser.close();
