import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <>
      {/* Tích hợp Header cố định ở đầu trang */}
      <Header />

      <main className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        {/* Tích hợp Hero Section */}
        <Hero />
      </main>
    </>
  );
}
