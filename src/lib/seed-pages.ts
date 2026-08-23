import type { Data } from "@puckeditor/core";
import { posts } from "@/lib/posts";

function page(
  title: string,
  description: string,
  content: NonNullable<Data["content"]>,
): Data {
  return {
    root: { props: { title, description } },
    content,
  } as Data;
}

export const seedPages: Record<string, Data> = {
  /* ============================== Homepage ============================== */
  "/": page(
    "Sociolab — Trend-Native GTM Team",
    "We're the growth team for ambitious brands — producing content, running your social, marketing you, and building your web presence. One team, from trend to WhatsApp.",
    [
      {
        type: "HeroBlock",
        props: {
          eyebrow: "Sociolab — trend-native GTM team",
          title: "The internet moves fast.",
          accentTitle: "Your brand should too.",
          sub: "We're the growth team for ambitious brands — producing content, running your social, marketing you, and building your web presence. One team, from trend to WhatsApp.",
          ctaLabel: "Chat on WhatsApp",
          whatsappMessage: "Hi Sociolab, I want to grow my brand online.",
          secondaryLabel: "See our work",
          secondaryHref: "/work",
          stats: [
            { value: "50+", label: "brands grown" },
            { value: "30M+", label: "views generated" },
            { value: "100%", label: "in-house team" },
          ],
        },
      },
      { type: "MarqueeBlock", props: { items: [] } },
      {
        type: "CardGridBlock",
        props: {
          eyebrow: "Sound familiar?",
          title: "Posting isn't growing.",
          subtitle: "If any of these feel like you, that's exactly why you're here.",
          tone: "light",
          numbered: "true",
          items: [
            {
              title: "You post every day. Nothing happens.",
              body: "You're showing up, but the algorithm doesn't care. Effort without a strategy is just noise.",
            },
            {
              title: "Your competitors are everywhere. You're invisible.",
              body: "The brand that wins attention wins the customer. Right now, that's not you.",
            },
            {
              title: "Your agency sends reports, not results.",
              body: "Vanity metrics in a pretty deck. You paid for growth and got a monthly PDF.",
            },
          ],
        },
      },
      {
        type: "CardGridBlock",
        props: {
          eyebrow: "Why Sociolab",
          title: "Built different. On purpose.",
          subtitle: "Three edges, stacked. Any one is copyable — the combination isn't.",
          tone: "dark",
          numbered: "true",
          items: [
            {
              title: "Trend-native",
              body: "We don't guess what's trending — we're the generation scrolling it. Your content is born knowing what will land.",
            },
            {
              title: "One team, full stack",
              body: "Social, production, marketing, and web under one roof. No handoffs, no misaligned teams, faster than any specialist agency.",
            },
            {
              title: "WhatsApp-first",
              body: "The market talks on WhatsApp — so we meet them there. 98% open rates, conversations that convert, leads that land in your pocket.",
            },
          ],
        },
      },
      {
        type: "ServiceGridBlock",
        props: {
          eyebrow: "What we do",
          title: "Three capabilities. One goal: your growth.",
          subtitle: "Pick where you need us. Or don't — we're built to take the whole thing.",
          items: [
            {
              title: "Social Media Management",
              body: "Content that trends, communities that engage, and a feed that sells — managed end to end.",
              href: "/services/social-media-management",
            },
            {
              title: "Digital Marketing",
              body: "Ads, SEO, and campaigns that turn attention into customers you can actually measure.",
              href: "/services/digital-marketing",
            },
            {
              title: "Web Development",
              body: "Fast, beautiful, conversion-built websites that make your brand credible and keep it growing.",
              href: "/services/web-development",
            },
          ],
        },
      },
      {
        type: "StepsBlock",
        props: {
          eyebrow: "The Sociolab Method",
          title: "How we move your brand forward",
          subtitle: "Four steps. Every one of them has a reason to exist — they're the whole machine.",
          dark: "true",
          items: [
            { title: "Listen", body: "Trend and audience intelligence. What your market scrolls, when, and why." },
            { title: "Create", body: "Production. Content, creative, and campaigns built to stop the thumb." },
            { title: "Share", body: "Distribution across the right platforms, timed to perform." },
            { title: "Convert", body: "Turning attention into conversations — on WhatsApp, where your customers already are." },
          ],
        },
      },
      {
        type: "CaseGridBlock",
        props: {
          eyebrow: "Proof, not promises",
          title: "Work that speaks for itself",
          subtitle: "Real brands, real numbers. The receipts live on our work page.",
          items: [
            { service: "Social Media Management", metric: "2.4x", result: "more qualified enquiries in 4 months", client: "Client name" },
            { service: "Digital Marketing", metric: "-38%", result: "cost per lead on paid campaigns", client: "Client name" },
            { service: "Web Development", metric: "+61%", result: "conversion rate after rebuild", client: "Client name" },
          ],
        },
      },
      {
        type: "TestimonialBlock",
        props: {
          eyebrow: "The feeling",
          title: "Clients who felt the difference",
          items: [
            {
              quote: "They get what we don't. Content finally feels like our brand, and the enquiries actually show up.",
              name: "Client name",
              role: "Founder, Company",
            },
            {
              quote: "First agency that talks in results instead of jargon. WhatsApp-first turned our enquiry flow around.",
              name: "Client name",
              role: "Marketing Lead, Company",
            },
          ],
        },
      },
      {
        type: "FaqBlock",
        props: {
          eyebrow: "No guesswork",
          title: "Before you reach out",
          subtitle: "The questions everyone asks. Answered so your first message can be short.",
          items: [
            {
              q: "How much does it cost?",
              a: "It depends on scope — platforms, volume, and goals. We'll scope to your objective first and give you a fixed quote before we start. No mystery box, no surprise invoices.",
            },
            {
              q: "How long until I see results?",
              a: "Organic growth compounds — expect early movement in weeks, meaningful results by month three. Paid campaigns move faster, often within the first week. We usually run both so you get quick wins while SEO builds.",
            },
            {
              q: "What's included?",
              a: "Everything is listed in your proposal: deliverables, platforms, posting volume, reporting cadence, and communication. What you see is what we ship — and if something changes, we tell you before it happens.",
            },
            {
              q: "Who is this NOT for?",
              a: "Brands who want overnight magic, or who aren't willing to share their numbers. We win by showing up consistently and measuring honestly. If that's not you, we'll tell you on the first call.",
            },
            {
              q: "What happens when I message you?",
              a: "You get a real person, not a bot. We ask a few questions, give you an honest read on your brand, and if we're not the right fit we'll say so. No pressure, no scripts.",
            },
            {
              q: "Do you work with my industry?",
              a: "We work across industries, but our content engine is strongest where attention moves fast — ecommerce, restaurants, clinics, real estate, and startups. Message us and we'll tell you straight.",
            },
          ],
        },
      },
      {
        type: "CtaBlock",
        props: {
          title: "Let's make your brand the one they talk about.",
          body: "No forms. No booking tools. Just a conversation.",
          tone: "orange",
          ctaLabel: "Chat on WhatsApp",
          whatsappMessage: "Hi Sociolab, I want to grow my brand online.",
          subline: "We reply fast — usually within the hour",
        },
      },
    ],
  ),

  /* ===================== Social Media Management ========================= */
  "/services/social-media-management": page(
    "Social Media Management Agency Pakistan",
    "Social media that actually grows your brand. Content that trends, communities that engage, and a strategy tied to customers — managed end to end by Sociolab.",
    [
      {
        type: "HeroBlock",
        props: {
          eyebrow: "Service 01 — Social Media Management",
          title: "Social media that actually grows your brand",
          accentTitle: "",
          sub: "We manage your Instagram, TikTok, and more — with content that trends, posts that engage, and a strategy tied to customers, not likes.",
          ctaLabel: "Chat on WhatsApp",
          whatsappMessage: "Hi Sociolab, I need help with my social media.",
          secondaryLabel: "See how we work",
          secondaryHref: "/method",
          stats: [],
        },
      },
      {
        type: "CalloutBlock",
        props: {
          label: "Not for you?",
          text: "If you want overnight magic or aren't willing to show up consistently, this isn't the right fit. We win with systems, not luck.",
        },
      },
      {
        type: "SectionBlock",
        props: {
          eyebrow: "Sound familiar?",
          title: "Your feed is silent while your competitors grow.",
          subtitle:
            "You're posting, but it isn't working. The content looks fine, the engagement isn't there, and the followers you do have never buy. The agency before you counted likes instead of customers — and the bill came anyway.",
          dark: "false",
          align: "left",
        },
      },
      {
        type: "StepsBlock",
        props: {
          eyebrow: "How we fix it",
          title: "The process, in plain English",
          subtitle: "",
          dark: "false",
          items: [
            { title: "Listen", body: "We map your market's trends, platforms, and timing — what your audience actually scrolls, and when." },
            { title: "Create", body: "Content and production built to stop the thumb: reels, posts, stories, and campaigns that feel native to the platform." },
            { title: "Share", body: "Distribution across the right platforms, scheduled and timed to perform when your audience is online." },
            { title: "Convert", body: "Comments, DMs, and enquiries routed to WhatsApp — where your customers actually talk and buy." },
          ],
        },
      },
      {
        type: "DeliverablesBlock",
        props: {
          eyebrow: "What's included",
          title: "What a social engagement includes",
          intro: "Scoped to your goals and platforms.",
          items: [
            { item: "Content calendar built on trends" },
            { item: "Posts, reels, and stories monthly" },
            { item: "Community management & replies" },
            { item: "Platform-native creative" },
            { item: "Monthly report tied to business goals" },
            { item: "WhatsApp support, business hours" },
          ],
        },
      },
      {
        type: "StatementBlock",
        props: {
          eyebrow: "How we price it",
          text: "Scoped to your goals and platforms — a typical engagement is fixed-quote before we start. No mystery box, no surprise invoices. Message us and we'll give you a straight answer.",
          tone: "ink",
        },
      },
      {
        type: "SectionBlock",
        props: {
          eyebrow: "Receipts",
          title: "Feeds that stopped the scroll — and sold.",
          subtitle: "Case studies with real numbers live on our work page. Until we add yours, judge us by the process — it's the same one every client gets.",
          dark: "false",
          align: "left",
        },
      },
      {
        type: "LinkBlock",
        props: { label: "See full case studies", href: "/work", style: "outline" },
      },
      {
        type: "FaqBlock",
        props: {
          eyebrow: "Straight answers",
          title: "Questions before you reach out",
          subtitle: "",
          items: [
            {
              q: "Which platforms do you manage?",
              a: "Instagram, TikTok, Facebook, and LinkedIn — whichever your audience actually uses. We'll tell you if a platform isn't worth your money.",
            },
            {
              q: "How long until I see results?",
              a: "Engagement moves in weeks; enquiries follow as the feed builds trust. Most clients see real business impact by month three.",
            },
            {
              q: "Do we keep ownership of content?",
              a: "Yes. Everything we produce for your brand is yours. We just make it work for you while we're engaged.",
            },
            {
              q: "What happens after I message you?",
              a: "A real person answers, asks three questions, and gives you an honest read on your brand. No scripts, no pressure.",
            },
          ],
        },
      },
      {
        type: "CtaBlock",
        props: {
          title: "Let's build a feed that works.",
          body: "Message us — we'll tell you exactly what we'd do.",
          tone: "orange",
          ctaLabel: "Chat on WhatsApp",
          whatsappMessage: "Hi Sociolab, I need help with my social media.",
          subline: "",
        },
      },
    ],
  ),

  /* ========================== Digital Marketing ========================== */
  "/services/digital-marketing": page(
    "Digital Marketing Agency Pakistan",
    "Ads, SEO, and campaigns that turn attention into customers you can measure. Full-funnel digital marketing by Sociolab — one team, from trend to WhatsApp.",
    [
      {
        type: "HeroBlock",
        props: {
          eyebrow: "Service 02 — Digital Marketing",
          title: "Marketing you can actually measure",
          accentTitle: "",
          sub: "Ads, SEO, and campaigns built to turn attention into customers — with numbers you can see, not vanity metrics in a deck.",
          ctaLabel: "Chat on WhatsApp",
          whatsappMessage: "Hi Sociolab, I need help with my digital marketing.",
          secondaryLabel: "See how we work",
          secondaryHref: "/method",
          stats: [],
        },
      },
      {
        type: "CalloutBlock",
        props: {
          label: "Not for you?",
          text: "If you want someone to 'just run ads' without strategy or reporting, we're not it. We tie every rupee to a business outcome.",
        },
      },
      {
        type: "SectionBlock",
        props: {
          eyebrow: "Sound familiar?",
          title: "You're paying for ads that don't convert.",
          subtitle:
            "Spend is going out, traffic is coming in, and nothing happens after the click. The agency reports impressions and engagement while your pipeline stays flat. Marketing that can't be measured is just an expense.",
          dark: "false",
          align: "left",
        },
      },
      {
        type: "StepsBlock",
        props: {
          eyebrow: "How we fix it",
          title: "The process, in plain English",
          subtitle: "",
          dark: "false",
          items: [
            { title: "Diagnose", body: "We audit your funnel — where attention comes in, where it leaks, and what's actually worth paying for." },
            { title: "Strategize", body: "One plan across paid, SEO, and creative — aligned to the customers you actually want, not broad reach." },
            { title: "Execute", body: "Campaigns built, optimized, and iterated weekly. Creative refreshed on data, not vibes." },
            { title: "Convert & report", body: "Leads routed to WhatsApp and a report that answers one question: did we make money this month?" },
          ],
        },
      },
      {
        type: "DeliverablesBlock",
        props: {
          eyebrow: "What's included",
          title: "What a marketing engagement includes",
          intro: "Scoped to your budget and goals.",
          items: [
            { item: "Full-funnel strategy" },
            { item: "Paid ads (Meta & Google)" },
            { item: "SEO & content support" },
            { item: "Conversion tracking setup" },
            { item: "Weekly optimization" },
            { item: "Monthly report tied to revenue" },
          ],
        },
      },
      {
        type: "StatementBlock",
        props: {
          eyebrow: "How we price it",
          text: "Priced on scope and ad budget, fixed-quote before we start. We'll tell you what's realistic for your budget — and what isn't worth spending.",
          tone: "ink",
        },
      },
      {
        type: "SectionBlock",
        props: {
          eyebrow: "Receipts",
          title: "Campaigns that paid for themselves.",
          subtitle: "Real cost-per-lead and conversion numbers live on our work page. Same process, same receipts.",
          dark: "false",
          align: "left",
        },
      },
      {
        type: "LinkBlock",
        props: { label: "See full case studies", href: "/work", style: "outline" },
      },
      {
        type: "FaqBlock",
        props: {
          eyebrow: "Straight answers",
          title: "Questions before you reach out",
          subtitle: "",
          items: [
            {
              q: "How fast will I see results?",
              a: "Paid campaigns often move within the first week. SEO compounds over months. We run both so you get quick wins while the long game builds.",
            },
            {
              q: "Do I need a big budget?",
              a: "We'll be honest about what your budget can achieve. We'd rather set expectations straight than burn your spend.",
            },
            {
              q: "Do you run both Google and Meta ads?",
              a: "Yes — and we'll recommend the right mix rather than pushing both. Sometimes one channel wins for your business.",
            },
            {
              q: "What do I get each month?",
              a: "A clear report: spend, results, and what we changed and why. Plus a direct line to your account team on WhatsApp.",
            },
          ],
        },
      },
      {
        type: "CtaBlock",
        props: {
          title: "Let's make your marketing pay for itself.",
          body: "Message us — we'll give you a straight read on your current setup.",
          tone: "orange",
          ctaLabel: "Chat on WhatsApp",
          whatsappMessage: "Hi Sociolab, I need help with my digital marketing.",
          subline: "",
        },
      },
    ],
  ),

  /* ============================ Web Development ========================== */
  "/services/web-development": page(
    "Web Development Company Pakistan",
    "Fast, beautiful, conversion-built websites by Sociolab — designed to make your brand credible, rank on Google, and turn visitors into customers.",
    [
      {
        type: "HeroBlock",
        props: {
          eyebrow: "Service 03 — Web Development",
          title: "Websites built to convert, not just look good",
          accentTitle: "",
          sub: "Fast, beautiful, and built around one job: turning visitors into enquiries. Design, development, and SEO structure in one deliverable.",
          ctaLabel: "Chat on WhatsApp",
          whatsappMessage: "Hi Sociolab, I need a website.",
          secondaryLabel: "See how we work",
          secondaryHref: "/method",
          stats: [],
        },
      },
      {
        type: "CalloutBlock",
        props: {
          label: "Not for you?",
          text: "If you want a generic template slapped up in a weekend with no strategy, we're overkill. We build for brands that want to grow.",
        },
      },
      {
        type: "SectionBlock",
        props: {
          eyebrow: "Sound familiar?",
          title: "Your website is the weakest link in your funnel.",
          subtitle:
            "Traffic comes from your social and ads — then dies on a slow, dated site that doesn't say what you do or capture the lead. Your website is your 24/7 salesperson, and yours is on a smoke break.",
          dark: "false",
          align: "left",
        },
      },
      {
        type: "StepsBlock",
        props: {
          eyebrow: "How we fix it",
          title: "The process, in plain English",
          subtitle: "",
          dark: "false",
          items: [
            { title: "Audit", body: "We review your funnel, competitors, and goals — then map the site structure and content strategy." },
            { title: "Design", body: "A distinctive, on-brand experience, wireframed and designed to guide visitors toward one action." },
            { title: "Build", body: "Fast, mobile-first, and SEO-structured. Built to rank and to load in a heartbeat." },
            { title: "Launch & grow", body: "Deployed with analytics and WhatsApp capture live, then refined as the data comes in." },
          ],
        },
      },
      {
        type: "DeliverablesBlock",
        props: {
          eyebrow: "What's included",
          title: "What a web project includes",
          intro: "Scoped to pages and features.",
          items: [
            { item: "Strategy & site structure" },
            { item: "Custom design (no templates)" },
            { item: "Mobile-first build" },
            { item: "Technical SEO & schema" },
            { item: "Analytics & WhatsApp setup" },
            { item: "Training & handover" },
          ],
        },
      },
      {
        type: "StatementBlock",
        props: {
          eyebrow: "What a build costs",
          text: "Scoped to pages and features — fixed-quote before we start. A simple brand site runs less than a full ecommerce build; we'll tell you exactly where your project lands.",
          tone: "ink",
        },
      },
      {
        type: "SectionBlock",
        props: {
          eyebrow: "Receipts",
          title: "Sites that closed the deal.",
          subtitle: "Conversion-rate numbers from real rebuilds live on our work page. The same build process goes into every site we ship.",
          dark: "false",
          align: "left",
        },
      },
      {
        type: "LinkBlock",
        props: { label: "See full case studies", href: "/work", style: "outline" },
      },
      {
        type: "FaqBlock",
        props: {
          eyebrow: "Straight answers",
          title: "Questions before you reach out",
          subtitle: "",
          items: [
            {
              q: "How long does a build take?",
              a: "A standard marketing site ships in 2–4 weeks; ecommerce and custom builds take longer. You'll get a timeline before we start.",
            },
            {
              q: "Will my site rank on Google?",
              a: "We build technical SEO in from day one — structure, speed, schema — and we can run ongoing SEO alongside if you want to rank faster.",
            },
            {
              q: "Can I edit the site myself?",
              a: "Yes — we hand over an easy CMS so you can update content without calling us. And we're on WhatsApp if you ever get stuck.",
            },
            {
              q: "Do you design too, or just code?",
              a: "Both. One team does strategy, design, and build — no misaligned handoffs between agencies.",
            },
          ],
        },
      },
      {
        type: "CtaBlock",
        props: {
          title: "Let's build the site your brand deserves.",
          body: "Message us — we'll scope it and give you a fixed quote.",
          tone: "orange",
          ctaLabel: "Chat on WhatsApp",
          whatsappMessage: "Hi Sociolab, I need a website.",
          subline: "",
        },
      },
    ],
  ),

  /* =============================== About ================================= */
  "/about": page(
    "About Sociolab — The Team Behind the Growth",
    "Sociolab is a trend-native growth team: social media, marketing, and web under one roof — moving brands from trend to WhatsApp.",
    [
      {
        type: "HeroBlock",
        props: {
          eyebrow: "About Sociolab",
          title: "We're the growth team for brands that refuse to be ignored.",
          accentTitle: "",
          sub: "Sociolab started with a simple frustration: businesses were paying agencies to post, and calling it marketing. Meanwhile, the brands that actually won were the ones that moved with the internet. So we built a different kind of team — one that produces content, runs social, markets, and builds websites, all in-house, all moving at the speed of a trend.",
          ctaLabel: "Chat on WhatsApp",
          whatsappMessage: "Hi Sociolab, I'd like to know more about your team.",
          secondaryLabel: "",
          secondaryHref: "",
          stats: [],
        },
      },
      {
        type: "CardGridBlock",
        props: {
          eyebrow: "What we believe",
          title: "Four principles we won't compromise on.",
          subtitle: "",
          tone: "dark",
          numbered: "false",
          items: [
            {
              title: "Trend-native, not trend-chasing",
              body: "We move with the internet because we live on it. Strategy comes from the ground, not the boardroom.",
            },
            {
              title: "One team, no handoffs",
              body: "Social, creative, marketing, and web in-house. Your brand is never bounced between agencies.",
            },
            {
              title: "Measured in customers",
              body: "Likes are nice; enquiries are better. Every deliverable exists to move the needle that matters.",
            },
            {
              title: "Honest by default",
              body: "If it won't work, we'll say so before you pay for it. If you don't need us, we'll tell you.",
            },
          ],
        },
      },
      {
        type: "TwoColumnBlock",
        props: {
          eyebrow: "What we are",
          title: "Part agency. Part in-house team.",
          body: "You get the muscle of an agency and the closeness of an in-house crew — with a WhatsApp line straight to the people doing the work. No account managers translating between you and whoever actually touches your brand.\n\nThe short version: \"We take your brand from trend to WhatsApp — content, marketing, and web, under one roof, measured in customers.\"",
          imageSrc: "",
          imageAlt: "",
          flip: "false",
        },
      },
      {
        type: "TeamBlock",
        props: {
          eyebrow: "The people",
          title: "A crew that lives on the internet",
          subtitle: "Add your team here — name, role, a line about them, and a photo.",
          items: [
            { name: "Team member", role: "Founder", bio: "One line about what they do at Sociolab.", photo: "" },
            { name: "Team member", role: "Creative lead", bio: "One line about what they do at Sociolab.", photo: "" },
            { name: "Team member", role: "Growth lead", bio: "One line about what they do at Sociolab.", photo: "" },
          ],
        },
      },
      {
        type: "CtaBlock",
        props: {
          title: "Ready to meet the team?",
          body: "Say hello on WhatsApp. It takes 30 seconds.",
          tone: "orange",
          ctaLabel: "Chat on WhatsApp",
          whatsappMessage: "Hi Sociolab, I'd like to know more about your team.",
          subline: "",
        },
      },
    ],
  ),

  /* ================================ Method =============================== */
  "/method": page(
    "The Sociolab Method — From Trend to WhatsApp",
    "The Sociolab Method: Listen, Create, Share, Convert. Four steps that turn attention into customers — and why we refuse to work without it.",
    [
      {
        type: "HeroBlock",
        props: {
          eyebrow: "The Sociolab Method",
          title: "From trend to WhatsApp.",
          accentTitle: "",
          sub: "Four steps. Each one exists for a reason, and none of them can be skipped without the whole machine slowing down. This is the exact process every Sociolab client gets.",
          ctaLabel: "Chat on WhatsApp",
          whatsappMessage: "Hi Sociolab, tell me about your method.",
          secondaryLabel: "",
          secondaryHref: "",
          stats: [],
        },
      },
      {
        type: "StepsBlock",
        props: {
          eyebrow: "",
          title: "",
          subtitle: "",
          dark: "false",
          items: [
            {
              title: "Listen",
              body: "Before we create anything, we study the ground. Trends your market is already watching, platforms where they actually spend time, the moments they engage, and the words they search. We sit inside the feed your customers live in — so our work starts native to your audience, not foreign to it.",
            },
            {
              title: "Create",
              body: "Then we make things people stop for. Content, creative, and campaigns built for the platform they live on — reels that feel native, copy that sounds like a person, offers that feel obvious. Every piece has a job: to earn a second of attention.",
            },
            {
              title: "Share",
              body: "Distribution is where most brands quietly fail. We put the work where it belongs, when it matters — across the right platforms, timed to your audience's behavior, and amplified with paid where the math makes sense. Great work nobody sees is just a mood board.",
            },
            {
              title: "Convert",
              body: "The point of all of it. Attention becomes conversation, conversation becomes a customer — on WhatsApp, where your market already talks. Every enquiry is measured, every campaign answers one question: what did this bring in?",
            },
          ],
        },
      },
      {
        type: "StatementBlock",
        props: {
          eyebrow: "Why we're strict about it",
          text: "The method exists because shortcuts cost you customers. Skip Listen and you're guessing. Skip Create and you're just posting. Skip Share and nobody sees it. Skip Convert and you have followers, not revenue. We run the whole loop — and that's why the brands we grow grow on purpose, not by accident.",
          tone: "ink",
        },
      },
      {
        type: "CtaBlock",
        props: {
          title: "Put the method on your brand.",
          body: "",
          tone: "orange",
          ctaLabel: "Chat on WhatsApp",
          whatsappMessage: "Hi Sociolab, I want to apply your method to my brand.",
          subline: "",
        },
      },
    ],
  ),

  /* ================================= Work ================================ */
  "/work": page(
    "Our Work — Brands We've Grown",
    "Real numbers from real Sociolab clients: more enquiries, lower cost per lead, higher conversion. See how we grow brands.",
    [
      {
        type: "HeroBlock",
        props: {
          eyebrow: "Proof, not promises",
          title: "Work that speaks for itself.",
          accentTitle: "",
          sub: "These are the numbers we build toward — real results, measured in customers. New case studies land here as our brands grow.",
          ctaLabel: "Chat on WhatsApp",
          whatsappMessage: "Hi Sociolab, I want to see what you can do for me.",
          secondaryLabel: "",
          secondaryHref: "",
          stats: [],
        },
      },
      {
        type: "CaseGridBlock",
        props: {
          eyebrow: "",
          title: "",
          subtitle: "",
          items: [
            { service: "Social Media Management", metric: "2.4x", result: "more qualified enquiries in 4 months", client: "Client name" },
            { service: "Digital Marketing", metric: "-38%", result: "cost per lead on paid campaigns", client: "Client name" },
            { service: "Web Development", metric: "+61%", result: "conversion rate after rebuild", client: "Client name" },
            { service: "Social Media Management", metric: "3.1x", result: "engagement on a new brand launch", client: "Client name" },
            { service: "Digital Marketing", metric: "22%", result: "of revenue from a single campaign", client: "Client name" },
            { service: "Web Development", metric: "-54%", result: "page load time after rebuild", client: "Client name" },
          ],
        },
      },
      {
        type: "SectionBlock",
        props: {
          eyebrow: "Who we grow",
          title: "Built for brands where attention decides everything.",
          subtitle: "",
          dark: "false",
          align: "left",
        },
      },
      {
        type: "GalleryBlock",
        props: {
          eyebrow: "",
          title: "Snapshots from the feed",
          subtitle: "Upload campaign stills, content shots, or brand work here.",
          items: [
            { src: "", alt: "", caption: "Add a caption" },
            { src: "", alt: "", caption: "Add a caption" },
            { src: "", alt: "", caption: "Add a caption" },
          ],
        },
      },
      {
        type: "CtaBlock",
        props: {
          title: "Your brand could be the next case study.",
          body: "",
          tone: "orange",
          ctaLabel: "Chat on WhatsApp",
          whatsappMessage: "Hi Sociolab, I want to be your next case study.",
          subline: "",
        },
      },
    ],
  ),

  /* =============================== Contact =============================== */
  "/contact": page(
    "Contact Sociolab",
    "Chat with Sociolab on WhatsApp — no forms, no booking tools. Get a straight answer on growing your brand within the hour.",
    [
      {
        type: "HeroBlock",
        props: {
          eyebrow: "Contact",
          title: "No forms. Just a conversation.",
          accentTitle: "",
          sub: "The fastest way to reach us is WhatsApp — it's where we're most responsive and where the work actually starts. Message us and a real person answers.",
          ctaLabel: "Chat on WhatsApp",
          whatsappMessage: "Hi Sociolab, I'd like to talk about my brand.",
          secondaryLabel: "Email us",
          secondaryHref: "mailto:hello@sociolab.com.pk",
          stats: [],
        },
      },
      {
        type: "StatementBlock",
        props: {
          eyebrow: "",
          text: "Prefer email? hello@sociolab.com.pk — or follow the work on Instagram, Facebook, X, and LinkedIn.",
          tone: "light",
        },
      },
      {
        type: "ContactFormBlock",
        props: {
          eyebrow: "Get in touch",
          title: "Tell us about your brand",
          sub: "Fill this in and it opens WhatsApp with your message ready to send.",
          buttonLabel: "Send on WhatsApp",
          whatsappMessage: "Hi Sociolab, I want to talk about my brand.",
          subline: "We reply fast — usually within the hour",
          tone: "false",
        },
      },
    ],
  ),
};

/* ====================== Blog posts (generated) ========================= */
for (const post of posts) {
  seedPages[`/resources/${post.slug}`] = page(post.title, post.excerpt, [
    {
      type: "TextBlock",
      props: {
        align: "left",
        paragraphs: post.body.map((paragraph) => ({ paragraph })),
      },
    },
    {
      type: "CtaBlock",
      props: {
        title: "Want this applied to your brand?",
        body: "",
        tone: "orange",
        ctaLabel: "Chat on WhatsApp",
        whatsappMessage: "Hi Sociolab, I read your post and want to talk.",
        subline: "",
      },
    },
  ]);
}

export const seedPagePaths = Object.keys(seedPages);