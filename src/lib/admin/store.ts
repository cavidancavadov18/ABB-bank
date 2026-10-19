import { promises as fs } from "fs";
import path from "path";
import { newsItems } from "@/lib/data/news";
import type { AdminNewsItem, AdminStore } from "./types";

const STORE_PATH = path.join(process.cwd(), "data", "admin", "store.json");

function seedNews(): AdminNewsItem[] {
  return newsItems.map((n) => ({
    id: n.id,
    date: n.date,
    titleAz: n.title.az,
    titleEn: n.title.en,
    excerptAz: n.excerpt?.az || "",
    excerptEn: n.excerpt?.en || "",
    image: n.image,
    href: n.href,
    badge: n.badge || undefined,
    published: true,
    updatedAt: new Date().toISOString(),
  }));
}

function defaultStore(): AdminStore {
  return {
    users: [
      {
        id: "u-super",
        username: "admin",
        password: "admin",
        role: "superadmin",
        name: "Super Admin",
        createdAt: new Date().toISOString(),
      },
    ],
    news: seedNews(),
    messages: [],
    applications: [],
    settings: {
      siteName: "ABB",
      chatEnabled: true,
      maintenanceMode: false,
      supportPhone: "937",
      supportEmail: "info@abb-bank.az",
    },
  };
}

async function ensureStore(): Promise<AdminStore> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as AdminStore;
    if (!parsed.users?.length) parsed.users = defaultStore().users;
    if (!parsed.news) parsed.news = seedNews();
    if (!parsed.messages) parsed.messages = [];
    if (!parsed.applications) parsed.applications = [];
    if (!parsed.settings) parsed.settings = defaultStore().settings;
    return parsed;
  } catch {
    const store = defaultStore();
    await writeStore(store);
    return store;
  }
}

export async function readStore(): Promise<AdminStore> {
  return ensureStore();
}

export async function writeStore(store: AdminStore): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function updateStore(
  mutator: (store: AdminStore) => AdminStore | void
): Promise<AdminStore> {
  const store = await readStore();
  const next = mutator(store) || store;
  await writeStore(next);
  return next;
}
