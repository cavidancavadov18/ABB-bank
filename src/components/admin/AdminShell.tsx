"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AbbMark } from "@/components/icons";

type User = {
  id: string;
  username: string;
  role: string;
  name: string;
};

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/news", label: "Xəbərlər", icon: "☰" },
  { href: "/admin/messages", label: "Chat mesajları", icon: "💬" },
  { href: "/admin/applications", label: "Müraciətlər", icon: "📋" },
  { href: "/admin/users", label: "İstifadəçilər", icon: "👤" },
  { href: "/admin/settings", label: "Ayarlar", icon: "⚙" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.user || null))
      .catch(() => setUser(null));
  }, []);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="admin-shell flex min-h-screen">
      <aside className="admin-sidebar flex w-[240px] shrink-0 flex-col border-r border-white/8 bg-[#121821]">
        <div className="flex items-center gap-2.5 border-b border-white/8 px-5 py-5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1b63ed] text-white">
            <AbbMark size={20} className="text-white" />
          </span>
          <div>
            <p className="text-[15px] font-semibold tracking-tight">ABB Admin</p>
            <p className="text-[11px] text-white/45">Super panel</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] transition ${
                  active
                    ? "bg-[#1b63ed] text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="w-5 text-center text-[13px] opacity-80">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/8 p-4">
          <div className="mb-3 px-1">
            <p className="truncate text-[13px] font-medium">
              {user?.name || "…"}
            </p>
            <p className="truncate text-[11px] text-white/45">
              @{user?.username} · {user?.role}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/az"
              className="flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[12px] text-white/70 hover:bg-white/5"
            >
              Sayt
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex-1 rounded-lg bg-white/8 px-2 py-2 text-[12px] text-white/80 hover:bg-white/12"
            >
              Çıxış
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-14 items-center justify-between border-b border-white/8 bg-[#121821]/80 px-6 backdrop-blur">
          <p className="text-[13px] text-white/50">
            {pathname === "/admin" ? "Dashboard" : pathname.replace("/admin/", "")}
          </p>
          <span className="rounded-full bg-[#1b63ed]/20 px-3 py-1 text-[11px] font-medium text-[#8eb4ff]">
            admin / admin
          </span>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
