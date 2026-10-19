"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type NewsItem = {
  id: string;
  date: string;
  titleAz: string;
  titleEn: string;
  excerptAz: string;
  excerptEn: string;
  image: string;
  href: string;
  badge?: string;
  published: boolean;
};

const empty: Omit<NewsItem, "id"> = {
  date: "",
  titleAz: "",
  titleEn: "",
  excerptAz: "",
  excerptEn: "",
  image: "",
  href: "",
  badge: "",
  published: true,
};

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    fetch("/api/admin/news")
      .then((r) => r.json())
      .then((d) => setNews(d.news || []))
      .catch(() => setNews([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const reset = () => {
    setForm(empty);
    setEditId(null);
    setError("");
  };

  const startEdit = (item: NewsItem) => {
    setEditId(item.id);
    setForm({
      date: item.date,
      titleAz: item.titleAz,
      titleEn: item.titleEn,
      excerptAz: item.excerptAz,
      excerptEn: item.excerptEn,
      image: item.image,
      href: item.href,
      badge: item.badge || "",
      published: item.published,
    });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editId ? `/api/admin/news/${editId}` : "/api/admin/news";
      const res = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Xəta");
        setSaving(false);
        return;
      }
      reset();
      load();
    } catch {
      setError("Şəbəkə xətası");
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Bu xəbəri silmək istəyirsiniz?")) return;
    await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
    load();
  };

  const togglePublish = async (item: NewsItem) => {
    await fetch(`/api/admin/news/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !item.published }),
    });
    load();
  };

  const field = (
    key: keyof typeof empty,
    label: string,
    opts?: { textarea?: boolean }
  ) => (
    <label className="block">
      <span className="mb-1 block text-[12px] text-white/50">{label}</span>
      {opts?.textarea ? (
        <textarea
          value={String(form[key] ?? "")}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          rows={2}
          className="admin-input w-full resize-y"
        />
      ) : (
        <input
          value={String(form[key] ?? "")}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              [key]: key === "published" ? e.target.value : e.target.value,
            }))
          }
          className="admin-input w-full"
        />
      )}
    </label>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-semibold">Xəbərlər</h1>
          <p className="mt-1 text-[14px] text-white/50">
            Əlavə et, redaktə et, dərc et / gizlət, sil
          </p>
        </div>
        <span className="text-[13px] text-white/40">{news.length} xəbər</span>
      </div>

      <form
        onSubmit={onSubmit}
        className="mb-6 grid gap-3 rounded-2xl border border-white/8 bg-[#161b26] p-5 md:grid-cols-2"
      >
        <p className="md:col-span-2 text-[14px] font-medium">
          {editId ? "Xəbəri redaktə et" : "Yeni xəbər"}
        </p>
        {field("titleAz", "Başlıq (AZ) *")}
        {field("titleEn", "Başlıq (EN)")}
        {field("excerptAz", "Qısa mətn (AZ)", { textarea: true })}
        {field("excerptEn", "Qısa mətn (EN)", { textarea: true })}
        {field("date", "Tarix (məs. 19.10.2026)")}
        {field("badge", "Badge")}
        {field("image", "Şəkil URL")}
        {field("href", "Link (href)")}
        <label className="flex items-center gap-2 text-[13px] text-white/70 md:col-span-2">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) =>
              setForm((f) => ({ ...f, published: e.target.checked }))
            }
          />
          Dərc olunub (saytda görünsün)
        </label>
        {error && (
          <p className="md:col-span-2 text-[13px] text-red-300">{error}</p>
        )}
        <div className="flex gap-2 md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#1b63ed] px-4 py-2.5 text-[13px] font-medium disabled:opacity-60"
          >
            {saving ? "Saxlanır…" : editId ? "Yadda saxla" : "Əlavə et"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={reset}
              className="rounded-xl bg-white/8 px-4 py-2.5 text-[13px]"
            >
              Ləğv et
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#161b26]">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-white/8 text-white/45">
            <tr>
              <th className="px-4 py-3 font-medium">Başlıq</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">
                Tarix
              </th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item.id} className="border-b border-white/5">
                <td className="max-w-[280px] truncate px-4 py-3">
                  {item.titleAz}
                </td>
                <td className="hidden px-4 py-3 text-white/50 md:table-cell">
                  {item.date}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => togglePublish(item)}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] ${
                      item.published
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-white/8 text-white/45"
                    }`}
                  >
                    {item.published ? "Aktiv" : "Gizli"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="text-[#8eb4ff] hover:underline"
                    >
                      Redaktə
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="text-red-300 hover:underline"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {news.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-white/40">
                  Xəbər yoxdur
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
