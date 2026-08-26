import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { ActivityClient } from "@/components/admin/crm/ActivityClient";

export const metadata = {
  title: "Activity | Sociolab CRM",
  robots: { index: false, follow: false },
};

async function getActivityData(searchParams: URLSearchParams) {
  const res = await fetch(`/admin/api/crm/activities?${searchParams}`);
  return res.json();
}

export default async function ActivityPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams(resolvedSearchParams as any);
  const data = await getActivityData(params);

  return (
    <ActivityClient
      initialActivities={data.activities}
      initialTotal={data.total}
      initialPage={data.page}
      initialTotalPages={data.totalPages}
    />
  );
}