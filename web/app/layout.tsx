import type { Metadata } from "next";
import { Archivo, Archivo_Black, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/lib/AppStateContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import ScrollProgress from "@/components/ScrollProgress";
import ToastHost from "@/components/ToastHost";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ironhaus.fit"),
  title: {
    default: "IRONHAUS — Strength & Conditioning Studio | Book Gym Classes in Austin",
    template: "%s | IRONHAUS",
  },
  description:
    "IRONHAUS is a strength, HIIT, boxing and yoga studio in East Austin. Book classes, meet certified trainers, and start a free 7-day trial today.",
  openGraph: {
    title: "IRONHAUS — Strength & Conditioning Studio in Austin",
    description:
      "Book strength, HIIT, boxing and yoga classes with certified coaches. Free 7-day trial.",
    type: "website",
    url: "https://ironhaus.fit/",
  },
  twitter: {
    card: "summary_large_image",
    title: "IRONHAUS — Train Heavier. Recover Smarter.",
    description: "East Austin strength studio. 40+ weekly classes. Free 7-day trial.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthClub",
  name: "IRONHAUS",
  description:
    "Strength and conditioning studio offering weight training, HIIT, boxing, yoga and personal training.",
  url: "https://ironhaus.fit/",
  telephone: "+1-512-555-0148",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1408 E 6th St",
    addressLocality: "Austin",
    addressRegion: "TX",
    postalCode: "78702",
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: 30.2655, longitude: -97.7278 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "05:30",
      closes: "22:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "07:00",
      closes: "19:00",
    },
  ],
  priceRange: "$$",
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "412" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${archivoBlack.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AppStateProvider>
          <ScrollProgress />
          <Header />
          <main style={{ paddingTop: 78, minHeight: "100vh" }}>{children}</main>
          <Footer />
          <FloatingActions />
          <ToastHost />
        </AppStateProvider>
      </body>
    </html>
  );
}
