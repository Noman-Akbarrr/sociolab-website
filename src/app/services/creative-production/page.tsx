import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Social Media Management | Sociolab",
};

export default function CreativeProductionPage() {
  redirect("/services/social-media");
}
