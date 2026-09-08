import { llms } from "@/lib/llms";

export const revalidate = 3600;

export async function GET() {
  return new Response(
    [
      llms.header,
      "",
      llms.tagline,
      "",
      llms.organization,
      "",
      llms.capabilities,
      "",
      llms.clients,
      "",
      llms.differentiators,
      "",
      llms.process,
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
