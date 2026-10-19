/**
 * Upgrade all CDN image URLs in sectionPages.json + sectionImages.json
 * to large_ variants when they exist (HTTP 200).
 */
import fs from "fs";

const FILES = [
  "src/lib/data/sectionPages.json",
  "src/lib/data/sectionImages.json",
];

function candidateLarge(url) {
  if (typeof url !== "string") return null;
  if (!url.includes("cdn.abb-bank.az")) return null;
  if (/\.svg($|\?)/i.test(url)) return null;
  if (/\/(icon_|small_)/i.test(url)) return null;
  if (/\/large_/i.test(url)) return url; // already large
  if (/\/medium_/i.test(url)) return url.replace("/medium_", "/large_");
  return url.replace("cdn.abb-bank.az/", "cdn.abb-bank.az/large_");
}

const cache = new Map(); // url -> best url

async function resolveBest(url) {
  if (cache.has(url)) return cache.get(url);
  const large = candidateLarge(url);
  if (!large || large === url) {
    cache.set(url, url);
    return url;
  }
  try {
    const r = await fetch(large, { method: "HEAD" });
    if (r.ok) {
      cache.set(url, large);
      return large;
    }
  } catch {
    /* keep original */
  }
  cache.set(url, url);
  return url;
}

function collectUrls(node, out = new Set()) {
  if (typeof node === "string") {
    if (node.includes("cdn.abb-bank.az")) out.add(node);
    return out;
  }
  if (Array.isArray(node)) {
    for (const x of node) collectUrls(x, out);
    return out;
  }
  if (node && typeof node === "object") {
    for (const v of Object.values(node)) collectUrls(v, out);
  }
  return out;
}

function rewrite(node, map) {
  if (typeof node === "string") {
    return map.get(node) || node;
  }
  if (Array.isArray(node)) return node.map((x) => rewrite(x, map));
  if (node && typeof node === "object") {
    const o = {};
    for (const [k, v] of Object.entries(node)) o[k] = rewrite(v, map);
    return o;
  }
  return node;
}

async function mapPool(items, concurrency, fn) {
  let i = 0;
  const results = new Array(items.length);
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return results;
}

let totalUpgraded = 0;
for (const file of FILES) {
  if (!fs.existsSync(file)) continue;
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const urls = [...collectUrls(data)];
  console.log(`${file}: ${urls.length} CDN urls`);

  await mapPool(urls, 16, async (url, idx) => {
    const best = await resolveBest(url);
    if (best !== url) totalUpgraded++;
    if ((idx + 1) % 100 === 0) process.stdout.write(`  checked ${idx + 1}/${urls.length}\n`);
    return best;
  });

  const map = new Map();
  for (const url of urls) map.set(url, cache.get(url) || url);

  const next = rewrite(data, map);
  fs.writeFileSync(file, JSON.stringify(next, null, 2), "utf8");
  console.log(`  wrote ${file}`);
}

console.log("DONE upgraded", totalUpgraded, "urls to large_");
