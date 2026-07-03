"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiLinkedin, FiGithub, FiFacebook, FiInstagram } from "react-icons/fi";
import { Send, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

// Định nghĩa Schema validation bằng Zod
const subscribeSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(50, { message: "Full name must not exceed 50 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email address" }),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, { message: "Invalid phone number" }),
});

type SubscribeInput = z.infer<typeof subscribeSchema>;

export function Footer() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscribeInput>({
    resolver: zodResolver(subscribeSchema),
  });

  const onSubmit = async (data: SubscribeInput) => {
    try {
      setStatus("loading");
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(`Thank you ${data.fullName}! A 15% discount code has been sent to ${data.email}.`);
        reset();
      } else {
        setStatus("error");
        setMessage(result.message || "An error occurred. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Unable to connect to the server. Please try again.");
    }
  };

  const socialLinks = [
    { name: "linkedin", icon: <FiLinkedin className="w-4 h-4" />, url: "https://www.linkedin.com/in/piin-nhs/" },
    { name: "github", icon: <FiGithub className="w-4 h-4" />, url: "https://github.com/piin-nhs" },
    { name: "facebook", icon: <FiFacebook className="w-4 h-4" />, url: "https://www.facebook.com/piin.nhs" },
    { name: "instagram", icon: <FiInstagram className="w-4 h-4" />, url: "https://www.instagram.com/piin_nhs/" },
  ];

  return (
    <footer className="w-full bg-card border-t border-card-border pt-16 pb-8 transition-colors duration-300 relative z-10 text-left">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-6 md:px-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-12 border-b border-card-border">

          {/* Cột trái: Giới thiệu thương hiệu */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="font-sans font-black tracking-[0.15em] text-lg text-foreground">
                HELI<span className="text-foreground/50">FLY</span>
              </span>
              <p className="mt-4 text-xs sm:text-[13px] text-foreground/50 leading-relaxed max-w-sm">
                Pioneering intelligent drone solutions for the future. Optimizing control, real-time image transmission, and leading aerospace technology.
              </p>
            </div>

            {/* Cam kết bảo mật */}
            <div className="mt-8 lg:mt-0 flex items-center gap-2 text-[11px] text-foreground/45 font-sans">
              <ShieldCheck className="w-4 h-4 text-foreground/40" />
              <span>Your data is securely encrypted using industry-standard AES-256.</span>
            </div>
          </div>

          {/* Cột phải: Form Đăng ký nhận tin */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            <h4 className="text-sm font-bold tracking-widest uppercase font-sans text-foreground/80 mb-2">
              SUBSCRIBE TO EXCLUSIVE OFFERS
            </h4>
            <p className="text-xs text-foreground/45 mb-6 leading-relaxed max-w-md">
              Leave your information to become an honorary member, receive an instant 15% discount code for your first order, and get the latest product updates.
            </p>

            {status === "success" ? (
              <div className="p-5 border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 flex items-start gap-3 rounded-none animate-fadeIn w-full">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1 text-left">
                  <h5 className="font-bold text-xs tracking-wider uppercase font-sans whitespace-normal break-words">REGISTRATION SUCCESSFUL!</h5>
                  <p className="text-xs mt-1 leading-relaxed break-words">{message}</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-3 text-[10px] font-bold tracking-widest uppercase text-foreground hover:underline cursor-pointer whitespace-normal break-words text-left"
                  >
                    Subscribe with another email
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Trường Họ tên */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-foreground/50 uppercase font-sans">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Nguyen Hoang Sang"
                      {...register("fullName")}
                      disabled={status === "loading"}
                      className="w-full h-10 px-3 bg-background border border-card-border rounded-none text-base sm:text-xs text-foreground focus:outline-none focus:border-foreground/40 transition-colors disabled:opacity-50 font-sans"
                    />
                    {errors.fullName && (
                      <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1 font-sans">
                        {errors.fullName.message}
                      </span>
                    )}
                  </div>

                  {/* Trường Số điện thoại */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-foreground/50 uppercase font-sans">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="0559496637"
                      {...register("phone")}
                      disabled={status === "loading"}
                      className="w-full h-10 px-3 bg-background border border-card-border rounded-none text-base sm:text-xs text-foreground focus:outline-none focus:border-foreground/40 transition-colors disabled:opacity-50 font-sans"
                    />
                    {errors.phone && (
                      <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1 font-sans">
                        {errors.phone.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Trường Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-foreground/50 uppercase font-sans">
                    Email Address
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative w-full sm:flex-1">
                      <input
                        type="text"
                        placeholder="yourname@email.com"
                        {...register("email")}
                        disabled={status === "loading"}
                        className="w-full h-10 px-3 bg-background border border-card-border rounded-none text-base sm:text-xs text-foreground focus:outline-none focus:border-foreground/40 transition-colors disabled:opacity-50 font-sans"
                      />
                    </div>

                    {/* Nút đăng ký */}
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      data-track-click="footer-subscribe"
                      className="w-full sm:w-auto flex-shrink-0 h-10 px-6 bg-[#111] dark:bg-white text-white dark:text-black font-sans font-bold text-[11px] tracking-widest uppercase hover:bg-foreground/85 dark:hover:bg-foreground/85 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 select-none rounded-none"
                    >
                      <span>{status === "loading" ? "SENDING..." : "SUBSCRIBE"}</span>
                      {status !== "loading" && <Send className="w-3 h-3" />}
                    </button>
                  </div>
                  {errors.email && (
                    <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1 font-sans">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {status === "error" && (
                  <div className="p-3 border border-red-500/20 bg-red-500/5 text-red-500 text-xs flex items-center gap-2 rounded-none font-sans">
                    <span>{message}</span>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Chân trang bản quyền và liên kết */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-[11px] text-foreground/40 font-sans">
            © {new Date().getFullYear()} HELIFLY. Crafted by Piin-NHS. All rights reserved.
          </div>

          {/* Cụm mạng xã hội */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-none border border-foreground/10 hover:border-foreground/25 flex items-center justify-center transition-all duration-300 text-foreground/50 hover:text-foreground hover:bg-foreground/5"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
