"use client";

import { useState, useEffect } from "react";
import { useEcom } from "@/contexts/EcomContext";
import { Product } from "@/types";
import { Heart, ShoppingBag, Eye, WifiOff } from "lucide-react";
import Image from "next/image";
import { ProductModal } from "./ProductModal";

export function ProductCatalog() {
  const { addToCart, toggleFavorite, isFavorite, favorites, recentlyViewed } = useEcom();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Lấy danh sách sản phẩm từ API MongoDB
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        const json = await res.json();

        if (json.success) {
          setProducts(json.data);
        } else {
          setError(json.error || "Failed to load products");
        }
      } catch (err: any) {
        console.error("Lỗi fetch sản phẩm:", err);
        setError("Unable to connect to the database. Make sure you seeded data first.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Định dạng giá hiển thị kiểu tiền tệ VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };



  // Hiệu ứng Skeleton Loading bóng mờ nhấp nháy
  if (loading) {
    return (
      <section id="products" className="py-24 bg-background text-foreground transition-colors duration-300 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Tiêu đề Skeleton */}
          <div className="mb-16 text-left max-w-xl animate-pulse">
            <div className="h-10 w-2/3 bg-foreground/10 rounded-lg mb-4"></div>
            <div className="h-4 w-1/2 bg-foreground/5 rounded-md"></div>
          </div>

          {/* Lưới sản phẩm Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex flex-col gap-4 animate-pulse">
                <div className="aspect-square bg-foreground/10 border border-card-border"></div>
                <div className="h-4 w-1/3 bg-foreground/10 rounded"></div>
                <div className="h-6 w-3/4 bg-foreground/10 rounded"></div>
                <div className="h-4 w-1/4 bg-foreground/15 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Hiển thị nếu gặp lỗi hoặc cơ sở dữ liệu trống
  if (error) {
    return (
      <section id="products" className="py-24 bg-background text-foreground text-center scroll-mt-24 flex items-center justify-center min-h-[450px] w-full px-6">
        <div className="max-w-md w-full mx-auto px-8 py-12 border border-card-border bg-card/40 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)] flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
            <WifiOff className="w-5 h-5 text-foreground/40" />
          </div>
          <h3 className="font-sans font-black tracking-[0.2em] text-xs sm:text-sm uppercase mb-3 text-foreground">
            KHÔNG THỂ KẾT NỐI HỆ THỐNG
          </h3>
          <p className="text-xs text-foreground/50 leading-relaxed max-w-[280px] sm:max-w-xs mx-auto mb-8 font-sans">
            Máy chủ không phản hồi hoặc kết nối mạng bị gián đoạn. Vui lòng kiểm tra lại đường truyền và thử tải lại trang.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-none border border-foreground/20 hover:border-foreground bg-transparent hover:bg-foreground hover:text-background text-[10px] sm:text-[11px] font-bold tracking-[0.15em] sm:tracking-[0.2em] transition-all duration-300 font-sans cursor-pointer active:scale-95 uppercase flex items-center justify-center text-center"
          >
            THỬ TẢI LẠI TRANG
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="products"
      className="py-24 md:py-32 w-full relative overflow-hidden bg-background text-foreground transition-colors duration-300 border-t border-foreground/5 scroll-mt-24 md:scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* Tiêu đề mục cửa hàng */}
        <div className="mb-16 md:mb-20 text-left max-w-xl">
          <h2 className="text-4xl md:text-6xl font-normal tracking-normal leading-[0.9] uppercase font-bebas">
            DISCOVER THE ECOSYSTEM
          </h2>
          <p className="text-xs sm:text-[13px] text-foreground/50 leading-relaxed mt-4 font-sans max-w-sm">
            Equip your flight with the ultimate tech, optimized for flawless control, power, and high-fidelity video.
          </p>
        </div>

        {/* Lưới hiển thị toàn bộ sản phẩm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => {
            const isFav = isFavorite(product.slug);
            return (
              <div
                key={product.slug}
                className="flex flex-col text-left group"
              >
                {/* Hộp chứa ảnh*/}
                <div
                  onClick={() => setSelectedProduct(product)}
                  data-track-click="catalog-quick-view"
                  className="relative w-full aspect-square border border-card-border bg-card flex items-center justify-center p-6 select-none overflow-hidden cursor-pointer"
                >
                  <div className="relative w-full h-full max-w-[200px] transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 350px"
                      className="object-contain"
                    />
                  </div>

                  {/* Nút thả tim */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product);
                    }}
                    data-track-click="catalog-toggle-favorite"
                    className={`absolute right-3 bottom-3 w-8 h-8 rounded-none border flex items-center justify-center transition-all duration-300 cursor-pointer z-10 bg-background/80 backdrop-blur ${isFav
                      ? "border-red-500/20 text-red-500 fill-red-500 bg-red-500/5"
                      : "border-card-border hover:border-foreground/20 text-foreground/40 hover:text-foreground"
                      }`}
                    aria-label="Favorite"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
                  </button>

                  {/* Thanh công cụ trượt từ trên xuống khi hover*/}
                  <div className="absolute right-3 top-3 hidden md:flex flex-col gap-1 z-10">
                    {/* Nút thêm vào giỏ */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      data-track-click="catalog-add-to-cart"
                      className="w-10 h-10 bg-[#222] dark:bg-[#1a1a1a] hover:bg-foreground hover:text-background text-white flex items-center justify-center cursor-pointer transition-all duration-500 transform -translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-[0ms]"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-4 h-4 stroke-[2]" />
                    </button>
                    {/* Nút xem nhanh */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      data-track-click="catalog-quick-view"
                      className="w-10 h-10 bg-[#222] dark:bg-[#1a1a1a] hover:bg-foreground hover:text-background text-white flex items-center justify-center cursor-pointer transition-all duration-500 transform -translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-[75ms]"
                      aria-label="Quick view"
                    >
                      <Eye className="w-4 h-4 stroke-[2]" />
                    </button>
                  </div>
                </div>

                {/* Phần thông tin dưới ảnh */}
                <div className="mt-3 text-left">
                  {/* Phân loại */}
                  <span className="text-[10px] text-foreground/45 font-sans tracking-widest uppercase">
                    {product.category}s
                  </span>
                  {/* Tên sản phẩm */}
                  <h5
                    className="font-medium text-[14px] sm:text-[15px] tracking-wide text-foreground mt-0.5 line-clamp-1 hover:underline transition-colors cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                    data-track-click="catalog-quick-view"
                  >
                    {product.name}
                  </h5>
                  {/* Giá cả */}
                  <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                    <span className="text-[14px] font-bold text-foreground">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-foreground/35 line-through font-medium">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Phần bổ trợ: Danh sách Yêu thích & Đã xem*/}
        {(favorites.length > 0 || recentlyViewed.length > 0) && (
          <div className="mt-24 border-t border-card-border pt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Cột trái: Sản phẩm Yêu thích*/}
            <div className="text-left flex flex-col">
              <h4 className="text-sm font-bold tracking-widest uppercase font-sans text-foreground/75 mb-6 flex items-center gap-2">
                <Heart className="w-4 h-4 text-foreground/70" />
                YOUR FAVORITES ({favorites.length})
              </h4>
              {favorites.length > 0 ? (
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
                  {favorites.map((product) => {
                    const isBroken = brokenImages[product.slug];
                    return (
                      <div
                        key={product.slug}
                        onClick={() => setSelectedProduct(product)}
                        className="flex items-center gap-4 p-3 border border-card-border rounded-none bg-card hover:bg-foreground/[0.01] hover:border-foreground/15 transition-all cursor-pointer group"
                      >
                        {/* Container chứa ảnh có xử lý ảnh lỗi bằng React State để xóa hẳn thẻ img khỏi DOM */}
                        <div className="relative w-12 h-12 bg-foreground/5 rounded-none overflow-hidden flex-shrink-0 flex items-center justify-center border border-card-border">
                          {!isBroken ? (
                            <img
                              src={product.image}
                              alt=""
                              className="w-full h-full object-contain p-1"
                              onError={() => {
                                setBrokenImages((prev) => ({ ...prev, [product.slug]: true }));
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-foreground/30 bg-foreground/5">
                              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <h5 className="font-bold text-xs tracking-wide text-foreground line-clamp-1 group-hover:underline transition-colors">
                            {product.name}
                          </h5>
                          <span className="text-[11px] font-semibold text-foreground/60 block mt-0.5">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Giao diện trống khi không có sản phẩm yêu thích */
                <div className="flex flex-col items-center justify-center py-12 px-6 border border-dashed border-card-border rounded-none bg-card/25 text-center gap-3 min-h-[160px]">
                  <Heart className="w-8 h-8 text-foreground/20 stroke-[1.2]" />
                  <div>
                    <h5 className="font-bold text-[11px] tracking-wider uppercase font-sans text-foreground/60">YOUR FAVORITES IS EMPTY</h5>
                    <p className="text-[10px] text-foreground/45 leading-relaxed font-sans max-w-[220px] mt-1 mx-auto">
                      Click the heart icon on any product to save it here.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Cột phải: Sản phẩm đã xem gần đây */}
            <div className="text-left flex flex-col">
              <h4 className="text-sm font-bold tracking-widest uppercase font-sans text-foreground/75 mb-6 flex items-center gap-2">
                <Eye className="w-4 h-4 text-foreground/70" />
                RECENTLY VIEWED
              </h4>
              {recentlyViewed.length > 0 ? (
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
                  {recentlyViewed.map((product) => {
                    const isBroken = brokenImages[product.slug];
                    return (
                      <div
                        key={product.slug}
                        onClick={() => setSelectedProduct(product)}
                        className="flex items-center gap-4 p-3 border border-card-border rounded-none bg-card hover:bg-foreground/[0.01] hover:border-foreground/15 transition-all cursor-pointer group"
                      >
                        {/* Container chứa ảnh có xử lý ảnh lỗi bằng React State để xóa hẳn thẻ img khỏi DOM */}
                        <div className="relative w-12 h-12 bg-foreground/5 rounded-none overflow-hidden flex-shrink-0 flex items-center justify-center border border-card-border">
                          {!isBroken ? (
                            <img
                              src={product.image}
                              alt=""
                              className="w-full h-full object-contain p-1"
                              onError={() => {
                                setBrokenImages((prev) => ({ ...prev, [product.slug]: true }));
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-foreground/30 bg-foreground/5">
                              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <h5 className="font-bold text-xs tracking-wide text-foreground line-clamp-1 group-hover:underline transition-colors">
                            {product.name}
                          </h5>
                          <span className="text-[11px] font-semibold text-foreground/60 block mt-0.5">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Giao diện trống khi chưa xem sản phẩm nào */
                <div className="flex flex-col items-center justify-center py-12 px-6 border border-dashed border-card-border rounded-none bg-card/25 text-center gap-3 min-h-[160px]">
                  <Eye className="w-8 h-8 text-foreground/20 stroke-[1.2]" />
                  <div>
                    <h5 className="font-bold text-[11px] tracking-wider uppercase font-sans text-foreground/60">NO RECENTLY VIEWED</h5>
                    <p className="text-[10px] text-foreground/45 leading-relaxed font-sans max-w-[220px] mt-1 mx-auto">
                      Products you view will automatically appear here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Modal chi tiết sản phẩm */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
