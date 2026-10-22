export type CbarRate = {
  code: string;
  nominal: number;
  value: number;
};

export type CbarBulletin = {
  date: string;
  source: string;
  rates: CbarRate[];
};

const CODES = ["USD", "EUR", "RUB"] as const;
const TTL_MS = 60 * 60 * 1000;

let cache: { at: number; data: CbarBulletin } | null = null;

function bakuDate(offsetDays = 0): string {
  const now = new Date(Date.now() + 4 * 60 * 60 * 1000 - offsetDays * 86_400_000);
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = now.getUTCFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function parseBulletin(xml: string, fallbackDate: string): CbarBulletin | null {
  const date = xml.match(/<ValCurs\b[^>]*\bDate="([^"]+)"/)?.[1] || fallbackDate;
  const blocks = xml.match(/<Valute\b[\s\S]*?<\/Valute>/gi) ?? [];
  const found = new Map<string, CbarRate>();

  for (const block of blocks) {
    const code = block.match(/\bCode="([A-Z]{3})"/)?.[1];
    if (!code || !CODES.includes(code as (typeof CODES)[number])) continue;
    const nominal = Number(
      block.match(/<Nominal>\s*([\d.,]+)\s*<\/Nominal>/i)?.[1]?.replace(",", ".")
    );
    const value = Number(
      block.match(/<Value>\s*([\d.,]+)\s*<\/Value>/i)?.[1]?.replace(",", ".")
    );
    if (!Number.isFinite(nominal) || nominal <= 0 || !Number.isFinite(value)) continue;
    found.set(code, { code, nominal, value });
  }

  const rates = CODES.map((code) => found.get(code)).filter((row): row is CbarRate => !!row);
  if (rates.length !== CODES.length) return null;
  return {
    date,
    source: `https://cbar.az/currencies/${date}.xml`,
    rates,
  };
}

async function fetchBulletin(date: string): Promise<CbarBulletin | null> {
  const url = `https://cbar.az/currencies/${date}.xml`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/xml,text/xml,*/*",
      "User-Agent": "ABB-bank-demo/1.0",
    },
    cache: "no-store",
  });
  if (!response.ok) return null;
  return parseBulletin(await response.text(), date);
}

export async function getCbarRates(): Promise<CbarBulletin> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;

  for (let offset = 0; offset < 7; offset++) {
    const date = bakuDate(offset);
    try {
      const bulletin = await fetchBulletin(date);
      if (!bulletin) continue;
      cache = { at: Date.now(), data: bulletin };
      return bulletin;
    } catch {
      continue;
    }
  }

  throw new Error("CBAR rates unavailable");
}
