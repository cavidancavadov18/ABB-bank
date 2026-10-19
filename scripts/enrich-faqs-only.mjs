/**
 * Scrape FAQ Q&A from live abb-bank.az for pages missing FAQ answers.
 */
import fs from "fs";
import { chromium } from "playwright";

const existing = JSON.parse(
  fs.readFileSync("src/lib/data/sectionPages.json", "utf8")
);

const ROUTES = Object.keys(existing).filter((route) => {
  const faqs = existing[route]?.faqs || [];
  const good = faqs.filter(
    (f) => typeof f === "object" && (f.a || "").length > 40
  ).length;
  return good < 2 && !/satinalmalar|senedler|hesabatlar|siyaset|faydali-link|rekvizit|muxbir|standart-sertler|korporativ-teqdimat|brend|arasdirma|huquqi|teklif|idareetme/i.test(
    route
  );
});

console.log("FAQ enrich for", ROUTES.length, "routes");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  locale: "az-AZ",
});

const updated = [];

for (let i = 0; i < ROUTES.length; i++) {
  const route = ROUTES[i];
  process.stdout.write(`[${i + 1}/${ROUTES.length}] ${route} ... `);
  try {
    await page.goto(`https://abb-bank.az${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(1200);
    for (const y of [1000, 2200, 3600, 5000]) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(200);
    }
    try {
      const faqTab = page.getByRole("button", { name: /^FAQ$/i });
      if (await faqTab.count()) await faqTab.first().click({ timeout: 800 });
    } catch {
      /* */
    }
    await page.waitForTimeout(300);

    const faqs = await page.evaluate(async () => {
      const txt = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
      const out = [];
      for (const btn of document.querySelectorAll("button")) {
        const q0 = txt(btn).replace(/\+$/, "").trim();
        if (!/\?/.test(q0) || q0.length < 12 || q0.length > 180) continue;
        try {
          btn.click();
        } catch {
          /* */
        }
        await new Promise((r) => setTimeout(r, 90));
        const item =
          btn.closest('[class*="border-b"], details, li, div') ||
          btn.parentElement;
        const full = txt(item);
        const q = q0.match(/^[^?]{8,140}\?/)?.[0] || q0.split("?")[0] + "?";
        let a = full.startsWith(q)
          ? full.slice(q.length).trim()
          : full.replace(q, "").trim();
        a = a.replace(/\s+/g, " ").replace(/\+$/, "").trim();
        if (a.length > 35 && !out.some((f) => f.q === q)) {
          out.push({ q, a: a.slice(0, 800) });
        }
        if (out.length >= 14) break;
      }
      return out;
    });

    const prev = existing[route]?.faqs || [];
    const prevGood = prev.filter(
      (f) => typeof f === "object" && (f.a || "").length > 40
    ).length;

    if (faqs.length > prevGood) {
      existing[route] = {
        ...existing[route],
        faqs,
        ok: true,
      };
      updated.push({ route, faqs: faqs.length });
      console.log(`UPD faqs=${faqs.length}`);
    } else {
      console.log(`same ${prevGood}`);
    }
  } catch (e) {
    console.log("ERR", e.message);
  }
}

fs.writeFileSync(
  "src/lib/data/sectionPages.json",
  JSON.stringify(existing, null, 2),
  "utf8"
);
fs.writeFileSync(
  "scripts/_faq-report.json",
  JSON.stringify({ updated, total: ROUTES.length }, null, 2)
);
console.log("FAQ updated:", updated.length);
await browser.close();
