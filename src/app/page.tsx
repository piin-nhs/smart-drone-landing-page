import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { ProductCatalog } from "@/components/ProductCatalog";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { BehaviorTracker } from "@/components/BehaviorTracker";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <Hero />
        <Features />
        <ProductCatalog />
      </main>
      <Footer />
      <CartDrawer />
      <BehaviorTracker />
    </>
  );
}
