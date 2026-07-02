"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  "Tư vấn HeLiFly X3 Max",
  "Lấy mã giảm giá 15% ở đâu?",
  "Chế độ lái thử 3D là gì?",
  "Drone rẻ nhất là dòng nào?",
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Xin chào Quý khách! Tôi là HeLiBot - Trợ lý AI của thương hiệu máy bay không người lái HELICORP. Tôi có thể hỗ trợ thông tin gì về các dòng Drone HeLiFly hay các công nghệ bay cho Quý khách hôm nay?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống cuối danh sách tin nhắn
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Hiển thị bong bóng nhắc nhỏ sau 5 giây nếu chưa mở chat lần nào
  useEffect(() => {
    const isFirstTime = !sessionStorage.getItem("helibot_opened");
    if (isFirstTime) {
      const timer = setTimeout(() => {
        setHasNewMessage(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleOpenChat = () => {
    setIsOpen(true);
    setHasNewMessage(false);
    sessionStorage.setItem("helibot_opened", "true");
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmedText = textToSend.trim();
    if (!trimmedText || isLoading) return;

    // 1. Thêm tin nhắn của user vào state
    const userMsg: Message = { role: "user", content: trimmedText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Gửi lịch sử tin nhắn lên API trung gian
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();

      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        throw new Error(data.message || "Lỗi xử lý phản hồi.");
      }
    } catch (error: any) {
      console.error("Lỗi giao tiếp chatbot:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Rất tiếc, HeLiBot đang gặp sự cố kết nối tạm thời. Quý khách vui lòng thử gửi lại tin nhắn sau ít phút.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Hỗ trợ render chữ in đậm và xuống dòng Markdown đơn giản
  const renderMessageContent = (text: string) => {
    return text.split("\n").map((line, lineIdx) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={lineIdx} className="mb-1 last:mb-0">
          {parts.map((part, partIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={partIdx} className="font-extrabold text-foreground">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex flex-col items-end pointer-events-none">
      {/* 1. HỘP THOẠI CHAT (CHAT WINDOW) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full sm:w-[380px] h-[480px] sm:h-[550px] max-h-[calc(100vh-120px)] bg-card/95 backdrop-blur-md border border-card-border shadow-[0_12px_40px_rgba(0,0,0,0.15)] flex flex-col rounded-none overflow-hidden mb-4 pointer-events-auto"
          >
            {/* Header Hộp Thoại */}
            <div className="p-4 border-b border-card-border bg-[#111] dark:bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/10 dark:bg-foreground/5 flex items-center justify-center relative border border-white/10 dark:border-foreground/10 rounded-none">
                  <Bot className="w-5 h-5 text-white dark:text-foreground" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#111] dark:border-card rounded-full animate-pulse" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black tracking-widest text-white dark:text-foreground uppercase flex items-center gap-1.5">
                    HELIBOT ASSISTANT
                  </h4>
                  <span className="text-[10px] text-white/50 dark:text-foreground/40 font-semibold font-sans uppercase">
                    Hỗ trợ trực tuyến 24/7
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 dark:hover:bg-foreground/5 text-white/70 dark:text-foreground/60 hover:text-white dark:hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Danh Sách Tin Nhắn */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-background/30 custom-scrollbar">
              {messages.map((msg, idx) => {
                const isBot = msg.role === "assistant";
                return (
                  <div
                    key={idx}
                    className={`flex gap-3 max-w-[85%] ${isBot ? "self-start" : "self-end flex-row-reverse"
                      }`}
                  >
                    {/* Avatar icon */}
                    <div
                      className={`w-7 h-7 flex-shrink-0 flex items-center justify-center border text-xs ${isBot
                        ? "bg-foreground/5 text-foreground/70 border-foreground/10"
                        : "bg-foreground text-background border-transparent"
                        }`}
                    >
                      {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>

                    {/* Nội dung bong bóng chat */}
                    <div
                      className={`p-3 text-[12px] leading-relaxed font-sans text-left border ${isBot
                        ? "bg-card border-card-border text-foreground/90 shadow-sm"
                        : "bg-foreground text-background border-transparent"
                        }`}
                    >
                      {renderMessageContent(msg.content)}
                    </div>
                  </div>
                );
              })}

              {/* Hiệu ứng gõ chữ khi AI đang phản hồi */}
              {isLoading && (
                <div className="flex gap-3 max-w-[85%] self-start">
                  <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-foreground/5 text-foreground/70 border border-foreground/10 text-xs">
                    <Bot className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div className="p-3 bg-card border border-card-border text-foreground/60 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce delay-[0ms]" />
                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce delay-[150ms]" />
                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce delay-[300ms]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Gợi Ý Câu Hỏi Nhanh (Suggestions) */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 py-2 bg-background/40 border-t border-card-border flex flex-col gap-1.5 text-left">
                <span className="text-[10px] text-foreground/40 font-bold tracking-wider font-sans uppercase">
                  Câu hỏi gợi ý:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sug)}
                      className="text-[11px] font-sans font-semibold border border-foreground/10 hover:border-foreground/35 px-2.5 py-1 bg-card hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-all cursor-pointer whitespace-nowrap"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ô Nhập Tin Nhắn */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-3 border-t border-card-border bg-card flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                disabled={isLoading}
                className="flex-1 h-10 px-3 bg-background border border-card-border text-xs text-foreground focus:outline-none focus:border-foreground/30 disabled:opacity-50 font-sans"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-[#111] dark:bg-white hover:bg-foreground/80 dark:hover:bg-foreground/80 text-white dark:text-black flex items-center justify-center cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 rounded-none"
                aria-label="Send Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. NÚT TRÒN BONG BÓNG KÍCH HOẠT (FLOATING TRIGGER BUTTON) */}
      <div className="relative pointer-events-auto">
        <button
          onClick={isOpen ? () => setIsOpen(false) : handleOpenChat}
          className="w-12 h-12 rounded-none bg-[#111] dark:bg-white text-white dark:text-black border border-transparent shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer z-50 relative"
          aria-label="Toggle AI Assistant"
        >
          {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
        </button>

        {/* Bong bóng nhắc nhở tin nhắn mới từ HeLiBot */}
        <AnimatePresence>
          {hasNewMessage && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 10 }}
              className="absolute bottom-14 right-0 w-64 bg-card border border-card-border p-3 shadow-xl pointer-events-auto text-left rounded-none font-sans"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">
                  Trợ lý HeLiBot
                </span>
              </div>
              <p className="text-[11px] text-foreground/80 leading-relaxed">
                Xin chào! Tôi có thể hỗ trợ Quý khách giải đáp thắc mắc về Drone HeLiFly không?
              </p>
              <button
                onClick={handleOpenChat}
                className="mt-2 text-[10px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                Trò chuyện ngay &rarr;
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
