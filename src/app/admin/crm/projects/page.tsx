import { redirect } from "next/navigation";

export default async function OldProjectsPage() {
  redirect("/admin/projects");
}
