"use client";

import { useCallback, useEffect, useState } from "react";

type App = {
  id: string;
  phone: string;
  fin: string;
  createdAt: string;
  status: "new" | "reviewed" | "closed";
};

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<App[]>([]);

  const load = useCallback(() => {
    fetch("/api/admin/applications")
      .then((r) => r.json())
      .then((d) => setApps(d.applications || []))
      .catch(() => setApps([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: string, status: App["status"]) => {
    await fetch("/api/admin/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Silinsin?")) return;
    await fetch("/api/admin/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, delete: true }),
    });
    load();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold">Kredit müraciətləri</h1>
        <p className="mt-1 text-[14px] text-white/50">
          Ana səhifə formundan gələn müraciətlər
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#161b26]">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-white/8 text-white/45">
            <tr>
              <th className="px-4 py-3 font-medium">Telefon</th>
              <th className="px-4 py-3 font-medium">FİN</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">
                Tarix
              </th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a.id} className="border-b border-white/5">
                <td className="px-4 py-3 font-medium">{a.phone}</td>
                <td className="px-4 py-3 text-white/70">{a.fin}</td>
                <td className="hidden px-4 py-3 text-white/45 md:table-cell">
                  {new Date(a.createdAt).toLocaleString("az-AZ")}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={a.status}
                    onChange={(e) =>
                      setStatus(a.id, e.target.value as App["status"])
                    }
                    className="rounded-lg border border-white/10 bg-[#0f141c] px-2 py-1 text-[12px]"
                  >
                    <option value="new">Yeni</option>
                    <option value="reviewed">Baxılıb</option>
                    <option value="closed">Bağlı</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => remove(a.id)}
                    className="text-red-300 hover:underline"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
            {apps.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-white/40"
                >
                  Müraciət yoxdur
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
