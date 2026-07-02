"use client";

import Image from "next/image";

import { FlightLessonStep } from "@/types";

const FLIGHT_LESSONS: FlightLessonStep[] = [
  {
    number: "01",
    title: "UNBOXING & CHARGING",
    desc: "Safely unbox your drone, inspect each included part and accessory, and learn the correct way to charge your HeLiPower batteries for maximum performance and flight time.",
    image: "/images/products/product_03.webp",
    actionText: "LEARN MORE",
    question: "Can you guide me on how to safely unbox and charge the HeLiFly drone?",
  },
  {
    number: "02",
    title: "CONTROLLER SETUP",
    desc: "Get comfortable with your HeLiController smart remote. Learn the functions of the physical buttons, joysticks, and connect your phone to launch the FPV real-time video feed app.",
    image: "/images/products/product_02.webp",
    actionText: "LEARN MORE",
    question: "How do I set up and calibrate the HeLiController remote transmitter?",
  },
  {
    number: "03",
    title: "PREPARING FOR YOUR FIRST FLIGHT",
    desc: "Before takeoff, perform your pre-flight safety checks: calibrate the digital compass, verify at least 12 GPS satellites are locked, and set your safe return-to-home (RTH) altitude limits.",
    image: "/images/products/product_01.webp",
    actionText: "LEARN MORE",
    question: "What is the pre-flight checklist and how do I prepare for my first flight?",
  },
  {
    number: "04",
    title: "DRONE SAFETY ESSENTIALS",
    desc: "Fly safely by adhering to key airspace rules: maintain safe distances from people and obstacles, avoid restricted No-Fly Zones (NFZ), and know how to trigger auto-RTH during signal loss.",
    image: "/images/features-drone.webp",
    actionText: "LEARN MORE",
    question: "What are the essential drone safety rules and regulations I should follow?",
  },
];

export function HowToFly() {
  return (
    <section
      id="how-to-fly"
      className="py-24 md:py-32 w-full relative overflow-hidden bg-background text-foreground border-t border-foreground/5 scroll-mt-24 md:scroll-mt-28"
    >
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.02),transparent_45%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="mb-20 md:mb-28 text-center max-w-2xl mx-auto">
          <h2 className="font-display font-normal text-4xl sm:text-5xl tracking-tight uppercase mb-4 text-foreground">
            LEARN TO FLY WITH EASE
          </h2>
          <p className="text-xs sm:text-sm text-foreground/50 tracking-wider font-sans uppercase max-w-md mx-auto leading-relaxed">
            Get started with our beginner-friendly guides that walk you through every stage of flight preparation. Learn the basics to fly safely and confidently.
          </p>
        </div>

        {/* Lưới các bước học lái */}
        <div className="flex flex-col gap-24 sm:gap-32">
          {FLIGHT_LESSONS.map((lesson, idx) => {
            const isEven = idx % 2 === 1;

            return (
              <div
                key={lesson.number}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-20 items-center"
              >
                {/* Cột Ảnh - Luôn xuất hiện trước trên Mobile */}
                <div
                  className={`relative aspect-[4/3] bg-foreground/5 border border-card-border overflow-hidden rounded-none group ${
                    isEven ? "order-1 md:order-2" : "order-1"
                  }`}
                >
                  <Image
                    src={lesson.image}
                    alt={lesson.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-contain p-6 sm:p-8 transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Glowing thin overlay line */}
                  <div className="absolute inset-0 border border-foreground/0 group-hover:border-foreground/10 transition-colors duration-500 pointer-events-none" />
                </div>

                {/* Cột Chữ */}
                <div
                  className={`flex flex-col items-start text-left ${
                    isEven ? "order-2 md:order-1" : "order-2"
                  }`}
                >
                  {/* Số thứ tự dạng hộp viền phẳng */}
                  <div className="w-8 h-8 border border-foreground/20 flex items-center justify-center font-display text-xs font-bold tracking-wider mb-6 text-foreground/80 bg-foreground/5 rounded-none">
                    {lesson.number}
                  </div>

                  {/* Tiêu đề bước */}
                  <h3 className="font-display font-normal text-3xl sm:text-4xl tracking-tight uppercase mb-4 text-foreground">
                    {lesson.title}
                  </h3>

                  {/* Nội dung mô tả */}
                  <p className="text-xs sm:text-sm text-foreground/50 leading-relaxed font-sans mb-8">
                    {lesson.desc}
                  </p>

                  {/* Nút tìm hiểu chi tiết dạng phẳng và outline */}
                  <button
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("open-helibot", {
                          detail: { question: lesson.question },
                        })
                      );
                    }}
                    className="px-6 py-3 rounded-none border border-foreground/20 hover:border-foreground bg-transparent hover:bg-foreground hover:text-background text-[10px] font-bold tracking-[0.25em] transition-all duration-300 font-sans cursor-pointer active:scale-95 uppercase"
                  >
                    {lesson.actionText} &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
