import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerUser } from "@/lib/auth/current";
import { listPages } from "@/lib/pages";
import { NewPostForm } from "./new-post";

export const metadata = {
  title: "Blog | Sociolab Admin",
  robots: { index: false, follow: false },
};

export default async function BlogAdmin() {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const posts = (await listPages()).filter((page) => page.path.startsWith("/resources/"));

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Blog
        </h1>
        <p className="text-sm text-ink/60">
          Posts live at /resources/… and are fully editable in the same visual editor.
        </p>
      </div>

      <div className="mt-8 max-w-2xl">
        <NewPostForm />
      </div>

      <div className="mt-10 flex flex-col gap-4">
        {posts.length === 0 ? (
          <p className="rounded-[3px] border border-dashed border-line p-8 text-center text-sm text-ink/50">
            No posts yet. Create your first one above.
          </p>
        ) : null}
        {posts.map((post) => (
          <Link
            key={post.path}
            href={`/admin/edit${post.path}`}
            className="group flex items-center justify-between gap-4 rounded-[3px] border border-line bg-white px-5 py-4 transition-colors hover:border-brand"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
                {post.path.replace("/resources/", "")}
              </span>
              <span className="truncate font-display text-base font-semibold text-ink group-hover:text-brand">
                {post.title || "Untitled post"}
              </span>
            </div>
            <span className="shrink-0 text-xs text-ink/50">
              {post.updatedAt
                ? `Edited ${new Date(post.updatedAt).toLocaleDateString()}`
                : "Not edited yet"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}