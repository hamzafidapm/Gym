import type { Metadata } from "next";
import PricingView from "@/components/pricing/PricingView";

export const metadata: Metadata = {
  title: "Membership & Pricing",
  description:
    "Basic, Premium and Elite membership at IRONHAUS. No contracts, cancel any time. Compare plans and start your free 7-day trial.",
};

export default function PricingPage() {
  return <PricingView />;
}
