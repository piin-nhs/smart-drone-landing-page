"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

import type { ToastType, ToastItem, ToastContextType } from "@/types/toast";

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  React.useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 15) {
        setIsHeaderVisible(true);
      } else {
        if (currentScrollY > lastScrollY) {
          setIsHeaderVisible(false);
        } else {
          setIsHeaderVisible(true);
        }
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Container chứa các Toast */}
      <div className={`fixed left-4 right-4 sm:left-auto sm:right-6 sm:w-full sm:max-w-[360px] z-[999] flex flex-col gap-3 pointer-events-none transition-all duration-300 ${isHeaderVisible ? "top-24" : "top-6"}`}>
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === "success";
            const isWarning = toast.type === "warning";

            // Cấu hình Icon
            let Icon = Info;
            if (isSuccess) Icon = CheckCircle2;
            if (isWarning) Icon = AlertTriangle;

            // Cấu hình viền neon & nền
            let iconColor = "text-cyan-500 dark:text-cyan-400";
            let progressBg = "bg-cyan-500 dark:bg-cyan-400";
            let borderClass = "border-cyan-500/20 dark:border-cyan-400/20";
            let shadowClass = "shadow-[0_4px_20px_rgba(8,145,178,0.06)]";

            if (isSuccess) {
              iconColor = "text-emerald-500 dark:text-emerald-400";
              progressBg = "bg-emerald-500 dark:bg-emerald-400";
              borderClass = "border-emerald-500/20 dark:border-emerald-400/20";
              shadowClass = "shadow-[0_4px_20px_rgba(16,185,129,0.06)]";
            } else if (isWarning) {
              iconColor = "text-amber-500 dark:text-amber-400";
              progressBg = "bg-amber-500 dark:bg-amber-400";
              borderClass = "border-amber-500/20 dark:border-amber-400/20";
              shadowClass = "shadow-[0_4px_20px_rgba(245,158,11,0.06)]";
            }

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                layout
                className={`w-full pointer-events-auto bg-card/95 backdrop-blur-md border ${borderClass} ${shadowClass} p-4 rounded-none flex items-start gap-3 relative overflow-hidden`}
              >
                {/* Thanh chạy thời gian tự hủy ở đáy Toast */}
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 4, ease: "linear" }}
                  className={`absolute bottom-0 left-0 h-[2px] ${progressBg}`}
                />

                <Icon className={`w-4.5 h-4.5 flex-shrink-0 mt-0.5 ${iconColor}`} />
                <div className="flex-1 text-[11px] font-semibold text-foreground/80 dark:text-foreground/90 leading-relaxed font-sans pr-4">
                  {toast.message}
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="absolute top-3 right-3 text-foreground/40 hover:text-foreground/80 cursor-pointer"
                  aria-label="Close Notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast phải được sử dụng trong ToastProvider");
  }
  return context;
}
