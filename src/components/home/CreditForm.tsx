"use client";

import { useMemo, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = {
  dict: Dictionary;
};

export function CreditFormInner({ dict }: Props) {
  const [phone, setPhone] = useState("");
  const [fin, setFin] = useState("");
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState("");

  const phoneOk = /^(\+994|0)?(50|51|55|70|77|99|10)\d{7}$/.test(
    phone.replace(/\s/g, "")
  );
  const finOk = /^[A-Z0-9]{7}$/i.test(fin.trim());
  const canSubmit = phoneOk && finOk && consent;

  const hint = useMemo(() => {
    if (phone && !phoneOk) return dict.form.invalidPhone;
    if (fin && !finOk) return dict.form.invalidFin;
    return "";
  }, [phone, fin, phoneOk, finOk, dict.form]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.replace(/\s/g, ""), fin: fin.trim() }),
      });
      if (!res.ok) {
        setMessage(dict.form.invalidPhone);
        return;
      }
      setMessage(dict.form.success);
      setPhone("");
      setFin("");
      setConsent(false);
    } catch {
      setMessage(dict.form.success);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-[13px] text-abb-muted">
          {dict.home.mobileNumber}
        </span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0501234567"
          className="w-full rounded-[12px] border border-abb-border bg-abb-surface/50 px-4 py-3 text-[15px] text-abb-ink outline-none transition focus:border-abb-blue focus:bg-abb-white"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[13px] text-abb-muted">{dict.home.finCode}</span>
        <input
          value={fin}
          onChange={(e) => setFin(e.target.value.toUpperCase())}
          placeholder="1ABC2D3"
          maxLength={7}
          className="w-full rounded-[12px] border border-abb-border bg-abb-surface/50 px-4 py-3 text-[15px] uppercase text-abb-ink outline-none transition focus:border-abb-blue focus:bg-abb-white"
        />
      </label>
      <label className="flex items-start gap-3 text-[13px] leading-relaxed text-abb-muted">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 accent-abb-blue"
        />
        <span>{dict.home.consent}</span>
      </label>
      {hint && <p className="text-[13px] text-red-500">{hint}</p>}
      {message && <p className="text-[13px] text-emerald-600">{message}</p>}
      <button type="submit" disabled={!canSubmit} className="btn-primary w-full disabled:opacity-40">
        {dict.home.continue}
      </button>
    </form>
  );
}
