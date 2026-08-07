import { Suspense } from "react";
import type { Metadata } from "next";
import JoinView from "@/components/join/JoinView";

export const metadata: Metadata = {
  title: "Start Your Free Trial",
  description:
    "Join IRONHAUS in four quick steps — your info, a plan, an optional first class, and a free 7-day trial. No contracts, cancel any time.",
};

export default function JoinPage() {
  return (
    <Suspense fallback={null}>
      <JoinView />
    </Suspense>
  );
}
