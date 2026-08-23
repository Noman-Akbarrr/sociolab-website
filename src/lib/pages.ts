import type { Data } from "@puckeditor/core";
import {
  getStoredPage,
  listStoredPages,
  saveStoredPage,
  deleteStoredPage,
} from "@/lib/pages-store";
import { seedPages } from "@/lib/seed-pages";

export type PageSummary = {
  path: string;
  title: string;
  description: string;
  published: boolean;
  updatedAt: string;
};

export async function getPageData(path: string): Promise<Data | null> {
  const stored = await getStoredPage(path);
  if (stored) return stored.data;
  return seedPages[path] ?? null;
}

export async function getPageMeta(path: string): Promise<PageSummary | null> {
  const stored = await getStoredPage(path);
  if (stored) {
    return {
      path: stored.path,
      title: stored.title,
      description: stored.description,
      published: stored.published,
      updatedAt: stored.updatedAt,
    };
  }
  const seed = seedPages[path];
  if (seed) {
    return {
      path,
      title: (seed.root.props as { title?: string }).title ?? "",
      description: (seed.root.props as { description?: string }).description ?? "",
      published: true,
      updatedAt: "",
    };
  }
  return null;
}

export async function listPages(): Promise<PageSummary[]> {
  const stored = await listStoredPages();
  const storedPaths = new Set(stored.map((p) => p.path));

  const seed = Object.keys(seedPages)
    .filter((path) => !storedPaths.has(path))
    .map((path) => ({
      path,
      title: (seedPages[path].root.props as { title?: string }).title ?? path,
      description: (seedPages[path].root.props as { description?: string }).description ?? "",
      published: true,
      updatedAt: "",
    }));

  return [...stored, ...seed].sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
}

export async function savePage(
  path: string,
  title: string,
  description: string,
  data: Data,
): Promise<PageSummary> {
  const saved = await saveStoredPage({ path, title, description, data, published: true });
  return {
    path: saved.path,
    title: saved.title,
    description: saved.description,
    published: saved.published,
    updatedAt: saved.updatedAt,
  };
}

export async function removePage(path: string): Promise<void> {
  const stored = await getStoredPage(path);
  if (stored) {
    await deleteStoredPage(path);
  }
}

export async function listResourcePosts(limit = 4): Promise<PageSummary[]> {
  const pages = await listPages();
  return pages
    .filter((p) => p.path.startsWith("/resources/") && p.published)
    .sort((a, b) => (a.updatedAt || "").localeCompare(b.updatedAt || ""))
    .reverse()
    .slice(0, limit);
}