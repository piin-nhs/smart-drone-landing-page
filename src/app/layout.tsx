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
    default: "HeLiFly - Next-Gen Smart Drone by HELICORP",
    template: "%s | HeLiFly",
  },
  description: "Experience the next-generation smart drone from HELICORP. Featuring 8K Ultra HD video, exceptional flight times, and advanced AI integration.",
  keywords: ["smart drone", "Helicorp", "HeLiFly", "FPV drone", "professional drone", "aerial photography", "autonomous flight"],
  authors: [{ name: "HELICORP Team" }],
  creator: "HELICORP",
  openGraph: {
    title: "HeLiFly - Next-Gen Smart Drone by HELICORP",
    description: "Experience the next-generation smart drone from HELICORP. Featuring 8K Ultra HD video, exceptional flight times, and advanced AI integration.",
    url: "https://smart-drone-landing-page.vercel.app",
    siteName: "HeLiFly",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/hero-drone.webp",
        width: 1200,
        height: 675,
        alt: "HeLiFly Smart Drone - Elevate Your Vision",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HeLiFly - Next-Gen Smart Drone by HELICORP",
    description: "Experience the next-generation smart drone from HELICORP. Featuring 8K Ultra HD video, exceptional flight times, and advanced AI integration.",
    images: ["/images/hero-drone.webp"],
    creator: "@helicorp",
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

