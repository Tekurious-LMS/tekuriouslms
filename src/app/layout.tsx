import type { Metadata, Viewport } from "next";
import { Geist, Noto_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TenantProvider } from "@/contexts/TenantContext";

const notoSans = Noto_Sans({ variable: '--font-sans', subsets: ["latin"] });

const geist = Geist({ subsets: ["latin"] });

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
    <html lang="en" className={notoSans.variable} suppressHydrationWarning>
      <body className={`${geist.className} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TenantProvider>
            {children}
          </TenantProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

