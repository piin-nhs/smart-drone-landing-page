import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center tech-grid-bg relative px-4 overflow-hidden">
      {/* Vùng phát sáng neon ở nền */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-neon-glow rounded-full blur-[100px] md:blur-[150px] pointer-events-none z-0 transition-colors duration-500" />

      <div className="glassmorphism max-w-xl w-full p-8 rounded-2xl shadow-xl relative z-10 text-center">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-ping" />
            <span className="text-sm font-semibold tracking-widest uppercase text-neon-cyan">
              HELICORP • HeLiFly Project
            </span>
          </div>
          <ThemeToggle />
        </div>

        <div className="mb-6 flex justify-center">
          <span className="text-6xl animate-bounce">🛸</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent">
          Giai Đoạn 1: Setup Project Hoàn Tất!
        </h1>
        
        <p className="text-foreground/70 mb-6 leading-relaxed text-sm">
          Dự án Landing Page giới thiệu sản phẩm Drone thông minh đã khởi tạo thành công với Next.js App Router, Tailwind CSS v4, TypeScript và cơ chế chuyển đổi Light/Dark mode.
        </p>

        <div className="grid grid-cols-2 gap-4 text-left text-sm mb-6">
          <div className="p-3 bg-background/40 rounded-lg border border-card-border">
            <span className="block text-xs opacity-60">Framework</span>
            <span className="font-semibold text-foreground">Next.js 16 (React 19)</span>
          </div>
          <div className="p-3 bg-background/40 rounded-lg border border-card-border">
            <span className="block text-xs opacity-60">Styling</span>
            <span className="font-semibold text-foreground">Tailwind CSS v4</span>
          </div>
          <div className="p-3 bg-background/40 rounded-lg border border-card-border col-span-2">
            <span className="block text-xs opacity-60">Cấu trúc thư mục chuẩn</span>
            <span className="font-mono text-xs text-neon-cyan">
              /src: components, hooks, contexts, utils
            </span>
          </div>
        </div>

        <div className="text-xs text-foreground/50 border-t border-card-border pt-4">
          Hãy bấm thử nút đổi giao diện ở góc trên bên phải để cảm nhận sự thay đổi màu sắc của lưới nền và hiệu ứng phát sáng!
        </div>
      </div>
    </main>
  );
}
