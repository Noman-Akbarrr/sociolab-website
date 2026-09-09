import { listPages } from "@/lib/pages";
import { groupPages } from "@/lib/admin-groups";
import { PagesListClient } from "./pages-list";

export const metadata = {
  title: "Pages | Sociolab Admin",
  robots: { index: false, follow: false },
};

export default async function PagesList() {
  const groups = groupPages(await listPages());

  return <PagesListClient groups={groups} />;
}
