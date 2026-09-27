import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth/session";
import { getUserById } from "@/lib/auth/users";

export default async function AuthedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const payload = await verifyToken(token);

  if (!payload || payload.purpose !== "session") {
    redirect("/admin/login");
  }

  const user = await getUserById(payload.sub);
  if (!user) {
    redirect("/admin/login");
  }

  return children;
}
