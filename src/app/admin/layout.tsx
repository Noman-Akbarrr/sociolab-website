export const dynamic = "force-dynamic";

import { getServerUser } from "@/lib/auth/current";
import AdminLayoutClient from "@/components/admin/admin-layout";

export const metadata = {
  title: "Admin | Sociolab",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-mist">
        {children}
      </div>
    );
  }

  return (
    <AdminLayoutClient userName={user.name}>
      {children}
    </AdminLayoutClient>
  );
}
