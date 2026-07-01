import { Header } from "@/components/Header";

export default function Home() {
  return (
    <>
      {/* Tích hợp Header cố định ở đầu trang */}
      <Header />
      
      <main className="min-h-screen flex flex-col items-center justify-center tech-grid-bg relative px-4 overflow-hidden pt-28">
        {/* Vùng phát sáng neon ở nền */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-neon-glow rounded-full blur-[100px] md:blur-[150px] pointer-events-none z-0 transition-colors duration-500" />

        <div className="glassmorphism max-w-xl w-full p-8 rounded-2xl shadow-xl relative z-10 text-center my-12">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-ping" />
              <span className="text-sm font-semibold tracking-widest uppercase text-neon-cyan">
                HELICORP • HeLiFly Project
              </span>
            </div>
          </div>

          <div className="mb-6 flex justify-center">
            <span className="text-6xl animate-bounce">🛸</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent">
            Kiểm Tra Thiết Kế Header
          </h1>
          
          <p className="text-foreground/70 mb-6 leading-relaxed text-sm">
            Header bám dính (sticky) đã được tích hợp lên trang chủ. Hãy thử cuộn chuột xuống dưới hoặc đổi chế độ Sáng/Tối để kiểm nghiệm hiệu ứng.
          </p>

          <div className="grid grid-cols-2 gap-4 text-left text-sm mb-6">
            <div className="p-3 bg-background/40 rounded-lg border border-card-border">
              <span className="block text-xs opacity-60">Trạng thái Header</span>
              <span className="font-semibold text-neon-cyan">Đang hiển thị ở đầu trang</span>
            </div>
            <div className="p-3 bg-background/40 rounded-lg border border-card-border">
              <span className="block text-xs opacity-60">Vị trí</span>
              <span className="font-semibold text-foreground">Sticky (Bám dính)</span>
            </div>
          </div>

          <div className="text-xs text-foreground/50 border-t border-card-border pt-4">
            Cuộn chuột thử xuống dưới để xem Header chuyển sang trạng thái kính mờ glassmorphism!
          </div>
        </div>

        {/* Khung đệm tạo chiều cao để kiểm tra tính năng cuộn (scroll) */}
        <div className="h-[80vh] flex items-center justify-center relative z-10">
          <p className="text-sm font-mono opacity-40 animate-pulse">
            [ Khu vực cuộn trang kiểm thử Header - Bạn đang ở giữa trang ]
          </p>
        </div>
      </main>
    </>
  );
}
