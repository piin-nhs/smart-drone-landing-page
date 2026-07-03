"use client";

import { useEffect, useState, useRef } from "react";
import { useToast } from "@/contexts/ToastContext";

export function BehaviorTracker() {
  const { showToast } = useToast();
  const [sessionId, setSessionId] = useState("");
  const trackedMilestones = useRef<Record<number, boolean>>({
    50: false,
    100: false,
  });

  const isInFeaturesRef = useRef(false);

  useEffect(() => {
    const handleStoryState = (e: Event) => {
      const customEvent = e as CustomEvent;
      isInFeaturesRef.current = !!customEvent.detail?.active;
    };
    window.addEventListener("scrollytelling-state", handleStoryState);
    return () => window.removeEventListener("scrollytelling-state", handleStoryState);
  }, []);


  useEffect(() => {
    // Tắt tính năng tự động phục hồi vị trí cuộn sau F5
    if (typeof window !== "undefined" && history.scrollRestoration) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    let id = sessionStorage.getItem("piin_session_id");
    if (!id) {
      id = "sess_" + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("piin_session_id", id);
    }
    setSessionId(id);
  }, []);

  // Hàm gửi dữ liệu ngầm về server
  const sendBehavior = async (eventType: "scroll" | "click" | "pageview", eventData: Record<string, any>) => {
    if (!sessionId) return;
    try {
      await fetch("/api/behavior", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          eventType,
          eventData,
        }),
      });
    } catch (error) {
      console.error("Lỗi gửi dữ liệu hành vi ngầm:", error);
    }
  };

  // 2. Theo dõi và ghi nhận hành vi cuộn trang (Scroll Depth tracking)
  useEffect(() => {
    if (!sessionId) return;

    // Ghi nhận sự kiện Pageview khi bắt đầu vào trang
    sendBehavior("pageview", { url: window.location.href });

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const scrollPercent = Math.round((window.scrollY / docHeight) * 100);

      // Định nghĩa các mốc cột mốc
      const milestones = [50, 100];

      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !trackedMilestones.current[milestone]) {
          trackedMilestones.current[milestone] = true;
          sendBehavior("scroll", { milestone });

          if (!isInFeaturesRef.current) {
            if (milestone === 50) {
              showToast("Technology Uncovered: You have explored 50% of the drone features.", "info");
            } else if (milestone === 100) {
              showToast("Complete Discovery: Thank you for exploring the entire HELIFLY experience!", "success");
            }
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sessionId]);

  // 3. Theo dõi hành vi click chuột toàn cục (Click tracking)
  useEffect(() => {
    if (!sessionId) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Tìm phần tử gần nhất có thuộc tính data-track-click
      const trackable = target.closest("[data-track-click]") as HTMLElement;
      if (trackable) {
        const label = trackable.getAttribute("data-track-click") || "Unknown Button";

        // Gửi dữ liệu ngầm về DB
        sendBehavior("click", { buttonLabel: label });

        // Hiển thị Toast thông báo tương tác tương ứng 
        if (label.includes("clear")) {
          showToast("Your cart has been cleared.", "warning");
        } else if (label.includes("subscribe")) {
          showToast("Processing your subscription for exclusive member offers...", "info");
        } else if (label.includes("add-to-cart")) {
          showToast(`Added item to cart. Telemetry tracked: "${label}"`, "success");
        } else if (label.includes("favorite")) {
          showToast(`Toggled favorite status. Telemetry tracked: "${label}"`, "info");
        } else if (label.includes("quick-view")) {
          showToast(`Opened quick view modal. Telemetry tracked: "${label}"`, "info");
        } else if (label.includes("checkout")) {
          showToast(`Redirecting to checkout. Telemetry tracked: "${label}"`, "success");
        } else {
          showToast(`Click event tracked: "${label}"`, "info");
        }
      }
    };

    window.addEventListener("click", handleGlobalClick, true);
    return () => window.removeEventListener("click", handleGlobalClick, true);
  }, [sessionId]);

  return null;
}
