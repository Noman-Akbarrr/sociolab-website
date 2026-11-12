import type { Metadata } from "next";
import { site } from "@/lib/site";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply when you use sociolab.com.pk or engage Sociolab for digital marketing, social media, or web development services.",
  alternates: {
    canonical: `${site.url}/legal/terms`,
  },
};

const sections: LegalSection[] = [
  {
    heading: "Agreement to these terms",
    paragraphs: [
      `These Terms of Service govern your use of ${site.domain} and any services you engage Sociolab to provide. By using this website, submitting a form, or signing a proposal or statement of work with us, you agree to these terms. If you do not agree, please do not use the site or our services.`,
      "Where you sign a separate written agreement or proposal with us, that document takes precedence over these terms to the extent of any conflict.",
    ],
  },
  {
    heading: "Our services",
    paragraphs: [
      "Sociolab provides digital marketing services, which may include performance marketing and paid advertising, social media management, content and creative production, and web development. The exact scope, deliverables, timelines, and fees for any engagement are set out in the proposal or statement of work agreed with you.",
    ],
  },
  {
    heading: "Using this website",
    paragraphs: [
      "You agree to use this website only for lawful purposes and in a way that does not infringe the rights of, or restrict the use of this site by, anyone else.",
      "You must not attempt to gain unauthorised access to any part of this site, its servers, or any connected system; introduce malware or other harmful material; scrape or harvest content or data at scale; or use the site to send unsolicited or deceptive communications.",
      "Accounts created for the client portal or admin areas are personal to you. You are responsible for keeping your login credentials confidential and for all activity that occurs under your account.",
    ],
  },
  {
    heading: "Client responsibilities",
    paragraphs: [
      "To deliver results, we depend on you to provide accurate and timely information — including brand assets, content, product details, access to ad accounts and analytics, and approvals within agreed turnaround times.",
      "You confirm that you own or have the necessary rights to any materials, images, logos, copy, and data you supply to us, and that we may use them to deliver the services. Delays in providing access or approvals may shift timelines and, where agreed, affect fees.",
      "You are responsible for the claims, offers, and landing pages you approve, and for ensuring they comply with applicable law and the advertising policies of platforms such as Meta and Google.",
    ],
  },
  {
    heading: "Advertising platforms and results",
    paragraphs: [
      "Campaigns run on third-party platforms (including Meta, Google, TikTok, and others) and are subject to their terms, policies, approval processes, and algorithm changes, which we do not control.",
      "Marketing performance depends on many factors outside our control — market conditions, product quality, pricing, competition, and platform delivery. We do not guarantee any specific result, return on ad spend, ranking, revenue, or number of leads. Any figures shown on this site or in proposals are indicative, based on past client work, and are not a promise of future performance.",
      "You retain ownership of your ad accounts, pixels, and data. On request and on termination, we will hand over or return access as agreed in your proposal.",
    ],
  },
  {
    heading: "Fees and payment",
    paragraphs: [
      "Fees, payment schedules, and any retainer terms are agreed in your proposal or invoice. Unless stated otherwise, invoices are due within the period shown on the invoice and are payable in the currency stated.",
      "We may pause work on an account if an invoice is overdue, and reserves the right to charge interest or reasonable costs on late payment to the extent permitted by law. Taxes applicable to the services will be added where required.",
    ],
  },
  {
    heading: "Intellectual property",
    paragraphs: [
      "This website — including its design, text, graphics, logo, and code — is owned by or licensed to Sociolab and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from it without our prior written permission, except for sharing links to public pages.",
      "Ownership of final deliverables created specifically for you (such as ad creatives, copy, or a website) transfers to you once the related fees have been paid, as further detailed in your proposal. We retain the right to display non-confidential work in our portfolio and case studies unless you ask us not to.",
      "Third-party materials, fonts, stock assets, and open-source components remain subject to their own licences.",
    ],
  },
  {
    heading: "Confidentiality",
    paragraphs: [
      "Each party will keep the other's confidential information secret and use it only for the purposes of the engagement. Confidential information does not include information that is public, already known, independently developed, or required to be disclosed by law.",
      "We will not share your non-public business information with other clients or use it for purposes outside your engagement.",
    ],
  },
  {
    heading: "Term and termination",
    paragraphs: [
      "Engagements run for the period stated in your proposal, often on a month-to-month basis unless a fixed term is agreed. Either party may end an engagement as described in the proposal, subject to the notice period given.",
      "On termination, you will pay for work completed and any non-cancellable commitments made up to the termination date. Provisions relating to intellectual property, confidentiality, payment, and liability survive termination.",
    ],
  },
  {
    heading: "Disclaimers and limitation of liability",
    paragraphs: [
      "This website and its content are provided on an 'as is' and 'as available' basis, without warranties of any kind, express or implied, including warranties of accuracy, merchantability, fitness for a particular purpose, and non-infringement, to the fullest extent permitted by law.",
      "To the fullest extent permitted by law, Sociolab will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, revenue, data, or goodwill, arising out of or in connection with your use of this site or our services.",
      "Our total aggregate liability arising out of or in connection with an engagement will not exceed the total fees paid by you to us for the services giving rise to the claim in the twelve months before the claim arose. Nothing in these terms excludes liability that cannot be excluded by law.",
    ],
  },
  {
    heading: "Indemnity",
    paragraphs: [
      "You agree to indemnify and hold harmless Sociolab and its team from and against any claims, damages, losses, and expenses (including reasonable legal fees) arising out of your breach of these terms, your violation of any law or third-party right, or the materials and claims you supply for use in campaigns.",
    ],
  },
  {
    heading: "Links to other websites",
    paragraphs: [
      "This site may contain links to third-party websites or tools. We do not control and are not responsible for their content, privacy practices, or availability. Following a link is at your own risk.",
    ],
  },
  {
    heading: "Governing law",
    paragraphs: [
      "These terms are governed by the laws of the Islamic Republic of Pakistan, and its courts have exclusive jurisdiction over any dispute arising out of them, without prejudice to any mandatory consumer protections that may apply to you.",
    ],
  },
  {
    heading: "Changes to these terms",
    paragraphs: [
      "We may update these Terms of Service from time to time. The latest version will always be published on this page with an updated last-updated date. Continued use of the site after changes take effect constitutes acceptance of the revised terms. For material changes affecting an ongoing engagement, we will notify you directly where reasonable.",
    ],
  },
  {
    heading: "Contact us",
    paragraphs: [
      `Questions about these terms? Email us at ${site.email}.`,
      "Sociolab — Islamabad / Rawalpindi, Pakistan.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="November 2026"
      sections={sections}
    />
  );
}
