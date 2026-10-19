import { NextResponse } from "next/server";
import {
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/admin/auth";
import { publicUser } from "@/lib/admin/api";
import { readStore } from "@/lib/admin/store";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    username?: string;
    password?: string;
  } | null;

  const username = body?.username?.trim() || "";
  const password = body?.password || "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "İstifadəçi adı və şifrə tələb olunur" },
      { status: 400 }
    );
  }

  const store = await readStore();
  const user = store.users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return NextResponse.json(
      { error: "Yanlış istifadəçi adı və ya şifrə" },
      { status: 401 }
    );
  }

  const token = createSessionToken(user.id, user.username);
  const res = NextResponse.json({ user: publicUser(user) });
  const cookie = sessionCookieOptions(token);
  res.cookies.set(cookie.name, cookie.value, cookie);
  return res;
}
