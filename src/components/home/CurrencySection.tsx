"use client";

import { useEffect, useMemo, useState } from "react";
import type { CbarRate } from "@/lib/cbar";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";
import { ArrowRight } from "../icons";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

const currencies = ["AZN", "USD", "EUR", "RUB"] as const;

function rateLabel(row: CbarRate) {
  return row.nominal === 1 ? row.code : `${row.nominal} ${row.code}`;
}

export function CurrencySection({ locale, dict }: Props) {
  const [sellAmount, setSellAmount] = useState("100");
  const [from, setFrom] = useState<(typeof currencies)[number]>("AZN");
  const [to, setTo] = useState<(typeof currencies)[number]>("USD");
  const [rates, setRates] = useState<CbarRate[] | null>(null);
  const [bulletinDate, setBulletinDate] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/rates")
      .then((response) => {
        if (!response.ok) throw new Error("rates");
        return response.json() as Promise<{ date: string; rates: CbarRate[] }>;
      })
      .then((data) => {
        if (cancelled) return;
        setRates(data.rates);
        setBulletinDate(data.date);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const perUnit = useMemo(() => {
    const map: Record<string, number> = { AZN: 1 };
    for (const row of rates ?? []) map[row.code] = row.value / row.nominal;
    return map;
  }, [rates]);

  const buyAmount = useMemo(() => {
    if (!rates) return "—";
    const amount = Number(sellAmount) || 0;
    if (from === to) return amount.toFixed(2);
    const fromRate = perUnit[from];
    const toRate = perUnit[to];
    if (!fromRate || !toRate) return "—";
    const azn = from === "AZN" ? amount : amount * fromRate;
    return (to === "AZN" ? azn : azn / toRate).toFixed(2);
  }, [sellAmount, from, to, perUnit, rates]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <section className="container-abb py-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-soft p-6 md:p-8">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-[24px] font-semibold text-abb-ink">
              {dict.home.currencyRates}
            </h2>
            <a
              href="https://cbar.az/currency/rates"
              target="_blank"
              rel="noreferrer"
              className="link-blue inline-flex items-center gap-1 text-[14px]"
            >
              {dict.home.allRates}
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <p className="mb-6 text-[13px] text-abb-muted">
            {bulletinDate
              ? `${dict.home.rateSource} · ${bulletinDate}`
              : dict.home.rateSource}
          </p>
          <div className="overflow-hidden rounded-[16px] border border-abb-border">
            <div className="grid grid-cols-2 bg-abb-surface px-4 py-3 text-[13px] font-medium text-abb-muted">
              <span>{dict.home.currency}</span>
              <span className="text-right">{dict.home.officialRate}</span>
            </div>
            {error ? (
              <p className="border-t border-abb-border px-4 py-3.5 text-[15px] text-abb-muted">
                {dict.home.rateError}
              </p>
            ) : rates ? (
              rates.map((row) => (
                <div
                  key={row.code}
                  className="grid grid-cols-2 border-t border-abb-border px-4 py-3.5 text-[15px]"
                >
                  <span className="font-medium text-abb-ink">{rateLabel(row)}</span>
                  <span className="text-right text-abb-ink">{row.value.toFixed(4)}</span>
                </div>
              ))
            ) : (
              [0, 1, 2].map((row) => (
                <div
                  key={row}
                  className="grid grid-cols-2 border-t border-abb-border px-4 py-3.5"
                >
                  <span className="h-4 w-16 animate-pulse rounded bg-abb-surface" />
                  <span className="ml-auto h-4 w-20 animate-pulse rounded bg-abb-surface" />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card-soft p-6 md:p-8">
          <h2 className="mb-6 text-[24px] font-semibold text-abb-ink">
            {dict.home.converter}
          </h2>
          <div className="space-y-4">
            <CurrencyInput
              label={locale === "az" ? "Satıram" : "I sell"}
              amount={sellAmount}
              currency={from}
              onAmount={setSellAmount}
              onCurrency={setFrom}
            />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={swap}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-abb-blue text-white shadow"
                aria-label="Swap"
              >
                <span className="text-lg leading-none">↑↓</span>
              </button>
            </div>
            <CurrencyInput
              label={locale === "az" ? "Alıram" : "I buy"}
              amount={buyAmount}
              currency={to}
              onAmount={() => {}}
              onCurrency={setTo}
              readOnly
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CurrencyInput({
  label,
  amount,
  currency,
  onAmount,
  onCurrency,
  readOnly,
}: {
  label: string;
  amount: string;
  currency: (typeof currencies)[number];
  onAmount: (v: string) => void;
  onCurrency: (v: (typeof currencies)[number]) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="rounded-[16px] border border-abb-border bg-abb-surface/40 p-4">
      <p className="mb-2 text-[13px] text-abb-muted">{label}</p>
      <div className="flex items-center gap-3">
        <input
          value={amount}
          readOnly={readOnly}
          onChange={(e) => onAmount(e.target.value)}
          className="w-full bg-transparent text-[24px] font-semibold outline-none"
          placeholder="0"
        />
        <select
          value={currency}
          onChange={(e) => onCurrency(e.target.value as (typeof currencies)[number])}
          className="rounded-[10px] border border-abb-border bg-abb-white px-3 py-2 text-[14px] font-medium text-abb-ink outline-none"
        >
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
