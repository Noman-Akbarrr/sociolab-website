import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/lib/espocrm";
import { NewDashClient } from "./client";

export const metadata = {
  title: "Dashboard | Sociolab",
  robots: { index: false, follow: false },
};

export default async function NewAdminDash() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("espo_auth");

  if (!auth) {
    redirect("/newadmindash/login");
  }

  let stats = null;
  let error = null;

  try {
    stats = await getDashboardStats();
  } catch (e: any) {
    error = e.message || "Failed to connect to EspoCRM";
  }

  return <NewDashClient stats={stats} error={error} />;
}
