import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SwiftFolio — AI Portfolio Generator",
  description: "Build stunning developer portfolios from GitHub, LeetCode & HackerRank in 30 seconds. 18 animated templates.",
  keywords: ["portfolio","developer","github","leetcode","AI","resume"],
  openGraph: {
    title: "SwiftFolio — AI Portfolio Generator",
    description: "Generate a stunning developer portfolio in 30 seconds",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-950 text-white antialiased">
        <Navbar />
        <main className="flex-grow pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
