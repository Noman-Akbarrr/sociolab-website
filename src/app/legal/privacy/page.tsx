import type { Metadata } from "next";
import { site } from "@/lib/site";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Sociolab collects, uses, and protects your information when you use sociolab.com.pk, contact us, or work with us.",
  alternates: {
    canonical: `${site.url}/legal/privacy`,
  },
};

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      `Sociolab is a digital marketing agency based in Islamabad / Rawalpindi, Pakistan. This Privacy Policy explains what personal information we collect through ${site.domain}, how we use it, and the choices you have. When we refer to "we", "us", or "Sociolab", we mean the team operating this website and delivering our services.`,
    ],
  },
  {
    heading: "Information you give us",
    paragraphs: [
      "When you submit a contact form, request a free audit, message us on WhatsApp, or email us, you may provide your name, email address, company or website, WhatsApp / phone number, the service you are interested in, and the contents of your message.",
      "If you become a client, we may additionally collect billing details, contract information, and the assets and access credentials needed to run your campaigns (for example, ad account permissions, pixel access, or domain verification).",
      "We do not ask for sensitive personal data such as national ID numbers, financial card details, or health information through this website.",
    ],
  },
  {
    heading: "Information collected automatically",
    paragraphs: [
      "Like most websites, we collect basic technical data when you visit — pages viewed, referring URL, browser type, device type, approximate location, and time of visit. This is used to understand how the site performs and where visitors come from.",
      "We use analytics and advertising tools that place cookies or similar technologies. These may include Google Analytics, Microsoft Clarity, Plausible, Meta (Facebook) pixel, and Google Ads. Where consent is required, non-essential cookies are only used after you accept them.",
      "If you have submitted a form before, advertising platforms may use hashed identifiers to show you relevant Sociolab ads and to measure conversions. We do not receive your browsing history from these platforms.",
    ],
  },
  {
    heading: "How we use your information",
    paragraphs: [
      "We use the information we collect to respond to your enquiry, prepare and send your audit or proposal, deliver and manage client services, send project updates and invoices, improve this website, and comply with legal obligations.",
      "We do not sell your personal information. We do not rent, trade, or share your contact details with third parties for their own marketing.",
    ],
  },
  {
    heading: "Who we share it with",
    paragraphs: [
      "We share data only with the service providers needed to run our business and this website — for example, hosting providers, email and messaging tools, analytics and advertising platforms, payment processors, and our internal CRM where enquiry details are stored.",
      "These providers process data on our behalf under their own terms and privacy policies. We may also disclose information if required by law, regulation, or legal process, or to protect the rights, safety, and property of Sociolab or others.",
      "If our business is reorganised, merged, or acquired, your information may be transferred as part of that transaction, subject to this policy.",
    ],
  },
  {
    heading: "Advertising and conversion tracking",
    paragraphs: [
      "As a performance marketing agency, our site itself uses the same measurement tools we implement for clients. Meta CAPI and Google Enhanced Conversions may send hashed or aggregated event data (such as a page view or form submission) back to those platforms so we can attribute enquiries accurately.",
      "You can opt out of personalised advertising through the ad settings of Meta, Google, and other platforms, and can control cookies through our cookie banner and your browser settings.",
    ],
  },
  {
    heading: "How long we keep it",
    paragraphs: [
      "Enquiry and contact form submissions are kept for up to 24 months so we can follow up and understand demand, unless you ask us to delete them sooner. Client records are kept for the duration of the engagement and for as long as needed to meet tax, accounting, and legal requirements.",
      "When data is no longer needed, we delete it or anonymise it.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      "You can ask us for a copy of the personal information we hold about you, request corrections, ask us to delete it, or object to how we use it. You can also withdraw consent at any time where processing is based on consent.",
      "To exercise any of these rights, email us at the address below. We will respond within a reasonable time and in any case within 30 days. We may need to verify your identity before acting on a request.",
      "You may also unsubscribe from any marketing email we send using the link in that email.",
    ],
  },
  {
    heading: "Data security",
    paragraphs: [
      "We take reasonable technical and organisational measures to protect your information — including access controls, encryption in transit, and restricting internal access to people who need it to do their jobs.",
      "No method of transmission or storage is completely secure, so we cannot guarantee absolute security, but we review our practices regularly.",
    ],
  },
  {
    heading: "International visitors",
    paragraphs: [
      "We are based in Pakistan and process data there. Some of the tools we use store data on servers outside Pakistan, including in the United States and European Union. By using this site, you understand that your information may be processed in these locations under the safeguards provided by each provider.",
    ],
  },
  {
    heading: "Children's privacy",
    paragraphs: [
      "This website and our services are directed at businesses, not children. We do not knowingly collect personal information from anyone under 16. If you believe a child has provided us with information, contact us and we will delete it.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. The latest version will always be published on this page with an updated last-updated date. Material changes will be highlighted on this page or communicated to clients directly.",
    ],
  },
  {
    heading: "Contact us",
    paragraphs: [
      `Questions about this policy or your data? Email us at ${site.email}.`,
      "Sociolab — Islamabad / Rawalpindi, Pakistan.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="November 2026"
      sections={sections}
    />
  );
}
