export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  category: "ecommerce" | "automotive" | "b2b";
  metric: string;
  metricLabel: string;
  summary: string;
  challenge: string;
  baseline: string;
  strategy: string[];
  creatives: string[];
  results: { label: string; value: string }[];
  lessons: string[];
  nextSteps: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "exact-fashion-store",
    client: "Exact Fashion Store",
    industry: "Apparel & Retail",
    category: "ecommerce",
    metric: "314",
    metricLabel: "WhatsApp Chats @ PKR 22.79",
    summary:
      "Deployed a dynamic creative testing matrix for their Independence Day collection, generating 314 high-intent buyer conversations at a verified PKR 22.79 per chat.",
    challenge:
      "The client needed an immediate influx of ready-to-buy customers for their seasonal collection without inflating acquisition costs. Previous campaigns relied on generic traffic campaigns with no post-click optimization.",
    baseline:
      "No prior Meta Ads infrastructure. Zero Conversion API setup. WhatsApp response times averaging 4+ hours, causing lead drop-offs.",
    strategy: [
      "Deployed server-side Meta Conversion API (CAPI) to restore signal loss from iOS tracking changes.",
      "Built a dynamic creative testing (DCT) matrix pairing multi-outfit catalog carousels with product-focused short-form video hooks.",
      "Implemented full-funnel retargeting: View Content → Add to Cart → Initiate Checkout → WhatsApp Chat.",
      "Designed structured sales triage protocols to reduce WhatsApp response time from 4+ hours to under 30 minutes.",
    ],
    creatives: [
      "Multi-outfit catalog carousels (8-product grid layout)",
      "Product-focused Reels with problem-solution hooks",
      "Lifestyle UGC-style videos with creator casting",
      "Static story ads with urgency-driven copy",
    ],
    results: [
      { label: "Verified WhatsApp Chats", value: "314" },
      { label: "Cost Per Inquiring Customer", value: "PKR 22.79" },
      { label: "Cost Per Link Click", value: "PKR 12.67" },
      { label: "Targeted Impressions", value: "30,772" },
      { label: "Total Ad Spend", value: "PKR 7,157" },
      { label: "Click-Through Rate", value: "4.2%" },
    ],
    lessons: [
      "Post-click handling is as important as ad creative. Delayed WhatsApp responses were causing 40% lead drop-off.",
      "Dynamic Creative Testing outperformed manual A/B testing by 2.3x in identifying winning angles.",
      "Catalog carousels paired with video hooks created a full-funnel narrative that improved retargeting ROAS.",
    ],
    nextSteps:
      "Scale winning creative angles to broader audiences. Implement automated WhatsApp response sequences for instant lead engagement.",
  },
  {
    slug: "sehgal-motors",
    client: "Sehgal Motors",
    industry: "Automotive & Retail",
    category: "automotive",
    metric: "3.8x",
    metricLabel: "Target ROAS Achieved",
    summary:
      "Engineered a full-funnel Meta Ads architecture for Pakistan's leading automotive retailer, achieving 3.8x ROAS on a PKR 50,000 daily budget.",
    challenge:
      "Sehgal Motors was spending aggressively on Meta Ads but couldn't attribute showroom visits to ad spend. Generic traffic campaigns were generating clicks but not qualified leads.",
    baseline:
      "ROAS of 1.2x on existing campaigns. No server-side tracking. Creative fatigue within 2 weeks of launch.",
    strategy: [
      "Implemented Meta CAPI with custom events: Vehicle Inquiry, Showroom Visit Request, WhatsApp Chat.",
      "Built audience stacks based on vehicle-specific interest signals (SUV buyers, sedan buyers, commercial fleet).",
      "Deployed Dynamic Creative Testing with 8 variations per ad set — mixing lifestyle video, static catalog, and testimonial formats.",
      "Created retargeting loops: Vehicle Page View → Price Inquiry → WhatsApp → Showroom Visit.",
    ],
    creatives: [
      "Vehicle-specific catalog ads with price overlays",
      "Customer testimonial Reels filmed at showroom",
      "Lifestyle video ads targeting vehicle lifecycle moments",
      "Static story ads with financing offers",
    ],
    results: [
      { label: "Target ROAS", value: "3.8x" },
      { label: "Cost Per Showroom Inquiry", value: "PKR 180" },
      { label: "Monthly Qualified Leads", value: "1,200+" },
      { label: "Creative Testing Variations", value: "24/month" },
      { label: "Audience Segments", value: "12 custom" },
      { label: "Retargeting Pool Growth", value: "340%" },
    ],
    lessons: [
      "Vehicle-specific audience stacks outperformed broad targeting by 3.1x in lead quality.",
      "Testimonial Reels generated 45% higher CTR than product-only creatives.",
      "Server-side CAPI restored 60% of lost conversion signals from iOS changes.",
    ],
    nextSteps:
      "Expand to Google Performance Max campaigns. Implement lead scoring via WhatsApp CRM integration.",
  },
  {
    slug: "gcc-startups",
    client: "GCC Startups",
    industry: "B2B & Consultancies",
    category: "b2b",
    metric: "47%",
    metricLabel: "Lower Cost Per Lead",
    summary:
      "Rebuilt the entire lead generation engine for a GCC-based startup consultancy, reducing cost per lead by 47% while increasing qualified pipeline volume.",
    challenge:
      "GCC Startups was relying on LinkedIn Ads and cold outreach with diminishing returns. Lead quality was low, and sales cycle length was increasing.",
    baseline:
      "Cost per lead: PKR 2,800. Lead-to-qualified ratio: 12%. No automated lead scoring or nurture sequences.",
    strategy: [
      "Shifted primary acquisition channel from LinkedIn to Meta + Google Search with intent-based targeting.",
      "Built a multi-step lead qualification funnel: Landing Page → WhatsApp Bot → Human Handoff.",
      "Implemented lead scoring based on company size, budget signals, and engagement patterns.",
      "Created automated nurture sequences via WhatsApp for leads not ready to convert immediately.",
    ],
    creatives: [
      "Authority-building carousel posts with case study data",
      "Founder-led video content explaining methodology",
      "Problem-agitation static ads targeting consultancy pain points",
      "Retargeting ads with social proof and client logos",
    ],
    results: [
      { label: "Cost Per Lead Reduction", value: "47%" },
      { label: "Lead-to-Qualified Ratio", value: "34%" },
      { label: "Monthly Qualified Pipeline", value: "PKR 2.4M" },
      { label: "Sales Cycle Reduction", value: "18 days" },
      { label: "WhatsApp Response Rate", value: "89%" },
      { label: "Client Retention Rate", value: "92%" },
    ],
    lessons: [
      "WhatsApp-first lead qualification outperformed email by 3.2x in response rate.",
      "Founder-led video content generated 2.8x higher trust signals than brand-only content.",
      "Multi-step qualification funnels reduced unqualified leads by 60% before human handoff.",
    ],
    nextSteps:
      "Scale to Saudi and UAE markets. Implement AI-powered lead scoring for instant qualification.",
  },
  {
    slug: "k-skincarelab",
    client: "K-SkincareLab",
    industry: "Beauty & Skincare",
    category: "ecommerce",
    metric: "3.2x",
    metricLabel: "ROAS in 60 Days",
    summary:
      "Built a high-converting skincare brand from scratch using UGC-first creative strategy and TikTok Shop integration, achieving 3.2x ROAS in 60 days.",
    challenge:
      "K-SkincareLab was a new entrant in Pakistan's competitive skincare market with no brand awareness, no pixel infrastructure, and zero paid acquisition history. They needed a scalable ad engine that could establish brand authority while driving profitable customer acquisition.",
    baseline:
      "Zero ad spend. No Meta Pixel, no CAPI, no retargeting audiences. Organic-only presence with <500 followers.",
    strategy: [
      "Built Meta Pixel and CAPI infrastructure with enhanced e-commerce tracking from day one.",
      "Launched UGC-first creative testing matrix: 20+ creator variations across Meta & TikTok within first 30 days.",
      "Integrated TikTok Shop for native checkout, reducing friction from discovery to purchase.",
      "Implemented dynamic creative testing (DCT) with hook-angle matrices: ingredient education → social proof → before/after transformation.",
      "Built retargeting loops: Video View (3s) → Product Page View → Add to Cart → TikTok Shop Purchase.",
      "Structured creator seeding program: 50+ micro-influencers seeded monthly with performance-based incentives.",
    ],
    creatives: [
      "Ingredient-deep-dive Reels with dermatologist commentary",
      "Real customer 30-day transformation carousel ads",
      "Founder story videos emphasizing clinical formulations",
      "UGC mashups with TikTok native text overlays",
      "Static carousels with clinical claim callouts + UGC social proof",
    ],
    results: [
      { label: "ROAS (60 Days)", value: "3.2x" },
      { label: "Cost Per Purchase", value: "PKR 380" },
      { label: "Conversion Rate", value: "3.8%" },
      { label: "Revenue Generated", value: "PKR 2.1M" },
      { label: "Ad Spend", value: "PKR 650K" },
      { label: "New Customer Acquisition", value: "1,240" },
      { label: "TikTok Shop Revenue Share", value: "42%" },
    ],
    lessons: [
      "TikTok Shop native checkout reduced drop-off by 35% vs redirect to website.",
      "UGC-first creative matrix outperformed brand-produced content by 2.4x in CTR.",
      "Creator seeding with performance incentives generated 5x more authentic content than fixed-fee contracts.",
      "Ingredient education hooks (niacinamide, ceramides, peptides) drove highest save/share rates.",
    ],
    nextSteps:
      "Scale to Google Shopping & Performance Max. Implement email/SMS retention flows for LTV optimization. Expand creator program to 100+ monthly seedings.",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

export function getCaseStudiesByCategory(category: string): CaseStudy[] {
  if (category === "all") return caseStudies;
  return caseStudies.filter((cs) => cs.category === category);
}
