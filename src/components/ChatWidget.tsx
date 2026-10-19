"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";
import { AbbMark } from "./icons";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

type Msg = { id: string; role: "user" | "bot"; text: string };

function replyFor(text: string, dict: Dictionary): string {
  const q = text.toLowerCase();
  if (/937|zəng|call|telefon|phone|əlaqə|contact/.test(q)) return dict.chat.botReplyPhone;
  if (/filial|atm|şəbək|branch|network|xidmət/.test(q)) return dict.chat.botReplyBranch;
  if (/kart|card|debet|kredit kart|visa|master/.test(q)) return dict.chat.botReplyCards;
  if (/kredit|loan|nağd|cash/.test(q)) return dict.chat.botReplyLoan;
  if (/əmanət|deposit|depozit|digideposit/.test(q)) return dict.chat.botReplyDeposit;
  return dict.chat.botReplyDefault;
}

function sessionId() {
  if (typeof window === "undefined") return "ssr";
  const key = "abb-chat-session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

async function persistChat(
  text: string,
  role: "user" | "bot",
  locale: Locale
) {
  try {
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, role, locale, sessionId: sessionId() }),
    });
  } catch {
    /* ignore offline */
  }
}

export function ChatWidget({ locale, dict }: Props) {
  const [open, setOpen] = useState(false);
  const [chatting, setChatting] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [enabled, setEnabled] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((d) => setEnabled(d.chatEnabled !== false))
      .catch(() => setEnabled(true));
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typing, chatting]);

  useEffect(() => {
    if (open && chatting) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 120);
      return () => window.clearTimeout(t);
    }
  }, [open, chatting]);

  const startChat = () => {
    setChatting(true);
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "bot",
          text: `${dict.chat.greeting} ${dict.chat.welcome}`,
        },
      ]);
    }
  };

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    setChatting(true);
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    void persistChat(text, "user", locale);
    window.setTimeout(() => {
      const reply = replyFor(text, dict);
      const botMsg: Msg = {
        id: `b-${Date.now()}`,
        role: "bot",
        text: reply,
      };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
      void persistChat(reply, "bot", locale);
    }, 650 + Math.random() * 400);
  };

  const close = () => {
    setOpen(false);
  };

  if (!enabled) return null;

  return (
    <div className="chat-widget" data-open={open ? "true" : "false"}>
      {open && (
        <div
          className="chat-panel"
          role="dialog"
          aria-label={dict.chat.askTitle}
          aria-modal="false"
        >
          <div className="chat-panel-top">
            <AbbMark size={28} className="text-white" />
            <button
              type="button"
              className="chat-icon-btn"
              aria-label={dict.chat.close}
              onClick={close}
            >
              <CloseX />
            </button>
          </div>

          {!chatting ? (
            <div className="chat-home">
              <h2 className="chat-greeting">
                {dict.chat.greeting}
                <br />
                {dict.chat.welcome}
              </h2>
              <button type="button" className="chat-ask-card" onClick={startChat}>
                <span className="min-w-0 text-left">
                  <span className="block text-[16px] font-semibold text-white">
                    {dict.chat.askTitle}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-white/75">
                    {dict.chat.askHint}
                  </span>
                </span>
                <span className="chat-ask-icon" aria-hidden>
                  <ChatBubbleIcon />
                </span>
              </button>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {dict.chat.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="rounded-full bg-white/12 px-3 py-1.5 text-[12px] font-medium text-white transition hover:bg-white/20"
                    onClick={() => send(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between gap-2 text-[12px] text-white/70">
                <a href="tel:937" className="hover:text-white">
                  937
                </a>
                <Link
                  href={`/${locale}/filiallar`}
                  className="hover:text-white"
                  onClick={close}
                >
                  {locale === "az" ? "Filiallar" : "Branches"}
                </Link>
              </div>
            </div>
          ) : (
            <div className="chat-thread">
              <div ref={listRef} className="chat-messages">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`chat-bubble ${m.role === "user" ? "is-user" : "is-bot"}`}
                  >
                    {m.text}
                  </div>
                ))}
                {typing && (
                  <div className="chat-bubble is-bot is-typing">{dict.chat.typing}</div>
                )}
              </div>
              <form
                className="chat-composer"
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={dict.chat.placeholder}
                  className="chat-input"
                  aria-label={dict.chat.placeholder}
                />
                <button
                  type="submit"
                  className="chat-send"
                  aria-label={dict.chat.send}
                  disabled={!input.trim() || typing}
                >
                  <SendIcon />
                </button>
              </form>
            </div>
          )}

          <button
            type="button"
            className="chat-minimize"
            aria-label={dict.chat.minimize}
            onClick={close}
          >
            <ChevronDownMini />
          </button>
        </div>
      )}

      <button
        type="button"
        className="chat-fab"
        aria-label={open ? dict.chat.close : dict.chat.open}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <ChevronDownMini className="h-5 w-5 text-white" />
        ) : (
          <AbbMark size={26} className="text-white" />
        )}
      </button>
    </div>
  );
}

function CloseX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownMini({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatBubbleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 6.5A2.5 2.5 0 017.5 4h9A2.5 2.5 0 0119 6.5v7A2.5 2.5 0 0116.5 16H10l-3.8 2.8A.8.8 0 015 18.2V6.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12l16-7-7 16-2.2-6.8L4 12z"
        fill="currentColor"
      />
    </svg>
  );
}
