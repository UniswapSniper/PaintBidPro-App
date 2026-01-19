import { Inter, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "PaintBidPro | The Future of Painting Estimates",
  description: "Stop measuring walls by hand. PaintBidPro uses LIDAR technology and AI to generate hyper-accurate painting quotes in seconds. Win more jobs with professional bids.",
  keywords: ["painting estimates", "LIDAR scanning", "AI painting quotes", "painting business software"],
  openGraph: {
    title: "PaintBidPro | AI-Powered Painting Estimates",
    description: "Instant residential and commercial painting bids powered by LIDAR & AI.",
    images: ["/hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PaintBidPro | AI-Powered Painting Estimates",
    description: "Instant painting bids powered by LIDAR & AI.",
    images: ["/hero.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} antialiased selection:bg-blue-500/30`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
