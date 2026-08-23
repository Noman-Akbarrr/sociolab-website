import type { Data } from "@puckeditor/core";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

export type StoredPage = {
  path: string;
  title: string;
  description: string;
  data: Data;
  published: boolean;
  updatedAt: string;
};

const DB_FILE = path.join(process.cwd(), ".puck", "db.json");

type FileDb = {
  pages: Record<string, Omit<StoredPage, "path">>;
};

function readFileDb(): FileDb {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, "utf-8")) as FileDb;
    }
  } catch {
    // corrupt file — start fresh
  }
  return { pages: {} };
}

function writeFileDb(db: FileDb) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

function usesDb() {
  return Boolean(process.env.DATABASE_URL);
}

export async function getStoredPage(path: string): Promise<StoredPage | null> {
  if (usesDb()) {
    const page = await prisma.page.findUnique({ where: { path } });
    if (!page) return null;
    return {
      path: page.path,
      title: page.title,
      description: page.description,
      data: page.data as Data,
      published: page.published,
      updatedAt: page.updatedAt.toISOString(),
    };
  }
  const db = readFileDb();
  const page = db.pages[path];
  if (!page) return null;
  return { path, ...page };
}

export async function listStoredPages(): Promise<StoredPage[]> {
  if (usesDb()) {
    const pages = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } });
    return pages.map((page) => ({
      path: page.path,
      title: page.title,
      description: page.description,
      data: page.data as Data,
      published: page.published,
      updatedAt: page.updatedAt.toISOString(),
    }));
  }
  const db = readFileDb();
  return Object.entries(db.pages)
    .map(([path, page]) => ({ path, ...page }))
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function saveStoredPage(page: {
  path: string;
  title: string;
  description: string;
  data: Data;
  published?: boolean;
}): Promise<StoredPage> {
  const updatedAt = new Date().toISOString();
  if (usesDb()) {
    await prisma.page.upsert({
      where: { path: page.path },
      update: {
        title: page.title,
        description: page.description,
        data: page.data,
        published: page.published ?? true,
      },
      create: {
        path: page.path,
        title: page.title,
        description: page.description,
        data: page.data,
        published: page.published ?? true,
      },
    });
    return { ...page, published: page.published ?? true, updatedAt };
  }
  const db = readFileDb();
  db.pages[page.path] = {
    title: page.title,
    description: page.description,
    data: page.data,
    published: page.published ?? true,
    updatedAt,
  };
  writeFileDb(db);
  return { ...page, published: page.published ?? true, updatedAt };
}

export async function deleteStoredPage(path: string): Promise<void> {
  if (usesDb()) {
    await prisma.page.delete({ where: { path } });
    return;
  }
  const db = readFileDb();
  delete db.pages[path];
  writeFileDb(db);
}