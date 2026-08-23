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
    ].join("\n"),
    {
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    }
  );
}