import type { PageSummary } from "@/lib/pages";

export type PageGroup = {
  key: string;
  label: string;
  hint: string;
  prefix: string;
  pages: PageSummary[];
};

export function groupPages(pages: PageSummary[]): PageGroup[] {
  const groups: Record<string, PageGroup> = {
    core: { key: "core", label: "Core pages", hint: "The main pages every visitor sees.", prefix: "", pages: [] },
    services: { key: "services", label: "Services", hint: "Your service money pages.", prefix: "/services/", pages: [] },
    blog: { key: "blog", label: "Blog & Resources", hint: "Posts and downloadable content.", prefix: "/resources/", pages: [] },
    legal: { key: "legal", label: "Legal", hint: "Privacy, terms, and policies.", prefix: "/legal/", pages: [] },
    other: { key: "other", label: "Pages", hint: "Anything else you've created.", prefix: "", pages: [] },
  };

  for (const page of pages) {
    let key = "other";
    if (page.path === "/") key = "core";
    else if (page.path.startsWith("/services/")) key = "services";
    else if (page.path.startsWith("/resources/")) key = "blog";
    else if (page.path.startsWith("/legal/")) key = "legal";
    else if (["/about", "/method", "/work", "/contact"].includes(page.path)) key = "core";
    groups[key].pages.push(page);
  }

  const order = ["core", "services", "blog", "legal", "other"];
  return order
    .map((key) => groups[key])
    .filter((group) => group.pages.length > 0);
}
