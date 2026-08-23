import { llms } from "@/lib/llms";

export const revalidate = 3600;

export async function GET() {
  return new Response(
    [
      llms.header,
      "",
      llms.tagline,
      "",
      llms.whoWeAre,
      "",
      llms.services,
      "",
      llms.contact,
      "",
      llms.links,
      "",
      "---\n",
      "© " + new Date().getFullYear() + " Sociolab. All rights reserved.",
      "",
      "\n## Additional Details",
      "\n- **Founded:** 2024 (operating remotely since)",
      "\n- **Team size:** 5 (core growth team)",
      "\n- **Primary service areas:** Pakistan, Middle East, UK, USA",
      "\n- **Tech stack:** Next.js 16, React 19, Tailwind v4, Prisma/Postgres, Puck CMS",
      "\n- **Mission:** Turn attention into WhatsApp conversations and retained customers.",
    ].join("\n"),
    {
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    }
  );
}