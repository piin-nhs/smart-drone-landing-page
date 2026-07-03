"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FeatureItem, TelemetryData } from "@/types";

const FEATURES_DATA: FeatureItem[] = [
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



const BASE_TELEMETRY: TelemetryData = {
  topLeft: "BATT: 98%\nCELLS: 4S LIPO",
  topRight: "ALT: 154.2 M\nDIST: 1.28 KM",
  bottomLeft: "TEMP: 32°C\nSTATUS: FLYING",
  bottomRight: "SPEED: 45 KM/H\nTIME: 46 MIN"
};

// Drone rotation, scale and translation values for each scrollytelling step
const DRONE_TRANSFORMS = [
  { scale: 1.0, rotate: 0, x: 0, y: 0 },       // Standard flight view
  { scale: 1.25, rotate: 18, x: -15, y: 20 },   // Zooming on camera
  { scale: 1.1, rotate: 45, x: 0, y: 0 },       // Scanning rotation
  { scale: 1.15, rotate: -25, x: 10, y: -5 }    // Tilting/combating wind
];

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [liveTelemetry, setLiveTelemetry] = useState<TelemetryData>(BASE_TELEMETRY);
  const wasStickyRef = useRef(false);
  const [isScrollingToTop, setIsScrollingToTop] = useState(false);
  const isScrollingToTopRef = useRef(false);

  // Listen to scrolling to trigger scrollytelling steps and dispatch UI/UX immersion events
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;

      if (totalScrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      const stepIndex = Math.min(
        FEATURES_DATA.length - 1,
        Math.floor(progress * FEATURES_DATA.length)
      );

      setActiveStep(stepIndex);

      // Immersive UI/UX toggle (Hide widgets inside story, skip if navigating)
      const isSticky = rect.top <= 10 && rect.bottom >= window.innerHeight - 10;
      const shouldHideWidgets = isSticky && !(window as any).isNavScrolling && !isScrollingToTopRef.current;

      if (shouldHideWidgets !== wasStickyRef.current) {
        wasStickyRef.current = shouldHideWidgets;
        window.dispatchEvent(
          new CustomEvent("scrollytelling-state", { detail: { active: shouldHideWidgets } })
        );
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.dispatchEvent(
        new CustomEvent("scrollytelling-state", { detail: { active: false } })
      );
    };
  }, []);

  // Listen to scroll to top trigger to temporarily toggle height
  useEffect(() => {
    const handleScrollToTopTrigger = (e: Event) => {
      const customEvent = e as CustomEvent;
      const active = !!customEvent.detail?.active;
      setIsScrollingToTop(active);
      isScrollingToTopRef.current = active;
    };
    window.addEventListener("scroll-to-top-trigger", handleScrollToTopTrigger);
    return () => window.removeEventListener("scroll-to-top-trigger", handleScrollToTopTrigger);
  }, []);

  // Telemetry real-time wiggling effect (makes the HUD look dynamic and alive)
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTelemetry(() => {
        // Add minor fluctuations to alt, dist, temp and speed to make numbers dance like a live flight readout
        const altVal = (154.2 + (Math.random() * 0.4 - 0.2)).toFixed(1);
        const distVal = (1.28 + (Math.random() * 0.02 - 0.01)).toFixed(2);
        const tempVal = (32 + Math.floor(Math.random() * 3 - 1));
        const speedVal = (45 + Math.floor(Math.random() * 3 - 1));
        return {
          topLeft: "BATT: 98%\nCELLS: 4S LIPO",
          topRight: `ALT: ${altVal} M\nDIST: ${distVal} KM`,
          bottomLeft: `TEMP: ${tempVal}°C\nSTATUS: FLYING`,
          bottomRight: `SPEED: ${speedVal} KM/H\nTIME: 46 MIN`
        };
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  const renderDroneHUD = () => {
    const transform = DRONE_TRANSFORMS[activeStep];

    return (
      <div className="relative w-[30vh] max-w-full aspect-square md:w-full md:h-auto md:max-w-[480px] flex items-center justify-center">
        {/* Vòng tròn Radar HUD quay chậm ở nền */}
        <div className="absolute inset-2 rounded-full border border-dashed border-foreground/15 dark:border-foreground/25 animate-[spin_40s_linear_infinite] pointer-events-none" />
        <div className="absolute inset-8 rounded-full border border-foreground/[0.06] dark:border-foreground/15 pointer-events-none" />
        <div className="absolute inset-20 rounded-full border border-foreground/20 dark:border-foreground/30 border-r-transparent border-l-transparent animate-[spin_15s_linear_infinite] pointer-events-none" />

        {/* Thước ngắm chữ thập trung tâm */}
        <div className="absolute w-8 h-[1px] bg-foreground/20 dark:bg-foreground/35 pointer-events-none" />
        <div className="absolute h-8 w-[1px] bg-foreground/20 dark:bg-foreground/35 pointer-events-none" />

        {/* HUD Pointer Connecting Lines & Telemetry - Đường chỉ dẫn làm gạch chân cho chữ, mang lại thiết kế HUD cực kỳ logic và chuyên nghiệp */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 400 400">

          {/* Top-Left (Step 0 - Flight Time) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{
              opacity: activeStep === 0 ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <polyline
              points="16,45 110,45 150,110"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
              className="animate-hud-flow opacity-50 dark:opacity-65"
            />
            <circle cx="16" cy="45" r="2.5" fill="currentColor" className="animate-pulse opacity-75" />
            <text x="22" y="12" fill="currentColor" className="font-mono text-[11px] sm:text-[10px] tracking-wider sm:tracking-widest font-extralight opacity-80" textAnchor="start">
              <tspan x="22" dy="0">{liveTelemetry.topLeft.split('\n')[0]}</tspan>
              <tspan x="22" dy="12">{liveTelemetry.topLeft.split('\n')[1]}</tspan>
            </text>
          </motion.g>

          {/* Top-Right (Step 1 - Camera) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{
              opacity: activeStep === 1 ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <polyline
              points="384,45 290,45 250,110"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
              className="animate-hud-flow opacity-50 dark:opacity-65"
            />
            <circle cx="384" cy="45" r="2.5" fill="currentColor" className="animate-pulse opacity-75" />
            <text x="378" y="12" fill="currentColor" className="font-mono text-[11px] sm:text-[10px] tracking-wider sm:tracking-widest font-extralight opacity-80" textAnchor="end">
              <tspan x="378" dy="0">{liveTelemetry.topRight.split('\n')[0]}</tspan>
              <tspan x="378" dy="12">{liveTelemetry.topRight.split('\n')[1]}</tspan>
            </text>
          </motion.g>

          {/* Bottom-Left (Step 2 - Detection) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{
              opacity: activeStep === 2 ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <polyline
              points="16,355 110,355 150,290"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
              className="animate-hud-flow opacity-50 dark:opacity-65"
            />
            <circle cx="16" cy="355" r="2.5" fill="currentColor" className="animate-pulse opacity-75" />
            <text x="22" y="378" fill="currentColor" className="font-mono text-[11px] sm:text-[10px] tracking-wider sm:tracking-widest font-extralight opacity-80" textAnchor="start">
              <tspan x="22" dy="0">{liveTelemetry.bottomLeft.split('\n')[0]}</tspan>
              <tspan x="22" dy="12">{liveTelemetry.bottomLeft.split('\n')[1]}</tspan>
            </text>
          </motion.g>

          {/* Bottom-Right (Step 3 - Wind Resistance) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{
              opacity: activeStep === 3 ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <polyline
              points="384,355 290,355 250,290"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
              className="animate-hud-flow opacity-50 dark:opacity-65"
            />
            <circle cx="384" cy="355" r="2.5" fill="currentColor" className="animate-pulse opacity-75" />
            <text x="378" y="378" fill="currentColor" className="font-mono text-[11px] sm:text-[10px] tracking-wider sm:tracking-widest font-extralight opacity-80" textAnchor="end">
              <tspan x="378" dy="0">{liveTelemetry.bottomRight.split('\n')[0]}</tspan>
              <tspan x="378" dy="12">{liveTelemetry.bottomRight.split('\n')[1]}</tspan>
            </text>
          </motion.g>

        </svg>

        {/* Cửa sổ quét quét radar (Chỉ hiển thị khi dò tìm quét radar) */}
        {activeStep === 2 && (
          <div className="absolute inset-4 rounded-full border border-foreground/15 animate-ping pointer-events-none z-0" />
        )}

        {/* Drone Image with dynamic spring transform */}
        <motion.div
          animate={transform}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 20,
            mass: 0.8
          }}
          className="relative w-[70%] h-[70%] md:w-[75%] md:h-[75%] z-10"
        >
          <Image
            src="/images/features-drone.webp"
            alt="HeLiFly VeloX Drone HUD Visual"
            fill
            sizes="(max-width: 768px) 100vw, 450px"
            className="object-contain filter brightness-[1.02]"
            priority
          />
        </motion.div>
      </div>
    );
  };

  return (
    <section
      ref={containerRef}
      id="features"
      className={`relative w-full bg-background text-foreground transition-all duration-500 border-t border-foreground/5 ${isScrollingToTop ? "h-screen" : "h-[320vh]"
        }`}
    >
      {/* Sticky container covering the viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col justify-center h-full relative z-10">

          {/* Section title */}
          <div className="mb-6 sm:mb-8 md:mb-12 text-left">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-normal tracking-normal leading-[0.9] uppercase font-bebas">
              REDEFINING <br /> FLIGHT PRECISION
            </h2>
          </div>

          {/* Grid Layout: Responsive vertical on mobile, side-by-side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 lg:gap-16 items-center w-full">

            {/* Left Column: Drone radar HUD visual (5/12 columns on desktop) */}
            <div className="col-span-1 md:col-span-5 flex justify-center md:justify-start select-none max-h-[32vh] md:max-h-none my-6 sm:my-10 md:my-0">
              {renderDroneHUD()}
            </div>

            {/* Right Column: Grid 2x2 with Scrollytelling highlight (7/12 columns on desktop) */}
            <div className="col-span-1 md:col-span-7 flex flex-col justify-start">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 md:gap-x-16 lg:gap-x-20 gap-y-3 sm:gap-y-6 md:gap-y-12">
                {FEATURES_DATA.map((feature, i) => {
                  const isActive = activeStep === i;
                  const isEven = i % 2 === 1; // index 1 and 3 (2nd and 4th) are even items
                  return (
                    <motion.div
                      key={i}
                      animate={{
                        opacity: isActive ? 1.0 : 0.35
                      }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className={`flex flex-col gap-1.5 md:gap-2.5 transition-all duration-300 ${isEven
                          ? `text-right items-end border-r-2 pr-3 md:pr-4 ${isActive ? "border-foreground" : "border-foreground/10"
                          }`
                          : `text-left items-start border-l-2 pl-3 md:pl-4 ${isActive ? "border-foreground" : "border-foreground/10"
                          }`
                        }`}
                    >
                      <h3 className={`text-base sm:text-lg md:text-2xl font-normal tracking-normal uppercase font-bebas transition-colors duration-300 ${isActive ? "text-foreground" : "text-foreground/80"
                        }`}>
                        {feature.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs md:text-[13px] text-foreground/60 leading-relaxed max-w-[340px]">
                        {feature.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Grid timeline visual bar indicator (Ultra-minimalist black line) */}
              <div className="w-full h-[1px] bg-foreground/10 my-4 md:my-8 flex relative">
                <motion.div
                  className="h-full bg-foreground"
                  style={{
                    width: `${((activeStep + 1) / FEATURES_DATA.length) * 100}%`
                  }}
                  transition={{ ease: "easeOut", duration: 0.4 }}
                />
              </div>

              {/* Bottom footer description paragraph - Hidden on tiny viewports to avoid overflow */}
              <div className="text-left max-w-xl hidden sm:block">
                <p className="text-xs sm:text-sm md:text-[13px] text-foreground/55 leading-relaxed font-sans">
                  Experience the ultimate in aerial innovation with the HeLiFly X1, crafted for flawless control, stunning visuals, and reliable flight stability.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
