import { NextResponse } from "next/server";
import { publicUser, requireAdmin } from "@/lib/admin/api";
import { readStore, updateStore } from "@/lib/admin/store";
import type { AdminRole } from "@/lib/admin/types";

export async function GET() {
  const auth = await requireAdmin(["superadmin"]);
  if (auth instanceof NextResponse) return auth;
  const store = await readStore();
  return NextResponse.json({ users: store.users.map(publicUser) });
}

export async function POST(req: Request) {
  const auth = await requireAdmin(["superadmin"]);
  if (auth instanceof NextResponse) return auth;

  const body = (await req.json().catch(() => null)) as {
    username?: string;
    password?: string;
    name?: string;
    role?: AdminRole;
  } | null;

  const username = body?.username?.trim().toLowerCase() || "";
  const password = body?.password || "";
  const name = body?.name?.trim() || username;

  if (!username || password.length < 4) {
    return NextResponse.json(
      { error: "İstifadəçi adı və min. 4 simvollu şifrə tələb olunur" },
      { status: 400 }
    );
  }

  const store = await readStore();
  if (store.users.some((u) => u.username === username)) {
    return NextResponse.json(
      { error: "Bu istifadəçi adı artıq var" },
      { status: 409 }
    );
  }

  const user = {
    id: `u-${Date.now()}`,
    username,
    password,
    role: body?.role === "editor" ? ("editor" as const) : ("superadmin" as const),
    name,
    createdAt: new Date().toISOString(),
  };

  await updateStore((s) => {
    s.users.push(user);
  });

  return NextResponse.json({ user: publicUser(user) }, { status: 201 });
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin(["superadmin"]);
  if (auth instanceof NextResponse) return auth;

  const body = (await req.json().catch(() => null)) as {
    id?: string;
    password?: string;
    name?: string;
    role?: AdminRole;
    delete?: boolean;
  } | null;

  if (!body?.id) {
    return NextResponse.json({ error: "id tələb olunur" }, { status: 400 });
  }

  if (body.delete && body.id === auth.user.id) {
    return NextResponse.json(
      { error: "Öz hesabınızı silə bilməzsiniz" },
      { status: 400 }
    );
  }

  let result = null as ReturnType<typeof publicUser> | null;

  await updateStore((store) => {
    if (body.delete) {
      store.users = store.users.filter((u) => u.id !== body.id);
      return;
    }
    const user = store.users.find((u) => u.id === body.id);
    if (!user) return;
    if (body.password && body.password.length >= 4) user.password = body.password;
    if (body.name?.trim()) user.name = body.name.trim();
    if (body.role) user.role = body.role;
    result = publicUser(user);
  });

  if (body.delete) return NextResponse.json({ ok: true });
  if (!result) return NextResponse.json({ error: "Tapılmadı" }, { status: 404 });
  return NextResponse.json({ user: result });
}
