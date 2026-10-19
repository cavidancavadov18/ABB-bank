import { NextResponse } from "next/server";
import { updateStore } from "@/lib/admin/store";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    phone?: string;
    fin?: string;
  } | null;

  const phone = body?.phone?.trim() || "";
  const fin = body?.fin?.trim().toUpperCase() || "";

  if (phone.length < 9 || fin.length < 5) {
    return NextResponse.json({ error: "Məlumatlar düzgün deyil" }, { status: 400 });
  }

  const app = {
    id: `app-${Date.now()}`,
    phone,
    fin,
    createdAt: new Date().toISOString(),
    status: "new" as const,
  };

  await updateStore((store) => {
    store.applications.unshift(app);
  });

  return NextResponse.json({ ok: true, id: app.id }, { status: 201 });
}
