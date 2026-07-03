import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";

const Features = dynamic(() => import("@/components/Features").then((mod) => mod.Features), {
  ssr: false,
});

const HowToFly = dynamic(() => import("@/components/HowToFly").then((mod) => mod.HowToFly));

const ProductCatalog = dynamic(() => import("@/components/ProductCatalog").then((mod) => mod.ProductCatalog), {
  ssr: false,
});

const Footer = dynamic(() => import("@/components/Footer").then((mod) => mod.Footer));

const ClientWidgets = dynamic(() => import("@/components/ClientWidgets").then((mod) => mod.ClientWidgets), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <Hero />
        <Features />
        <HowToFly />
        <ProductCatalog />
      </main>
      <Footer />
      <ClientWidgets />
    </>
  );
}
