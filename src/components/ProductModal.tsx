"use client";

import { useEffect } from "react";
import { useEcom } from "@/contexts/EcomContext";
import { Product, ProductModalProps } from "@/types";
import { X, Heart, ShoppingBag, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart, toggleFavorite, isFavorite, addToRecentlyViewed } = useEcom();

  // Tự động thêm vào danh sách sản phẩm vừa xem khi mở modal chi tiết
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product]);

  if (!product) return null;

  const isFav = isFavorite(product.slug);

  // Định dạng giá VND hiển thị kiểu tiếng Anh (ví dụ: ₫15,990,000)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Phông nền mờ*/}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 cursor-pointer"
        />

        {/* Khung Modal nội dung chính */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-card border border-card-border rounded-none shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row text-foreground max-h-[90vh] md:max-h-[85vh] lg:max-h-[80vh]"
        >
          {/* Nút đóng ở góc trên bên phải */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-none bg-background/80 backdrop-blur border border-foreground/10 hover:border-foreground/25 hover:bg-foreground/5 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Cột Bên Trái: Ảnh sản phẩm lớn */}
          <div className="w-full md:w-1/2 bg-foreground/[0.02] dark:bg-foreground/[0.01] flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-card-border select-none relative min-h-[260px] md:min-h-0">
            {hasDiscount && (
              <span className="absolute top-6 left-6 bg-[#111] dark:bg-white text-white dark:text-black text-[10px] font-black tracking-widest px-2.5 py-1 rounded-none shadow-sm z-10 border border-card-border">
                SAVE {discountPercentage}%
              </span>
            )}
            <div className="relative w-full aspect-square max-w-[340px]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-4"
                priority
                unoptimized
              />
            </div>
          </div>

          {/* Cột Bên Phải: Thông tin chi tiết */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between max-h-[50vh] md:max-h-none">
            <div className="text-left flex flex-col gap-4">
              {/* Phân loại */}
              <span className="text-[10px] font-bold tracking-[0.25em] text-foreground/60 uppercase font-sans">
                {product.category}
              </span>

              {/* Tên sản phẩm */}
              <h2 className="text-2xl font-black font-sans leading-tight tracking-wide">
                {product.name}
              </h2>

              {/* Giá bán */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-xl font-black text-foreground">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-foreground/40 line-through font-medium">
                    {formatPrice(product.originalPrice!)}
                  </span>
                )}
              </div>

              {/* Mô tả chi tiết */}
              <p className="text-xs text-foreground/60 leading-relaxed font-sans mt-1">
                {product.description}
              </p>

              {/* Tính năng nổi bật */}
              {product.features && product.features.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-[11px] font-black tracking-wider uppercase font-sans text-foreground/75 mb-2.5">
                    KEY HIGHLIGHTS
                  </h4>
                  <ul className="flex flex-col gap-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground/70">
                        <Check className="w-4 h-4 text-foreground/80 stroke-[2.5] mt-0.5 flex-shrink-0" />
                        <span className="font-sans leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bảng thông số kĩ thuật chi tiết (Specs) */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="mt-4">
                  <h4 className="text-[11px] font-black tracking-wider uppercase font-sans text-foreground/75 mb-2.5">
                    TECHNICAL SPECIFICATIONS
                  </h4>
                  <div className="border border-card-border rounded-none overflow-hidden">
                    <table className="w-full text-xs">
                      <tbody>
                        {Object.entries(product.specs).map(([key, val], idx) => (
                          <tr
                            key={key}
                            className="border-b border-card-border last:border-b-0 hover:bg-foreground/[0.01] transition-colors"
                          >
                            <td className="p-3 font-semibold text-foreground/60 w-1/3 bg-foreground/[0.01] border-r border-card-border text-left">
                              {key}
                            </td>
                            <td className="p-3 text-foreground/80 font-medium text-left">
                              {val}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Cụm nút bấm ở chân Modal */}
            <div className="flex gap-3 mt-1 pt-6">
              {/* Nút yêu thích */}
              <button
                onClick={() => toggleFavorite(product)}
                data-track-click="modal-toggle-favorite"
                className={`w-12 h-12 rounded-none border flex items-center justify-center transition-all duration-300 cursor-pointer ${isFav
                  ? "border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20"
                  : "border-foreground/10 hover:border-foreground/25 hover:bg-foreground/5 text-foreground/60 hover:text-foreground"
                  }`}
                aria-label="Add to favorites"
              >
                <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
              </button>

              {/* Nút Thêm vào giỏ hàng */}
              <button
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
                data-track-click="modal-add-to-cart"
                disabled={!product.inStock}
                className="flex-1 h-12 rounded-none bg-foreground text-background font-bold text-xs tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-sans"
              >
                <ShoppingBag className="w-4 h-4" />
                {product.inStock ? "ADD TO CART" : "OUT OF STOCK"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
