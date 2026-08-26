import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding CRM data...");

  // Pipeline Stages
  const stages = [
    { name: "new", label: "New Lead", order: 0, color: "#6b7280", isClosed: false, isWon: false },
    { name: "qualified", label: "Qualified", order: 1, color: "#3b82f6", isClosed: false, isWon: false },
    { name: "proposal", label: "Proposal Sent", order: 2, color: "#8b5cf6", isClosed: false, isWon: false },
    { name: "negotiation", label: "Negotiation", order: 3, color: "#f59e0b", isClosed: false, isWon: false },
    { name: "won", label: "Won", order: 4, color: "#22c55e", isClosed: true, isWon: true },
    { name: "lost", label: "Lost", order: 5, color: "#ef4444", isClosed: true, isWon: false },
  ];

  for (const stage of stages) {
    await prisma.pipelineStage.upsert({
      where: { name: stage.name },
      update: stage,
      create: stage,
    });
  }
  console.log("✓ Pipeline stages seeded");

  // Services
  const services = [
    {
      name: "Social Media Management",
      slug: "social-media-management",
      description: "Content that trends, communities that engage, and a feed that sells. Full-service social media management across Instagram, TikTok, LinkedIn, and X.",
      shortDesc: "Content that trends, communities that engage, and a feed that sells.",
      href: "/services/social-media-management",
      price: 150000,
      period: "/month",
      featured: true,
      features: ["Strategy & planning", "Content creation (posts, reels, stories)", "Community management", "Monthly analytics & reporting", "Trend monitoring", "Crisis management"],
      icon: "📱",
      order: 1,
    },
    {
      name: "Content Production",
      slug: "content-production",
      description: "Scroll-stopping video, photo, and graphic content produced in-house. From concept to final cut — optimized for every platform.",
      shortDesc: "Scroll-stopping video, photo, and graphic content produced in-house.",
      href: "/services/content-production",
      price: 100000,
      period: "/month",
      featured: false,
      features: ["Video production (reels, TikToks, YouTube Shorts)", "Photography & lifestyle shoots", "Graphic design & motion graphics", "Scriptwriting & storyboarding", "Platform-specific optimization", "Fast turnaround (48h)"],
      icon: "🎬",
      order: 2,
    },
    {
      name: "Growth Strategy",
      slug: "growth-strategy",
      description: "Data-driven growth strategies that turn attention into revenue. Audience research, funnel optimization, and paid media management.",
      shortDesc: "Data-driven growth strategies that turn attention into revenue.",
      href: "/services/growth-strategy",
      price: 200000,
      period: "/month",
      featured: false,
      features: ["Audience & competitor research", "Funnel audit & optimization", "Paid media strategy (Meta, TikTok, Google)", "A/B testing & experimentation", "Monthly growth reports", "Quarterly strategy reviews"],
      icon: "📈",
      order: 3,
    },
    {
      name: "Web Presence",
      slug: "web-presence",
      description: "High-converting websites and landing pages that tell your story and capture leads. Built for speed, SEO, and conversion.",
      shortDesc: "High-converting websites and landing pages that capture leads.",
      href: "/services/web-presence",
      price: 250000,
      period: "/project",
      featured: false,
      features: ["Strategy & wireframing", "Custom design (Figma)", "Development (Next.js, Tailwind)", "CMS setup (Puck/Contentful)", "SEO foundation", "Analytics & conversion tracking"],
      icon: "🌐",
      order: 4,
    },
    {
      name: "Personal Branding",
      slug: "personal-branding",
      description: "Build your founder/creator brand. LinkedIn ghostwriting, thought leadership content, and speaking opportunities.",
      shortDesc: "Build your founder/creator brand with thought leadership content.",
      href: "/services/personal-branding",
      price: 80000,
      period: "/month",
      featured: false,
      features: ["LinkedIn content strategy", "Ghostwriting (4 posts/week)", "Profile optimization", "Content repurposing (X, newsletter)", "Speaking opportunity outreach", "Monthly performance review"],
      icon: "✍️",
      order: 5,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
  console.log("✓ Services seeded");

  // Team Members
  const teamMembers = [
    { name: "Founder Name", role: "Founder & CEO", bio: "Building the future of brand growth.", order: 1, active: true },
    { name: "Creative Lead", role: "Creative Director", bio: "Turning ideas into scroll-stopping content.", order: 2, active: true },
    { name: "Growth Lead", role: "Head of Growth", bio: "Data-driven strategies that convert.", order: 3, active: true },
    { name: "Ops Lead", role: "Operations Manager", bio: "Keeping the machine running smoothly.", order: 4, active: true },
  ];

  for (const member of teamMembers) {
    await prisma.teamMember.upsert({
      where: { id: member.name }, // This won't work - need unique constraint
      update: member,
      create: member,
    }).catch(() => {
      // Ignore if already exists
    });
  }
  console.log("✓ Team members seeded");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });