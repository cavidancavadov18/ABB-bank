import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/api";
import { readStore, updateStore } from "@/lib/admin/store";
import type { SiteSettings } from "@/lib/admin/types";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const store = await readStore();
  return NextResponse.json({ settings: store.settings });
}

export async function PUT(req: Request) {
  const auth = await requireAdmin(["superadmin"]);
  if (auth instanceof NextResponse) return auth;

  const body = (await req.json().catch(() => null)) as Partial<SiteSettings> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  let settings: SiteSettings | null = null;
  await updateStore((store) => {
    store.settings = { ...store.settings, ...body };
    settings = store.settings;
  });

  return NextResponse.json({ settings });
}
