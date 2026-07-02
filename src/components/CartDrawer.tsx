"use client";

import { useEcom } from "@/contexts/EcomContext";
import { useToast } from "@/contexts/ToastContext";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function CartDrawer() {
  const { showToast } = useToast();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useEcom();

  const totalItems = cart.length;
  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    clearCart();
    setIsCartOpen(false);
    showToast("Order successful! Thank you for trusting HELIFLY.", "success");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Phông nền mờ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 cursor-pointer"
          />

          {/* Khung ngăn kéo giỏ hàng chính */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:max-w-[420px] bg-card border-l border-card-border shadow-2xl flex flex-col h-full text-foreground"
          >
            {/* Tiêu đề giỏ hàng */}
            <div className="p-6 border-b border-card-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-foreground/75" />
                <span className="font-bold font-sans tracking-wider text-sm">YOUR CART ({totalItems})</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-none flex items-center justify-center border border-foreground/10 hover:border-foreground/25 hover:bg-foreground/5 transition-all cursor-pointer"
                aria-label="Close Cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Danh sách sản phẩm trong giỏ */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-none bg-foreground/5 flex items-center justify-center text-foreground/30">
                    <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-wider font-sans mb-1">YOUR CART IS EMPTY</h3>
                    <p className="text-xs text-foreground/45 max-w-[240px] leading-relaxed">
                      Looks like you haven't added any products to your cart yet.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setTimeout(() => {
                        document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                      }, 300);
                    }}
                    className="mt-2 px-6 py-2 rounded-none bg-foreground text-background text-xs font-bold tracking-widest hover:opacity-90 transition-all cursor-pointer font-sans"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.slug}
                    className="flex gap-4 border-b border-card-border pb-4 last:border-b-0"
                  >
                    {/* Ảnh sản phẩm */}
                    <div className="relative w-20 h-20 bg-foreground/5 rounded-none overflow-hidden border border-card-border flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-contain p-2"
                      />
                    </div>

                    {/* Chi tiết sản phẩm */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="text-left">
                        <h4 className="font-bold text-[13px] tracking-wide line-clamp-1">
                          {item.product.name}
                        </h4>
                        <span className="text-[12px] text-foreground/60 font-medium mt-1 block">
                          {formatPrice(item.product.price)}
                        </span>
                      </div>

                      {/* Bộ chỉnh số lượng và nút xóa */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-card-border rounded-none p-0.5 bg-background">
                          <button
                            onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                            className="w-6 h-6 rounded-none flex items-center justify-center hover:bg-foreground/5 transition-colors cursor-pointer text-foreground/60 hover:text-foreground"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                            disabled={item.quantity >= 999}
                            className="w-6 h-6 rounded-none flex items-center justify-center hover:bg-foreground/5 transition-colors cursor-pointer text-foreground/60 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.slug)}
                          className="text-foreground/45 hover:text-foreground transition-colors p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4 stroke-[1.8]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Tổng tiền và nút thanh toán ở chân */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-card-border bg-background/50 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider text-foreground/50">SUBTOTAL</span>
                  <span className="text-lg font-black tracking-wide">{formatPrice(totalPrice)}</span>
                </div>
                <p className="text-[10px] text-foreground/45 text-left leading-relaxed font-sans">
                  Shipping fees and taxes are calculated at checkout. Free shipping on all drone combos.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    onClick={clearCart}
                    data-track-click="cart-clear-all"
                    className="py-3 px-4 rounded-none border border-foreground/10 hover:border-foreground hover:bg-foreground/5 text-[11px] font-bold tracking-widest text-foreground/60 hover:text-foreground transition-all cursor-pointer font-sans"
                  >
                    CLEAR ALL
                  </button>
                  <button
                    onClick={handleCheckout}
                    data-track-click="cart-checkout"
                    className="py-3 px-4 rounded-none bg-foreground hover:opacity-90 text-background text-[11px] font-bold tracking-widest transition-all cursor-pointer shadow-lg hover:shadow-xl font-sans"
                  >
                    CHECKOUT
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
