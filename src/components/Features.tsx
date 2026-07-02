"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Features() {
  const features = [
    {
      title: "46 MIN FLIGHT TIME",
      desc: "Fly farther and capture more with an intelligent, long-lasting battery."
    },
    {
      title: "4K/60FPS HDR CAMERA",
      desc: "Shoot breathtaking ultra-HD footage with exceptional color and detail."
    },
    {
      title: "FULL-RANGE DETECTION",
      desc: "Advanced sensors ensure safe, smooth navigation in every direction."
    },
    {
      title: "WIND RESISTANCE",
      desc: "Steady and precise, even in strong winds."
    }
  ];

  return (
    <section
      id="features"
      className="py-24 md:py-32 w-full relative overflow-hidden bg-background text-foreground transition-colors duration-300 "
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Tiêu đề góc trái trên */}
        <div className="mb-16 md:mb-20 text-left">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-7xl font-normal tracking-normal leading-[0.9] uppercase font-bebas"
          >
            REDEFINING <br /> FLIGHT PRECISION
          </motion.h2>
        </div>

        {/* Khung nội dung chính chia 2 cột */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Cột trái: Ảnh Drone (chiếm 5/12 cột) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="md:col-span-5 flex justify-center md:justify-start select-none"
          >
            <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center">
              {/* Vòng tròn Radar HUD quay chậm ở nền */}
              <div className="absolute inset-2 rounded-full border border-dashed border-foreground/10 animate-[spin_40s_linear_infinite] pointer-events-none" />
              <div className="absolute inset-8 rounded-full border border-foreground/[0.04] pointer-events-none" />
              <div className="absolute inset-20 rounded-full border border-foreground/15 border-r-transparent border-l-transparent animate-[spin_15s_linear_infinite] pointer-events-none" />
              
              {/* Thước ngắm chữ thập trung tâm */}
              <div className="absolute w-8 h-[1px] bg-foreground/15 pointer-events-none" />
              <div className="absolute h-8 w-[1px] bg-foreground/15 pointer-events-none" />
              
              {/* Dữ liệu Telemetry giả lập */}
              <div className="absolute top-4 left-4 text-[9px] font-mono tracking-wider text-foreground/30 leading-relaxed pointer-events-none hidden sm:block text-left">
                ALT: 154.2 M <br />
                DIST: 1.28 KM
              </div>
              <div className="absolute bottom-4 right-4 text-[9px] font-mono tracking-wider text-foreground/30 leading-relaxed pointer-events-none hidden sm:block text-right">
                PITCH: +2.4° <br />
                ROLL: 0.0°
              </div>

              <Image
                src="/images/features-drone.webp"
                alt="HeLiFly VeloX Drone"
                width={500}
                height={500}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 500px"
                className="object-contain filter brightness-[1.02] relative z-10"
              />
            </div>
          </motion.div>

          {/* Cột phải: Grid tính năng & Đoạn tổng kết (chiếm 7/12 cột) */}
          <div className="md:col-span-7 flex flex-col justify-start">
            {/* Grid 2x2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 md:gap-y-12">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex flex-col gap-2 text-left"
                >
                  <h3 className="text-xl sm:text-2xl font-normal tracking-normal uppercase font-bebas text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-foreground/50 leading-relaxed max-w-[280px]">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Đoạn mô tả chân mục */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 md:mt-12 text-left max-w-xl"
            >
              <p className="text-xs sm:text-[13px] text-foreground/55 leading-relaxed font-sans">
                Experience the ultimate in aerial innovation with the HeLiFly X1, crafted for flawless control, stunning visuals, and reliable flight stability.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
