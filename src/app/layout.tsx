import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { EcomProvider } from "@/contexts/EcomContext";
import { ToastProvider } from "@/contexts/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0b0f19",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "HELIFLY - Smart Drone",
    template: "%s | HELIFLY",
  },
  description: "Experience the smart drone from HELIFLY. Featuring 8K Ultra HD video, exceptional flight times, and advanced AI integration.",
  keywords: ["smart drone", "HELIFLY", "HeLiFly", "FPV drone", "professional drone", "aerial photography", "autonomous flight"],
  authors: [{ name: "HELIFLY Team" }],
  creator: "HELIFLY",
  openGraph: {
    title: "HELIFLY - Smart Drone",
    description: "Experience the smart drone from HELIFLY. Featuring 8K Ultra HD video, exceptional flight times, and advanced AI integration.",
    url: "https://smart-drone-landing-page.vercel.app",
    siteName: "HELIFLY",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/hero-drone.webp",
        width: 1200,
        height: 675,
        alt: "HELIFLY Smart Drone - Elevate Your Vision",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HELIFLY - Smart Drone",
    description: "Experience the smart drone from HELIFLY. Featuring 8K Ultra HD video, exceptional flight times, and advanced AI integration.",
    images: ["/images/hero-drone.webp"],
    creator: "@helifly",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          <EcomProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </EcomProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

