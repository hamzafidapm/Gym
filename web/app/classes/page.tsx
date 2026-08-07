import { Suspense } from "react";
import type { Metadata } from "next";
import ClassesView from "@/components/classes/ClassesView";

export const metadata: Metadata = {
  title: "Class Schedule",
  description:
    "Browse this week's strength, HIIT, boxing, yoga, cycle and mobility classes at IRONHAUS. Filter by type or coach and book a spot in seconds.",
};

export default function ClassesPage() {
  return (
    <Suspense fallback={null}>
      <ClassesView />
    </Suspense>
  );
}
