"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AbbMark } from "@/components/icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Giriş alınmadı");
        setLoading(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Şəbəkə xətası");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,#1a2744_0%,#0f141c_55%)] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[400px] rounded-2xl border border-white/10 bg-[#161b26] p-8 shadow-[0_24px_64px_rgba(0,0,0,0.45)]"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1b63ed] text-white shadow-lg shadow-[#1b63ed]/30">
            <AbbMark size={30} className="text-white" />
          </span>
          <h1 className="text-[22px] font-semibold tracking-tight">ABB Admin</h1>
          <p className="mt-1 text-[13px] text-white/50">
            Super user girişi
          </p>
        </div>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-[12px] font-medium text-white/55">
            İstifadəçi adı
          </span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="w-full rounded-xl border border-white/10 bg-[#0f141c] px-3.5 py-3 text-[14px] outline-none transition focus:border-[#1b63ed]"
          />
        </label>

        <label className="mb-5 block">
          <span className="mb-1.5 block text-[12px] font-medium text-white/55">
            Şifrə
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-xl border border-white/10 bg-[#0f141c] px-3.5 py-3 text-[14px] outline-none transition focus:border-[#1b63ed]"
          />
        </label>

        {error && (
          <p className="mb-4 rounded-lg bg-red-500/15 px-3 py-2 text-[13px] text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#1b63ed] py-3 text-[14px] font-medium text-white transition hover:bg-[#1554d4] disabled:opacity-60"
        >
          {loading ? "Giriş…" : "Daxil ol"}
        </button>

        <p className="mt-5 text-center text-[12px] text-white/35">
          Demo: <span className="text-white/55">admin / admin</span>
        </p>
      </form>
    </div>
  );
}
