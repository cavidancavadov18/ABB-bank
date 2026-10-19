import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/api";
import { readStore } from "@/lib/admin/store";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const store = await readStore();
  return NextResponse.json({
    news: store.news.length,
    publishedNews: store.news.filter((n) => n.published).length,
    messages: store.messages.length,
    unreadMessages: store.messages.filter((m) => !m.read && m.role === "user").length,
    applications: store.applications.length,
    newApplications: store.applications.filter((a) => a.status === "new").length,
    users: store.users.length,
  });
}
