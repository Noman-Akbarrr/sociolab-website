import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "CRM Dashboard | Sociolab",
  robots: { index: false, follow: false },
};

export default async function NewDashLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("newadmindash_session");

  if (!session) {
    redirect("/newadmindash/login");
  }

  return children;
}
