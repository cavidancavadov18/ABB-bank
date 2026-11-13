from __future__ import annotations

import re
import time
from datetime import datetime, timedelta, timezone
from typing import Any

import httpx

CODES = ("USD", "EUR", "RUB")
TTL_MS = 60 * 60 * 1000
_cache: dict[str, Any] | None = None
_cache_at = 0.0

BAKU = timezone(timedelta(hours=4))


def _baku_date(offset_days: int = 0) -> str:
    now = datetime.now(BAKU) - timedelta(days=offset_days)
    return now.strftime("%d.%m.%Y")


def _parse_bulletin(xml: str, fallback_date: str) -> dict[str, Any] | None:
    date_match = re.search(r'<ValCurs\b[^>]*\bDate="([^"]+)"', xml)
    date = date_match.group(1) if date_match else fallback_date
    blocks = re.findall(r"<Valute\b[\s\S]*?</Valute>", xml, flags=re.I)
    found: dict[str, dict[str, Any]] = {}

    for block in blocks:
        code_match = re.search(r'\bCode="([A-Z]{3})"', block)
        if not code_match:
            continue
        code = code_match.group(1)
        if code not in CODES:
            continue
        nom_match = re.search(r"<Nominal>\s*([\d.,]+)\s*</Nominal>", block, flags=re.I)
        val_match = re.search(r"<Value>\s*([\d.,]+)\s*</Value>", block, flags=re.I)
        if not nom_match or not val_match:
            continue
        nominal = float(nom_match.group(1).replace(",", "."))
        value = float(val_match.group(1).replace(",", "."))
        if nominal <= 0:
            continue
        found[code] = {"code": code, "nominal": nominal, "value": value}

    rates = [found[c] for c in CODES if c in found]
    if len(rates) != len(CODES):
        return None
    return {
        "date": date,
        "source": f"https://cbar.az/currencies/{date}.xml",
        "rates": rates,
    }


async def get_cbar_rates() -> dict[str, Any]:
    global _cache, _cache_at
    if _cache and (time.time() * 1000 - _cache_at) < TTL_MS:
        return _cache

    async with httpx.AsyncClient(timeout=20.0) as client:
        for offset in range(7):
            date = _baku_date(offset)
            url = f"https://cbar.az/currencies/{date}.xml"
            try:
                response = await client.get(
                    url,
                    headers={
                        "Accept": "application/xml,text/xml,*/*",
                        "User-Agent": "ABB-bank-demo/1.0",
                    },
                )
                if response.status_code != 200:
                    continue
                bulletin = _parse_bulletin(response.text, date)
                if not bulletin:
                    continue
                _cache = bulletin
                _cache_at = time.time() * 1000
                return bulletin
            except Exception:
                continue

    raise RuntimeError("CBAR rates unavailable")
