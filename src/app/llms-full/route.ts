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
      "",
      "---",
      "",
      `© ${new Date().getFullYear()} Sociolab. All rights reserved.`,
      "",
      "## Additional Details",
      "",
      "- **Founded:** 2024 (operating remotely since)",
      "- **Team size:** Core growth team of founders + specialized creatives",
      "- **Primary service areas:** Pakistan, Middle East, UK, USA",
      "- **Tech stack:** Next.js 16, React 19, Tailwind v4, Prisma/Postgres, Puck CMS",
      "- **Mission:** Turn attention into WhatsApp conversations and retained customers.",
      "- **Pricing model:** Month-to-month, no long-term lock-in",
      "- **Onboarding:** 30-day structured roadmap with measurable milestones",
    ].join("\n"),
    {
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    }
  );
}
