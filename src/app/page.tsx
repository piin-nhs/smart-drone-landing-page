import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";

export default function Home() {
  return (
    <>
      {/* Tích hợp Header cố định ở đầu trang */}
      <Header />

      <main className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        {/* Tích hợp Hero Section */}
        <Hero />

        {/* Tích hợp Features (Scrollytelling & Parallax) Section */}
        <Features />
      </main>
    </>
  );
}
