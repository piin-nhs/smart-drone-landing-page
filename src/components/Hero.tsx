"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FiLinkedin, FiGithub, FiFacebook, FiInstagram } from "react-icons/fi";

export function Hero() {
  const socialLinks = [
    {
      name: "linkedin",
      icon: <FiLinkedin strokeWidth={1.8} className="w-[15px] h-[15px]" />,
      url: "https://www.linkedin.com/in/piin-nhs/"
    },
    {
      name: "twitter",
      icon: <FiGithub strokeWidth={1.8} className="w-[15px] h-[15px]" />,
      url: "https://github.com/piin-nhs"
    },
    {
      name: "facebook",
      icon: <FiFacebook strokeWidth={1.8} className="w-[15px] h-[15px]" />,
      url: "https://www.facebook.com/piin.nhs"
    },
    {
      name: "instagram",
      icon: <FiInstagram strokeWidth={1.8} className="w-[15px] h-[15px]" />,
      url: "https://www.instagram.com/piin_nhs/"
    },
  ];

  return (
    <section
      id="hero"
      className="min-h-[75vh] lg:min-h-screen w-full relative flex flex-col items-center justify-center gap-6 md:gap-12 pt-28 pb-12 overflow-hidden tech-grid-bg"
    >
      {/* Glow trắng spotlight trung tâm */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] md:w-[640px] h-[240px] md:h-[480px] rounded-full pointer-events-none z-10"
        style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 45%, transparent 70%)" }}
      />

      {/* Cột mạng xã hội bên phải */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-30"
      >
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full border border-foreground/10 hover:border-foreground/25 flex items-center justify-center transition-all duration-300 text-foreground/60 hover:text-foreground hover:bg-foreground/5 hover:scale-105"
            aria-label={social.name}
          >
            {social.icon}
          </a>
        ))}
      </motion.div>

      {/* Dòng chữ chìm ở nền */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <h2 className="text-[14vw] font-black tracking-[-0.04em] text-center uppercase text-black/[0.09] dark:text-white/[0.14] leading-[0.82] font-sans flex flex-col items-center">
          <span>EXPLORE</span>
          <span>THE FUTURE</span>
          <span>OF FLIGHT</span>
        </h2>
      </div>

      {/* CỤM DRONE TRUNG TÂM */}
      <div className="relative w-full flex flex-col items-center justify-center z-20 px-0">
        {/* Ảnh Drone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
          transition={{
            opacity: { duration: 1.2 },
            scale: { duration: 1.2 },
            y: {
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut"
            }
          }}
          className="relative w-full flex items-center justify-center cursor-pointer select-none"
        >
          <Image
            src="/images/hero-drone.webp"
            alt="PIIN-NHS Smart Drone VeloX"
            width={3200}
            height={720}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            style={{ width: "100%", height: "auto", maxHeight: "65vh", objectFit: "contain" }}
            className="drop-shadow-[0_15px_30px_rgba(0,0,0,0.22)] dark:drop-shadow-[0_15px_35px_rgba(255,255,255,0.45)] filter brightness-105 hover:brightness-110 transition-all duration-300"
          />
        </motion.div>

        {/* Bóng mờ 3D dưới mặt đất */}
        <motion.div
          animate={{
            scale: [1, 0.85, 1],
            opacity: [0.3, 0.12, 0.3],
            filter: ["blur(8px)", "blur(12px)", "blur(8px)"]
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut"
          }}
          className="w-[180px] sm:w-[260px] h-[8px] bg-black/55 dark:bg-cyan-950/55 rounded-full pointer-events-none mt-2 shadow-2xl"
        />
      </div>

      {/* CỤM NÚT CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex flex-wrap items-center justify-center gap-2 relative z-30"
      >
        <a
          href="#products"
          className="px-9 py-3 rounded-full border border-foreground/15 hover:border-foreground/35 bg-background/40 hover:bg-foreground/5 text-xs font-bold tracking-widest transition-all duration-300 text-foreground cursor-pointer font-sans"
        >
          Shop Now
        </a>

        <a
          href="#features"
          className="w-12 h-12 rounded-full border border-foreground/15 hover:border-foreground/35 bg-background/40 hover:bg-foreground/5 flex items-center justify-center transition-all duration-300 text-foreground cursor-pointer hover:scale-105"
          aria-label="View Features"
        >
          <ArrowRight className="w-4 h-4 stroke-[1.8]" />
        </a>
      </motion.div>

    </section>
  );
}
