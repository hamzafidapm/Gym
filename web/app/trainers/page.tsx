import type { Metadata } from "next";
import TrainersGrid from "@/components/trainers/TrainersGrid";

export const metadata: Metadata = {
  title: "Coaches",
  description:
    "Meet the IRONHAUS coaching staff — certified trainers in strength, HIIT, boxing, yoga, cycle and rehab, each running their own weekly classes in East Austin.",
};

export default function TrainersPage() {
  return <TrainersGrid />;
}
