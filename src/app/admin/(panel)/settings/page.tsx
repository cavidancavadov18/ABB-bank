"use client";

import { FormEvent, useEffect, useState } from "react";

type Settings = {
  siteName: string;
  chatEnabled: boolean;
  maintenanceMode: boolean;
  supportPhone: string;
  supportEmail: string;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
      .catch(() => setSettings(null));
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaved(false);
    setError("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Saxlanılmadı");
      return;
    }
    setSaved(true);
  };

  if (!settings) {
    return <p className="text-white/50">Yüklənir…</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold">Ayarlar</h1>
        <p className="mt-1 text-[14px] text-white/50">
          Sayt və chat parametrləri
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="max-w-xl space-y-4 rounded-2xl border border-white/8 bg-[#161b26] p-5"
      >
        <label className="block">
          <span className="mb-1 block text-[12px] text-white/50">Sayt adı</span>
          <input
            value={settings.siteName}
            onChange={(e) =>
              setSettings({ ...settings, siteName: e.target.value })
            }
            className="admin-input w-full"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[12px] text-white/50">
            Dəstək telefonu
          </span>
          <input
            value={settings.supportPhone}
            onChange={(e) =>
              setSettings({ ...settings, supportPhone: e.target.value })
            }
            className="admin-input w-full"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[12px] text-white/50">E-poçt</span>
          <input
            value={settings.supportEmail}
            onChange={(e) =>
              setSettings({ ...settings, supportEmail: e.target.value })
            }
            className="admin-input w-full"
          />
        </label>
        <label className="flex items-center gap-2 text-[13px]">
          <input
            type="checkbox"
            checked={settings.chatEnabled}
            onChange={(e) =>
              setSettings({ ...settings, chatEnabled: e.target.checked })
            }
          />
          Chat aktivdir
        </label>
        <label className="flex items-center gap-2 text-[13px]">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) =>
              setSettings({ ...settings, maintenanceMode: e.target.checked })
            }
          />
          Maintenance rejimi (qeyd — demo bayraq)
        </label>

        {error && <p className="text-[13px] text-red-300">{error}</p>}
        {saved && (
          <p className="text-[13px] text-emerald-300">Yadda saxlanıldı</p>
        )}

        <button
          type="submit"
          className="rounded-xl bg-[#1b63ed] px-4 py-2.5 text-[13px] font-medium"
        >
          Saxla
        </button>
      </form>
    </div>
  );
}
