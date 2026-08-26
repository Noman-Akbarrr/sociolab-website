import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { TicketsClient } from "@/components/admin/crm/TicketsClient";

export const metadata = {
  title: "Tickets | Sociolab CRM",
  robots: { index: false, follow: false },
};

async function getTicketsData(searchParams: URLSearchParams) {
  const res = await fetch(`/admin/api/crm/tickets?${searchParams}`);
  return res.json();
}

export default async function TicketsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams(resolvedSearchParams as any);
  const data = await getTicketsData(params);

  return (
    <TicketsClient
      initialTickets={data.tickets}
      initialTotal={data.total}
      initialPage={data.page}
      initialTotalPages={data.totalPages}
      initialStatus={params.get("status") || ""}
    />
  );
}