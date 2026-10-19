import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { readStore } from "./store";
import type { AdminUser } from "./types";

const COOKIE = "abb_admin_session";
const SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  (process.env.NODE_ENV === "production"
    ? (() => {
        console.warn(
          "[admin] ADMIN_SESSION_SECRET is not set — using insecure demo secret. Set it in production."
        );
        return "abb-admin-demo-secret-CHANGE-ME";
      })()
    : "abb-admin-demo-secret-2026");
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function toBase64Url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function sign(payload: string): string {
  return toBase64Url(createHmac("sha256", SECRET).update(payload).digest());
}

export function createSessionToken(userId: string, username: string): string {
  const exp = Date.now() + MAX_AGE * 1000;
  const body = toBase64Url(
    Buffer.from(JSON.stringify({ userId, username, exp }), "utf8")
  );
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(
  token: string | undefined
): { userId: string; username: string } | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const json = Buffer.from(
      body.replace(/-/g, "+").replace(/_/g, "/") +
        "=".repeat((4 - (body.length % 4)) % 4),
      "base64"
    ).toString("utf8");
    const data = JSON.parse(json) as {
      userId: string;
      username: string;
      exp: number;
    };
    if (!data.exp || data.exp < Date.now()) return null;
    return { userId: data.userId, username: data.username };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<AdminUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  const session = verifySessionToken(token);
  if (!session) return null;
  const store = await readStore();
  return store.users.find((u) => u.id === session.userId) || null;
}

export function sessionCookieOptions(token: string) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  };
}

export { COOKIE };
