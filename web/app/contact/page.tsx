import type { Metadata } from "next";
import ContactView from "@/components/contact/ContactView";

export const metadata: Metadata = {
  title: "Visit Us",
  description:
    "Visit IRONHAUS at 1408 E 6th St, Austin TX. Hours, phone, social and a contact form — we answer within one business day.",
};

export default function ContactPage() {
  return <ContactView />;
}
