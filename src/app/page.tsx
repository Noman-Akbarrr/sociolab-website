import { B2BHero } from "@/components/home/b2b-hero";
import { LogoStrip } from "@/components/home/logo-strip";
import { StrategicThesis } from "@/components/home/strategic-thesis";
import { Framework } from "@/components/home/framework";
import { CaseStudies } from "@/components/home/case-studies";
import { Capabilities } from "@/components/home/capabilities";
import { Onboarding } from "@/components/home/onboarding";
import { DiagnosticForm } from "@/components/home/diagnostic-form";
import { B2BFooter } from "@/components/home/b2b-footer";

export const metadata = {
  title: "Sociolab — Enterprise B2B Go-To-Market Architecture",
  description:
    "We unite positioning, demand generation, and sales architecture for companies with $20k to $250k ACVs. Turn pipeline confusion into measurable commercial momentum.",
  alternates: {
    canonical: "https://sociolab.com.pk",
  },
};

export default function HomePage() {
  return (
    <>
      <B2BHero />
      <LogoStrip />
      <StrategicThesis />
      <Framework />
      <CaseStudies />
      <Capabilities />
      <Onboarding />
      <DiagnosticForm />
      <B2BFooter />
    </>
  );
}
