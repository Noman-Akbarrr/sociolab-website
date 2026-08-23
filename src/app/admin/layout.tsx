export const dynamic = "force-dynamic";

import { AdminHeader } from "./admin-header";

export const metadata = {
  title: "Admin | Sociolab",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mist">
      <AdminHeader />
      {children}
    </div>
  );
}