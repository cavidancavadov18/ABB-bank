import { NextResponse } from "next/server";
import { readStore, updateStore } from "@/lib/admin/store";
import type { ChatMessage } from "@/lib/admin/types";

export async function GET() {
  const store = await readStore();
  return NextResponse.json({
    chatEnabled: store.settings.chatEnabled,
    supportPhone: store.settings.supportPhone,
  });
}

export async function POST(req: Request) {
  const store = await readStore();
  if (!store.settings.chatEnabled) {
    return NextResponse.json({ error: "Chat deaktivdir" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as {
    text?: string;
    locale?: string;
    sessionId?: string;
    role?: "user" | "bot";
  } | null;

  const text = body?.text?.trim() || "";
  if (!text) {
    return NextResponse.json({ error: "Mesaj boşdur" }, { status: 400 });
  }

  const msg: ChatMessage = {
    id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    locale: body?.locale || "az",
    role: body?.role === "bot" ? "bot" : "user",
    text,
    sessionId: body?.sessionId || "anon",
    createdAt: new Date().toISOString(),
    read: body?.role === "bot",
  };

  await updateStore((s) => {
    s.messages.unshift(msg);
    if (s.messages.length > 500) s.messages = s.messages.slice(0, 500);
  });

  return NextResponse.json({ message: msg }, { status: 201 });
}
