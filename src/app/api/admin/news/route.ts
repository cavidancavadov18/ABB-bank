import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/api";
import { readStore, updateStore } from "@/lib/admin/store";
import type { AdminNewsItem } from "@/lib/admin/types";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const store = await readStore();
  return NextResponse.json({ news: store.news });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = (await req.json().catch(() => null)) as Partial<AdminNewsItem> | null;
  if (!body?.titleAz?.trim()) {
    return NextResponse.json({ error: "Başlıq tələb olunur" }, { status: 400 });
  }

  const item: AdminNewsItem = {
    id: `news-${Date.now()}`,
    date:
      body.date?.trim() ||
      new Date().toLocaleDateString("az-AZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    titleAz: body.titleAz.trim(),
    titleEn: (body.titleEn || body.titleAz).trim(),
    excerptAz: body.excerptAz?.trim() || "",
    excerptEn: body.excerptEn?.trim() || "",
    image: body.image?.trim() || "https://cdn.abb-bank.az/usaqyigium1_38169c9ca3.png",
    href: body.href?.trim() || `/xeberler/${Date.now()}`,
    badge: body.badge?.trim() || undefined,
    published: body.published !== false,
    updatedAt: new Date().toISOString(),
  };

  await updateStore((store) => {
    store.news.unshift(item);
  });

  return NextResponse.json({ item }, { status: 201 });
}
