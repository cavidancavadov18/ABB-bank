"use client";

import { useCallback, useEffect, useState } from "react";

type Msg = {
  id: string;
  locale: string;
  role: "user" | "bot";
  text: string;
  sessionId: string;
  createdAt: string;
  read: boolean;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Msg[]>([]);

  const load = useCallback(() => {
    fetch("/api/admin/messages")
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .catch(() => setMessages([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const mark = async (ids: string[], read: boolean) => {
    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, read }),
    });
    load();
  };

  const remove = async (ids: string[]) => {
    if (!confirm("Silinsin?")) return;
    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, delete: true }),
    });
    load();
  };

  const unread = messages.filter((m) => !m.read && m.role === "user");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-semibold">Chat mesajları</h1>
          <p className="mt-1 text-[14px] text-white/50">
            Sayt chat-indən gələn mesajlar
          </p>
        </div>
        <div className="flex gap-2">
          {unread.length > 0 && (
            <button
              type="button"
              onClick={() => mark(
                unread.map((m) => m.id),
                true
              )}
              className="rounded-xl bg-[#1b63ed] px-3 py-2 text-[13px]"
            >
              Hamısını oxu ({unread.length})
            </button>
          )}
          <button
            type="button"
            onClick={load}
            className="rounded-xl bg-white/8 px-3 py-2 text-[13px]"
          >
            Yenilə
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-xl border px-4 py-3 ${
              !m.read && m.role === "user"
                ? "border-[#1b63ed]/40 bg-[#1b63ed]/10"
                : "border-white/8 bg-[#161b26]"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[12px] text-white/45">
                <span
                  className={
                    m.role === "user" ? "text-[#8eb4ff]" : "text-emerald-300"
                  }
                >
                  {m.role === "user" ? "İstifadəçi" : "Bot"}
                </span>
                <span>·</span>
                <span>{m.locale.toUpperCase()}</span>
                <span>·</span>
                <span>{new Date(m.createdAt).toLocaleString("az-AZ")}</span>
                <span>·</span>
                <span className="truncate">{m.sessionId}</span>
              </div>
              <div className="flex gap-2">
                {m.role === "user" && (
                  <button
                    type="button"
                    onClick={() => mark([m.id], !m.read)}
                    className="text-[12px] text-[#8eb4ff] hover:underline"
                  >
                    {m.read ? "Oxunmamış et" : "Oxundu"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove([m.id])}
                  className="text-[12px] text-red-300 hover:underline"
                >
                  Sil
                </button>
              </div>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed">{m.text}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 px-4 py-12 text-center text-[14px] text-white/40">
            Hələ mesaj yoxdur. Saytdakı chat-dən yazın.
          </div>
        )}
      </div>
    </div>
  );
}
