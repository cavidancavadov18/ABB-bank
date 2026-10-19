import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/admin/auth";
import { publicUser } from "@/lib/admin/api";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user: publicUser(user) });
}
