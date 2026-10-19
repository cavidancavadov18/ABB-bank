import { NextResponse } from "next/server";
import { getSessionUser } from "./auth";
import type { AdminUser } from "./types";

export async function requireAdmin(
  roles?: Array<AdminUser["role"]>
): Promise<{ user: AdminUser } | NextResponse> {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (roles && !roles.includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return { user };
}

export function publicUser(user: AdminUser) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
    createdAt: user.createdAt,
  };
}
