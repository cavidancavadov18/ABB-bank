import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/api";
import { readStore, updateStore } from "@/lib/admin/store";
import type { CreditApplication } from "@/lib/admin/types";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const store = await readStore();
  return NextResponse.json({
    applications: [...store.applications].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    ),
  });
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = (await req.json().catch(() => null)) as {
    id?: string;
    status?: CreditApplication["status"];
    delete?: boolean;
  } | null;

  if (!body?.id) {
    return NextResponse.json({ error: "id tələb olunur" }, { status: 400 });
  }

  await updateStore((store) => {
    if (body.delete) {
      store.applications = store.applications.filter((a) => a.id !== body.id);
      return;
    }
    const app = store.applications.find((a) => a.id === body.id);
    if (app && body.status) app.status = body.status;
  });

  return NextResponse.json({ ok: true });
}
