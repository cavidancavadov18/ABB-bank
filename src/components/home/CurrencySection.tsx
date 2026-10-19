"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { exchangeRates } from "@/lib/data/content";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";
import { ArrowRight } from "../icons";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

const currencies = ["AZN", "USD", "EUR", "RUB"] as const;

export function CurrencySection({ locale, dict }: Props) {
  const [sellAmount, setSellAmount] = useState("100");
  const [from, setFrom] = useState<(typeof currencies)[number]>("AZN");
  const [to, setTo] = useState<(typeof currencies)[number]>("USD");

  const rateMap = useMemo(() => {
    const map: Record<string, { buy: number; sell: number }> = {
      AZN: { buy: 1, sell: 1 },
      USD: { buy: exchangeRates[0].buy, sell: exchangeRates[0].sell },
      EUR: { buy: exchangeRates[1].buy, sell: exchangeRates[1].sell },
      RUB: {
        buy: exchangeRates[2].buy / 100,
        sell: exchangeRates[2].sell / 100,
      },
    };
    return map;
  }, []);

  const buyAmount = useMemo(() => {
    const amount = Number(sellAmount) || 0;
    if (from === to) return amount.toFixed(2);
    // Convert from -> AZN -> to using mid-ish bank logic: sell when buying foreign with AZN
    let azn = amount;
    if (from !== "AZN") {
      azn = amount * rateMap[from].buy;
    }
    if (to === "AZN") return azn.toFixed(2);
    return (azn / rateMap[to].sell).toFixed(2);
  }, [sellAmount, from, to, rateMap]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <section className="container-abb py-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-soft p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-[24px] font-semibold text-abb-ink">
              {dict.home.currencyRates}
            </h2>
            <Link href={`/${locale}/ferdi`} className="link-blue inline-flex items-center gap-1 text-[14px]">
              {dict.home.allRates}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-[16px] border border-abb-border">
            <div className="grid grid-cols-3 bg-abb-surface px-4 py-3 text-[13px] font-medium text-abb-muted">
              <span>{dict.home.currency}</span>
              <span className="text-right">{dict.home.buy}</span>
              <span className="text-right">{dict.home.sell}</span>
            </div>
            {exchangeRates.map((row) => (
              <div
                key={row.code}
                className="grid grid-cols-3 border-t border-abb-border px-4 py-3.5 text-[15px]"
              >
                <span className="font-medium text-abb-ink">{row.code}</span>
                <span className="text-right text-abb-ink">{row.buy.toFixed(4)}</span>
                <span className="text-right text-abb-ink">{row.sell.toFixed(4)}</span>
              </div>
            ))}
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
