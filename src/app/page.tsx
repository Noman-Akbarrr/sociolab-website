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
  title: "Sociolab — Digital Marketing Agency Pakistan",
  description:
    "Full-service digital marketing agency helping brands grow through performance marketing, social media management, and high-converting websites.",
  alternates: {
    canonical: "https://sociolab.com.pk",
  },
};

export default function HomePage() {
  return (
    <div className="light-page">
      <B2BHero />
      <LogoStrip />
      <StrategicThesis />
      <Framework />
      <CaseStudies />
      <Capabilities />
      <Onboarding />
      <DiagnosticForm />
      <B2BFooter />
    </div>
  );
}
