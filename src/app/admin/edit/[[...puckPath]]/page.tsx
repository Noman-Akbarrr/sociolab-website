import { getServerUser } from "@/lib/auth/current";
import { getPageData } from "@/lib/pages";
import { PuckEditor } from "./editor";
import type { Data } from "@puckeditor/core";

export const metadata = {
  title: "Editor | Sociolab",
  robots: { index: false, follow: false },
};

const EMPTY_DATA = {
  root: { props: { title: "", description: "" } },
  content: [],
};

function withIds(data: Data): Data {
  let counter = 0;
  const nextId = () => `block-${Date.now().toString(36)}-${counter++}`;

  const walk = (item: any): any => {
    if (!item || typeof item !== "object") return item;
    const props = { ...(item.props ?? {}) };
    if (typeof props.id !== "string") props.id = nextId();
    return { ...item, props, zones: walkZones(item.zones) };
  };

  const walkZones = (zones: any): any => {
    if (!zones || typeof zones !== "object") return zones;
    return Object.fromEntries(
      Object.entries(zones).map(([key, items]) => [key, (items as any[]).map(walk)]),
    );
  };

  return { root: data.root, content: (data.content ?? []).map(walk) };
}

export default async function EditPage({
  params,
}: {
  params: Promise<{ puckPath?: string[] }>;
}) {
  const user = await getServerUser();
  const { puckPath = [] } = await params;
  const path = `/${puckPath.join("/")}`;

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="font-display text-xl font-semibold text-ink">Not signed in.</p>
        <a href="/admin/login" className="mt-3 inline-block text-sm font-semibold text-brand">
          Go to login
        </a>
      </div>
    );
  }

  const data = withIds((await getPageData(path)) ?? EMPTY_DATA);

  return <PuckEditor path={path} initialData={data} />;
}