export const dynamic = "force-dynamic";

import { getServerUser } from "@/lib/auth/current";
import Sidebar from "@/components/admin/sidebar";
import TopBar from "@/components/admin/top-bar";

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
    <div className="min-h-screen bg-mist">
      <Sidebar />
      <div className="ml-64">
        <TopBar userName={user.name} />
        <main>{children}</main>
      </div>
    </div>
  );
}
