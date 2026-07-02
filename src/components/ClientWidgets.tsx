"use client";

import dynamic from "next/dynamic";

const CartDrawer = dynamic(() => import("./CartDrawer").then((mod) => mod.CartDrawer), {
  ssr: false,
});

const BehaviorTracker = dynamic(() => import("./BehaviorTracker").then((mod) => mod.BehaviorTracker), {
  ssr: false,
});

const ChatWidget = dynamic(() => import("./ChatWidget").then((mod) => mod.ChatWidget), {
  ssr: false,
});

export function ClientWidgets() {
  return (
    <>
      <CartDrawer />
      <BehaviorTracker />
      <ChatWidget />
    </>
  );
}
