"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Stats = {
  news: number;
  publishedNews: number;
  messages: number;
  unreadMessages: number;
  applications: number;
  newApplications: number;
  users: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const cards = [
    {
      label: "Xəbərlər",
      value: stats?.news ?? "—",
      hint: `${stats?.publishedNews ?? 0} aktiv`,
      href: "/admin/news",
    },
    {
      label: "Chat mesajları",
      value: stats?.messages ?? "—",
      hint: `${stats?.unreadMessages ?? 0} oxunmamış`,
      href: "/admin/messages",
    },
    {
      label: "Kredit müraciətləri",
      value: stats?.applications ?? "—",
      hint: `${stats?.newApplications ?? 0} yeni`,
      href: "/admin/applications",
    },
    {
      label: "İstifadəçilər",
      value: stats?.users ?? "—",
      hint: "Super admin",
      href: "/admin/users",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-[14px] text-white/50">
          Sayt idarəetməsi — bütün modullar işləkdir
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-white/8 bg-[#161b26] p-5 transition hover:border-[#1b63ed]/40 hover:bg-[#1a2130]"
          >
            <p className="text-[13px] text-white/50">{c.label}</p>
            <p className="mt-2 text-[32px] font-semibold tracking-tight">
              {c.value}
            </p>
            <p className="mt-1 text-[12px] text-[#8eb4ff]">{c.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-[#161b26] p-5">
          <h2 className="text-[15px] font-semibold">Tez əməliyyatlar</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/admin/news"
              className="rounded-lg bg-[#1b63ed] px-3 py-2 text-[13px] font-medium"
            >
              + Yeni xəbər
            </Link>
            <Link
              href="/admin/messages"
              className="rounded-lg bg-white/8 px-3 py-2 text-[13px]"
            >
              Mesajlara bax
            </Link>
            <Link
              href="/admin/settings"
              className="rounded-lg bg-white/8 px-3 py-2 text-[13px]"
            >
              Ayarlar
            </Link>
            <Link
              href="/az"
              className="rounded-lg border border-white/10 px-3 py-2 text-[13px]"
            >
              Saytı aç
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-[#161b26] p-5">
          <h2 className="text-[15px] font-semibold">Giriş məlumatı</h2>
          <ul className="mt-3 space-y-2 text-[13px] text-white/60">
            <li>
              URL: <span className="text-white">/admin</span>
            </li>
            <li>
              Kullanıcı: <span className="text-white">admin</span>
            </li>
            <li>
              Şifrə: <span className="text-white">admin</span>
            </li>
            <li>Rol: Super Admin — tam icazə</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
