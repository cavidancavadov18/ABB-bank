import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ABB Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root min-h-screen bg-[#0f141c] font-sans text-[#e8ecf4] antialiased">
      {children}
    </div>
  );
}
