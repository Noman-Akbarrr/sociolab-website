import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";
import { ActivityClient } from "@/components/admin/crm/ActivityClient";

export const metadata = {
  title: "Activity | Sociolab CRM",
  robots: { index: false, follow: false },
};

export default async function ActivityPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams(resolvedSearchParams as any);

  const page = parseInt(params.get("page") || "1");
  const limit = 50;

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      include: {
        user: { select: { id: true, name: true } },
        deal: { select: { id: true, title: true } },
        company: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.activity.count(),
  ]);

  return (
    <ActivityClient
      initialActivities={activities}
      initialTotal={total}
      initialPage={page}
      initialTotalPages={Math.ceil(total / limit)}
    />
  );
}
