import { NextResponse } from "next/server";
import { readStore } from "@/lib/admin/store";

export async function GET() {
  const store = await readStore();
  const news = store.news
    .filter((n) => n.published)
    .map((n) => ({
      id: n.id,
      date: n.date,
      title: { az: n.titleAz, en: n.titleEn },
      excerpt: { az: n.excerptAz, en: n.excerptEn },
      image: n.image,
      href: n.href,
      badge: n.badge || null,
    }));
  return NextResponse.json({ news });
}
