import type { Metadata } from "next";
import DashboardView from "@/components/dashboard/DashboardView";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
  description: "Manage your IRONHAUS bookings, membership and training progress.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
