import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/api";
import { updateStore } from "@/lib/admin/store";
import type { AdminNewsItem } from "@/lib/admin/types";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  const body = (await req.json().catch(() => null)) as Partial<AdminNewsItem> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  let updated: AdminNewsItem | null = null;
  await updateStore((store) => {
    const idx = store.news.findIndex((n) => n.id === id);
    if (idx < 0) return;
    updated = {
      ...store.news[idx],
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };
    store.news[idx] = updated;
  });

  if (!updated) {
    return NextResponse.json({ error: "Tapılmadı" }, { status: 404 });
  }
  return NextResponse.json({ item: updated });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  let removed = false;
  await updateStore((store) => {
    const before = store.news.length;
    store.news = store.news.filter((n) => n.id !== id);
    removed = store.news.length < before;
  });

  if (!removed) {
    return NextResponse.json({ error: "Tapılmadı" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
