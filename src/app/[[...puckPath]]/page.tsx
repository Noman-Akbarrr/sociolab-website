import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Data } from "@puckeditor/core";
import { getPageData, listPages } from "@/lib/pages";
import { PuckRenderClient } from "./client";
import { JsonLd } from "@/components/json-ld";

// Pages are statically cached and regenerated on publish (see /admin/api/page).
export const revalidate = 60;

export async function generateStaticParams() {
  const pages = await listPages();
  return pages.map((page) => {
    const segments = page.path.split("/").filter(Boolean);
    return { puckPath: segments };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ puckPath?: string[] }>;
}): Promise<Metadata> {
  const { puckPath = [] } = await params;
  const path = `/${puckPath.join("/")}`;
  const data = await getPageData(path);
  if (!data) return {};

  const props = data.root.props as { title?: string; description?: string };
  const isLegal = path.startsWith("/legal");

  return {
    title: props.title || "Sociolab",
    description: props.description,
    robots: isLegal ? { index: false, follow: false } : undefined,
  };
}

export default async function PuckPage({
  params,
}: {
  params: Promise<{ puckPath?: string[] }>;
}) {
  const { puckPath = [] } = await params;
  const path = `/${puckPath.join("/")}`;
  const data = await getPageData(path);

  if (!data) {
    notFound();
  }

  return (
    <>
      <PuckRenderClient data={data as Data} />
      <JsonLd puckPath={puckPath} />
    </>
  );
}