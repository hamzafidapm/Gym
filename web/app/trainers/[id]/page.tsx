import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TRAINERS, trainerById } from "@/lib/data";
import TrainerDetail from "@/components/trainers/TrainerDetail";

export function generateStaticParams() {
  return TRAINERS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const trainer = trainerById(id);
  if (!trainer) return {};
  return {
    title: trainer.name,
    description: `${trainer.name} coaches ${trainer.specialty.toLowerCase()} at IRONHAUS. ${trainer.short}`,
  };
}

export default async function TrainerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trainer = trainerById(id);
  if (!trainer) notFound();
  return <TrainerDetail trainer={trainer} />;
}
