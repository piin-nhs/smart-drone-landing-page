"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, EcomContextType } from "@/types";

const EcomContext = createContext<EcomContextType | undefined>(undefined);

export function EcomProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Chỉ đọc dữ liệu từ localStorage sau khi Client đã mount 
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("piin_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedFavorites = localStorage.getItem("piin_favorites");
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

      const savedRecently = localStorage.getItem("piin_recently_viewed");
      if (savedRecently) setRecentlyViewed(JSON.parse(savedRecently));
    } catch (error) {
      console.error("Lỗi đọc dữ liệu từ localStorage:", error);
    }
    setIsMounted(true);
  }, []);

  // 2. Tự động đồng bộ giỏ hàng lên localStorage khi thay đổi
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("piin_cart", JSON.stringify(cart));
  }, [cart, isMounted]);

  // 3. Tự động đồng bộ danh sách yêu thích khi thay đổi
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("piin_favorites", JSON.stringify(favorites));
  }, [favorites, isMounted]);

  // 4. Tự động đồng bộ sản phẩm đã xem khi thay đổi
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("piin_recently_viewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed, isMounted]);

  // Thêm vào giỏ hàng
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.product.slug === product.slug);

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      }

      return [...prevCart, { product, quantity: 1 }];
    });
  };

  // Xóa khỏi giỏ hàng
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.slug !== productId && item.product._id !== productId));
  };

  // Cập nhật số lượng
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.slug === productId || item.product._id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Xóa sạch giỏ hàng
  const clearCart = () => {
    setCart([]);
  };

  // Thêm/Xóa khỏi danh sách yêu thích 
  const toggleFavorite = (product: Product) => {
    setFavorites((prevFavs) => {
      const isFav = prevFavs.some((fav) => fav.slug === product.slug);
      if (isFav) {
        return prevFavs.filter((fav) => fav.slug !== product.slug);
      } else {
        return [...prevFavs, product];
      }
    });
  };

  // Kiểm tra trạng thái yêu thích
  const isFavorite = (productId: string) => {
    return favorites.some((fav) => fav.slug === productId || fav._id === productId);
  };

  // Thêm vào danh sách vừa xem 
  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prevRecently) => {
      const filtered = prevRecently.filter((item) => item.slug !== product.slug);
      return [product, ...filtered].slice(0, 5);
    });
  };

  return (
    <EcomContext.Provider
      value={{
        cart,
        favorites,
        recentlyViewed,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleFavorite,
        isFavorite,
        addToRecentlyViewed,
      }}
    >
      {children}
    </EcomContext.Provider>
  );
}

export function useEcom() {
  const context = useContext(EcomContext);
  if (context === undefined) {
    throw new Error("useEcom phải dùng EcomProvider");
  }
  return context;
}
