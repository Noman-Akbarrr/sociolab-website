export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  body: string[];
};

// TODO: migrate to Puck-managed posts (Post model in prisma/schema.prisma) once admin is live
export const posts: Post[] = [
  {
    slug: "the-internet-moves-fast-heres-how-to-keep-up",
    title: "The Internet Moves Fast. Here's How to Keep Up.",
    excerpt:
      "Trends don't wait for your approval. A practical look at how brands stay relevant without chasing every fad.",
    date: "2026-08-01",
    readTime: "6 min",
    category: "Strategy",
    body: [
      "By the time a trend reaches your feed, it's already peaked for early adopters. The brands that win aren't faster at copying — they're faster at deciding what matters and ignoring the rest.",
      "The mistake most brands make is treating every trend with the same urgency. A dance challenge is not a brand strategy. The skill is learning to read the signal: which trends actually move attention toward categories like yours?",
      "Start with your audience, not the trend. The internet moves fast — your positioning should move slowly. Trends change weekly; your story changes quarterly. Keep the core steady and apply trends as a layer on top.",
      "Second, build a listening habit. Ten minutes a day in the feeds your customers live in beats a monthly 'trend report' from an agency. The team at Sociolab grew up in these feeds — it's why our content lands the day it ships, not the week after.",
      "Finally, commit to production speed. A brand that can ship a good idea in a day beats a brand with a perfect idea next month. Speed is a feature of your team, not just your content.",
    ],
  },
  {
    slug: "why-posting-isnt-growth",
    title: "Posting Isn't Growth.",
    excerpt:
      "You're showing up every day and nothing's happening. Here's what posting actually is, and what growth actually needs.",
    date: "2026-07-22",
    readTime: "5 min",
    category: "Strategy",
    body: [
      "Posting is showing up. Growth is a system. The gap between them is where most brands quietly waste a year.",
      "A post is a bet that attention arrives on its own. It rarely does. Growth is attention engineered — content built around a trend or question your market actually has, distributed at the moment they're online, and converted into a conversation you can continue.",
      "The brands that grow treat every post as a step in a funnel, not a diary entry. The content earns the pause; the profile and bio convert it; the WhatsApp line catches it. Posting without the rest is just noise with a nice grid.",
      "Before you post more, answer three questions: What do I want the viewer to feel? What do I want them to do? What do they get when they do it? If you can't answer them, no volume of posting will fix it.",
    ],
  },
  {
    slug: "whatsapp-marketing-for-pakistani-businesses",
    title: "WhatsApp Marketing for Pakistani Businesses in 2026",
    excerpt:
      "Your customers live on WhatsApp. Here's how brands in Pakistan are turning chat into their highest-converting channel.",
    date: "2026-07-10",
    readTime: "8 min",
    category: "Channel",
    body: [
      "In Pakistan, WhatsApp isn't a channel — it's where business happens. Orders, negotiations, follow-ups, referrals: it all runs through green bubbles. Brands that treat it as a form on their website are leaving money on the table.",
      "The conversion funnel in Pakistan is shorter than Western playbooks assume. A customer sees a post, taps your profile link, and expects to message you in two taps. Every extra step — a form, a landing page, a 'contact us' email — leaks enquiries.",
      "Make WhatsApp the destination of everything. Your social bio, your ads, your website's CTA — all of it should end in a pre-filled WhatsApp message. We see enquiry rates jump the moment the friction disappears.",
      "Then treat the chat like a storefront. Response speed is your first impression; a reply within the hour converts far better than a reply next day. And automate the boring parts — quick replies for FAQs, a catalog for products — so your team can focus on the customers worth talking to.",
    ],
  },
  {
    slug: "instagram-reels-vs-tiktok-where-should-your-brand-be",
    title: "Instagram Reels vs TikTok: Where Should Your Brand Be?",
    excerpt:
      "The wrong platform question costs brands weeks every year. Here's how to decide in an afternoon.",
    date: "2026-06-28",
    readTime: "7 min",
    category: "Channel",
    body: [
      "Every brand asks the same question and the answer is almost always 'both, but not equally.' The real question isn't which platform is better — it's where your specific customer is paying attention and what format they're in the mood for.",
      "TikTok rewards discovery. If your customer doesn't know you exist, TikTok's algorithm will happily introduce you — if the content stops the thumb in the first second. It's the strongest organic reach for a brand starting from zero.",
      "Instagram rewards relationship. The audience is older, the searches are more intentional ('restaurant near me'), and the same content gets more conversation. It's the strongest place to build a community that buys.",
      "Our rule of thumb: create for discovery where you're unknown, and for depth where you're known. Many Pakistani brands win by using TikTok to get seen and Instagram to get believed — then routing both to WhatsApp to get paid.",
    ],
  },
  {
    slug: "the-four-step-method-behind-brands-that-grow-on-purpose",
    title: "The 4-Step Method Behind Brands That Grow on Purpose",
    excerpt:
      "Listen, Create, Share, Convert. Why skipping any one of these quietly caps your growth.",
    date: "2026-06-15",
    readTime: "6 min",
    category: "Strategy",
    body: [
      "Most growth failures aren't strategy failures — they're missing steps. A brand posts great content but never converts it. Another runs ads but has nothing worth showing. The ones that grow on purpose run the whole loop.",
      "Listen. Before creating, know the trends, timing, and words your market already responds to. This is why we start every engagement by sitting inside the feed, not in a boardroom.",
      "Create. Make things people stop for — content that feels native to the platform, not imported from a brand guideline. Then Share it where it belongs, amplified where the math works.",
      "Convert. Attention is only the first currency. Every piece of content should end in a conversation — on WhatsApp, where your customer already is. A post that gets views but no messages is a billboard in a desert.",
      "Run all four and growth becomes predictable. Skip one and you're leaving money on the table. That's the whole method — and it's the whole reason it's called a method.",
    ],
  },
  {
    slug: "why-your-website-isnt-converting",
    title: "Why Your Website Isn't Converting (And How to Fix It)",
    excerpt:
      "Traffic arrives and leaves. Most sites fail on four things — here's how to diagnose yours in ten minutes.",
    date: "2026-06-02",
    readTime: "7 min",
    category: "Web",
    body: [
      "If your social and ads are driving traffic but your phone isn't ringing, the problem is usually the website, not the traffic. Most sites leak on four points.",
      "One: it doesn't say what you do in five seconds. Your hero headline should state the outcome you deliver, not your company name or a tagline that means nothing. The visitor should know who you help and how within one glance.",
      "Two: it's slow. Every extra second of load time bleeds conversion — especially on mobile data, where most of Pakistan browses. Compress images, cut heavy scripts, and test on a phone, not a laptop.",
      "Three: the CTA is buried. One action per page, above the fold, repeated as you scroll. For most Pakistani businesses that action is 'chat on WhatsApp' — a tap away, not a form away.",
      "Four: no proof. Reviews, numbers, clients — put them where doubt forms, near the CTA, not in a page nobody visits.",
    ],
  },
  {
    slug: "vanity-metrics-are-lying-to-you",
    title: "Vanity Metrics Are Lying to You",
    excerpt:
      "Likes, impressions, followers — none of them pay rent. The metrics that matter are the ones tied to customers.",
    date: "2026-05-20",
    readTime: "5 min",
    category: "Reporting",
    body: [
      "A beautiful monthly report with rising followers and flat revenue is a report that's lying to you. Vanity metrics feel good and change nothing.",
      "Impressions tell you attention was in the room, not that anyone cared. Likes are participation trophies — social proof, not intent. Followers are a list of people who once paused; most will never buy.",
      "The metrics that matter are the ones tied to your funnel: how many people messaged you, how many became conversations, how many became customers, and at what cost. Those four numbers tell you whether the machine is working.",
      "Ask your agency one question: 'What did this month bring in?' If the answer is a metric that isn't revenue or a lead, it's a vanity metric. A growth partner should talk in customers, not likes.",
    ],
  },
  {
    slug: "how-to-pick-a-digital-agency-that-actually-delivers",
    title: "How to Pick a Digital Agency That Actually Delivers",
    excerpt:
      "You've been burned once. Here's how to spot the agency that will actually grow your brand — in three questions.",
    date: "2026-05-08",
    readTime: "6 min",
    category: "Strategy",
    body: [
      "Picking an agency feels like a leap of faith because most pitches are designed to feel impressive instead of honest. Cut through it with three questions.",
      "One: 'What's your process?' A real agency has a repeatable method and can walk you through it step by step. If the answer is vague, the delivery will be too.",
      "Two: 'What does success look like at month three?' A confident partner gives you specific, measurable outcomes and sets expectations you can hold them to. 'We'll grow your following' is a non-answer.",
      "Three: 'Who will I actually talk to?' If you're handed an account manager who translates between you and the people doing the work, you've already lost time. You want the team that touches your brand on the other end of the line.",
      "And the honest one: a good agency will tell you what they can't do for you. If everything is 'yes, yes, yes,' you're about to be their learning experience.",
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}