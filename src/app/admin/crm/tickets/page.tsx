import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";
import { TicketsClient } from "@/components/admin/crm/TicketsClient";

export const metadata = {
  title: "Tickets | Sociolab CRM",
  robots: { index: false, follow: false },
};

export default async function TicketsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams(resolvedSearchParams as any);

  const status = params.get("status") || "";
  const search = params.get("search") || "";
  const page = parseInt(params.get("page") || "1");
  const limit = 20;

  const where: any = {};
  if (status) where.status = status;
  if (search) {
    const q = search.toLowerCase();
    where.OR = [{ subject: { contains: q, mode: "insensitive" } }];
  }

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({ where, include: { company: true, assignee: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    prisma.ticket.count({ where }),
  ]);

  return (
    <TicketsClient
      initialTickets={tickets}
      initialTotal={total}
      initialPage={page}
      initialTotalPages={Math.ceil(total / limit)}
      initialStatus={status}
    />
  );
}
