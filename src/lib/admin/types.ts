export type AdminRole = "superadmin" | "editor";

export type AdminUser = {
  id: string;
  username: string;
  password: string;
  role: AdminRole;
  name: string;
  createdAt: string;
};

export type AdminNewsItem = {
  id: string;
  date: string;
  titleAz: string;
  titleEn: string;
  excerptAz: string;
  excerptEn: string;
  image: string;
  href: string;
  badge?: string;
  published: boolean;
  updatedAt: string;
};

export type ChatMessage = {
  id: string;
  locale: string;
  role: "user" | "bot";
  text: string;
  sessionId: string;
  createdAt: string;
  read: boolean;
};

export type CreditApplication = {
  id: string;
  phone: string;
  fin: string;
  createdAt: string;
  status: "new" | "reviewed" | "closed";
};

export type SiteSettings = {
  siteName: string;
  chatEnabled: boolean;
  maintenanceMode: boolean;
  supportPhone: string;
  supportEmail: string;
};

export type AdminStore = {
  users: AdminUser[];
  news: AdminNewsItem[];
  messages: ChatMessage[];
  applications: CreditApplication[];
  settings: SiteSettings;
};
