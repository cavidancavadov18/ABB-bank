import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/api";
import { readStore, updateStore } from "@/lib/admin/store";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const store = await readStore();
  return NextResponse.json({
    messages: [...store.messages].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    ),
  });
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = (await req.json().catch(() => null)) as {
    ids?: string[];
    read?: boolean;
    delete?: boolean;
  } | null;

  if (!body?.ids?.length) {
    return NextResponse.json({ error: "ids tələb olunur" }, { status: 400 });
  }

  await updateStore((store) => {
    if (body.delete) {
      store.messages = store.messages.filter((m) => !body.ids!.includes(m.id));
      return;
    }
    for (const m of store.messages) {
      if (body.ids!.includes(m.id) && typeof body.read === "boolean") {
        m.read = body.read;
      }
    }
  });

  return NextResponse.json({ ok: true });
}
