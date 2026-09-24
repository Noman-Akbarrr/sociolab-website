import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Performance Marketing | Sociolab",
};

export default function PaidAcquisitionPage() {
  redirect("/services/performance-marketing");
}
