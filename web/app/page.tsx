import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import DisciplinesGrid from "@/components/home/DisciplinesGrid";
import StatsSection from "@/components/home/StatsSection";
import CoachRail from "@/components/home/CoachRail";
import HomePricing from "@/components/home/HomePricing";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import GalleryGrid from "@/components/home/GalleryGrid";

export default function Home() {
  return (
    <div>
      <Hero />
      <Marquee />
      <DisciplinesGrid />
      <StatsSection />
      <CoachRail />
      <HomePricing />
      <TestimonialCarousel />
      <GalleryGrid />
    </div>
  );
}
