import type React from "react";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });
// const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tekurious - Learn Smarter, Score Better",
  description:
    "Comprehensive online learning platform for Indian school students. Video lectures, interactive notes, mind maps, quizzes, and previous year questions for all boards.",
  keywords: [
    "online learning",
    "education",
    "CBSE",
    "ICSE",
    "State Board",
    "video lectures",
    "quizzes",
    "exam preparation",
    "India",
  ],
  authors: [{ name: "Tekurious" }],
  openGraph: {
    title: "Tekurious - Learn Smarter, Score Better",
    description:
      "Comprehensive online learning platform for Indian school students",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
