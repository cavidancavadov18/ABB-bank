"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { calculatorDefaults } from "@/lib/data/content";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";

type Tab = "credit" | "deposit" | "auto" | "mortgage";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function Calculator({ locale, dict }: Props) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "credit", label: dict.home.credit },
    { key: "deposit", label: dict.home.deposit },
    { key: "auto", label: dict.home.autoLoan },
    { key: "mortgage", label: dict.home.mortgageTab },
  ];

  const [tab, setTab] = useState<Tab>("credit");
  const defaults = calculatorDefaults[tab === "auto" ? "auto" : tab];
  const [amount, setAmount] = useState(defaults.amount);
  const [term, setTerm] = useState(defaults.term);
  const [rate, setRate] = useState(defaults.rate);

  const switchTab = (next: Tab) => {
    setTab(next);
    const d = calculatorDefaults[next === "auto" ? "auto" : next];
    setAmount(d.amount);
    setTerm(d.term);
    setRate(d.rate);
  };

  const result = useMemo(() => {
    if (tab === "deposit") {
      const interest = amount * (rate / 100) * (term / 12);
      return {
        primary: amount + interest,
        secondary: interest,
        primaryLabel: dict.home.totalPayment,
        secondaryLabel: locale === "az" ? "Gəlir" : "Income",
      };
    }
    const monthlyRate = rate / 100 / 12;
    const payment =
      monthlyRate === 0
        ? amount / term
        : (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) /
          (Math.pow(1 + monthlyRate, term) - 1);
    return {
      primary: payment,
      secondary: payment * term,
      primaryLabel: dict.home.monthlyPayment,
      secondaryLabel: dict.home.totalPayment,
    };
  }, [amount, term, rate, tab, dict, locale]);

  const cfg = calculatorDefaults[tab === "auto" ? "auto" : tab];

  return (
    <section className="container-abb py-8">
      <div className="card-soft p-6 md:p-8">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[14px] font-medium text-abb-blue">{dict.home.calculateNow}</p>
            <h2 className="section-title mt-1">{dict.home.initialCalc}</h2>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 border-b border-abb-border pb-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => switchTab(t.key)}
              className={`rounded-full px-4 py-2 text-[14px] font-medium transition ${
                tab === t.key
                  ? "bg-abb-blue text-white"
                  : "bg-abb-surface text-abb-ink hover:bg-abb-blue-light"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6">
            <SliderField
              label={dict.home.amount}
              value={amount}
              min={cfg.min}
              max={cfg.max}
              step={100}
              suffix="AZN"
              onChange={setAmount}
            />
            <SliderField
              label={dict.home.term}
              value={term}
              min={3}
              max={tab === "mortgage" ? 360 : 60}
              step={1}
              onChange={setTerm}
            />
            <SliderField
              label={dict.home.rate}
              value={rate}
              min={1}
              max={30}
              step={0.1}
              onChange={setRate}
            />
          </div>

          <div className="rounded-[24px] bg-abb-blue p-6 text-white md:p-8">
            <p className="text-[14px] text-white/80">{result.primaryLabel}</p>
            <p className="mt-2 text-[36px] font-semibold tracking-tight">
              {formatMoney(result.primary)} AZN
            </p>
            <div className="mt-6 border-t border-white/20 pt-4">
              <p className="text-[14px] text-white/80">{result.secondaryLabel}</p>
              <p className="mt-1 text-[22px] font-medium">
                {formatMoney(result.secondary)} AZN
              </p>
            </div>
            <Link href={`/${locale}/ferdi`} className="btn-white mt-8 w-full">
              {dict.home.continue}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-[14px] text-abb-muted">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-28 rounded-[10px] border border-abb-border px-3 py-2 text-right text-[15px] font-medium outline-none focus:border-abb-blue"
          />
          {suffix && <span className="text-[13px] text-abb-muted">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        className="range-abb"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function formatMoney(n: number) {
  return n.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
}
