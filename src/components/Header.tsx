"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useEcom } from "@/contexts/EcomContext";
import { ShoppingBag, Sun, Moon, Menu, X } from "lucide-react";
import { FiLinkedin, FiGithub, FiFacebook, FiInstagram } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
    const { theme, toggleTheme } = useTheme();
    const { cart, setIsCartOpen } = useEcom();
    const totalItems = cart.length;
    const [isVisible, setIsVisible] = useState(true);
    const [isAtTop, setIsAtTop] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isInStory, setIsInStory] = useState(false);

    useEffect(() => {
        const handleStoryState = (e: Event) => {
            const customEvent = e as CustomEvent;
            setIsInStory(!!customEvent.detail?.active);
        };
        window.addEventListener("scrollytelling-state", handleStoryState);
        return () => window.removeEventListener("scrollytelling-state", handleStoryState);
    }, []);

    const isInitialMount = useRef(true);
    const isNavScrolling = useRef(false);
    const navScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isBumping, setIsBumping] = useState(false);

    // Tự động đẩy header hiện xuống khi giỏ hàng thay đổi (thêm mới/cập nhật) và tạo hiệu ứng nhịp rung
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        setIsVisible(true);
        setIsBumping(true);
        const timer = setTimeout(() => setIsBumping(false), 1000);
        return () => clearTimeout(timer);
    }, [cart]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Tự động đóng menu thả xuống của mobile khi cuộn trang
            setIsMobileMenuOpen(false);

            // Khi đang cuộn mượt do nav link, giữ header hiển thị
            if (isNavScrolling.current) {
                setIsVisible(true);
                setLastScrollY(currentScrollY);
                return;
            }

            // Xác định nếu ở sát đỉnh trang
            if (currentScrollY <= 15) {
                setIsAtTop(true);
                setIsVisible(true);
            } else {
                setIsAtTop(false);

                // Cuộn xuống -> Ẩn thanh header, Cuộn lên -> Hiện thanh header
                if (currentScrollY > lastScrollY) {
                    setIsVisible(false);
                } else {
                    setIsVisible(true);
                }
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const navLinks = [
        { label: "HOME", href: "#hero" },
        { label: "FEATURES", href: "#features" },
        { label: "PRODUCTS", href: "#products" },
        { label: "HOW TO FLY", href: "#how-to-fly" },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${isVisible && !isInStory ? "translate-y-0" : "-translate-y-full"
                } ${isAtTop && !isMobileMenuOpen
                    ? "bg-transparent py-8 border-b border-transparent"
                    : "bg-background/80 backdrop-blur-md border-b border-foreground/5 py-4 shadow-sm"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between relative min-h-[40px]">

                {/* Cụm Bên Trái: Logo Helifly */}
                <a
                    href="#hero"
                    className="text-lg font-black tracking-[0.3em] text-foreground hover:opacity-80 transition-all font-sans select-none z-10 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 lg:static lg:left-auto lg:top-auto lg:translate-x-0 lg:translate-y-0 whitespace-nowrap max-[300px]:hidden"
                >
                    HELIFLY
                </a>

                {/* Cụm Chính Giữa: Thanh điều hướng trung tâm */}
                <nav className="hidden lg:flex items-center justify-center gap-8 lg:gap-12 flex-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => {
                                setIsVisible(true);
                                isNavScrolling.current = true;
                                if (navScrollTimer.current) clearTimeout(navScrollTimer.current);
                                navScrollTimer.current = setTimeout(() => {
                                    isNavScrolling.current = false;
                                }, 1100);
                            }}
                            className="text-[10px] font-semibold tracking-[0.25em] text-foreground/60 hover:text-foreground transition-all duration-300 font-sans whitespace-nowrap"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Nút Menu Hamburger cho Mobile  */}
                <div className="flex lg:hidden z-10">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="w-9 h-9 rounded-full border border-foreground/10 hover:border-foreground/25 hover:bg-foreground/5 flex items-center justify-center transition-all duration-300 cursor-pointer text-foreground animate-in duration-200"
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-4 h-4 stroke-[1.8]" />
                        ) : (
                            <Menu className="w-4.5 h-4.5 stroke-[1.8]" />
                        )}
                    </button>
                </div>

                {/* Cụm Bên Phải: Giỏ Hàng & Đổi Theme  */}
                <div className="flex items-center gap-3 sm:gap-4 z-10">
                    {/* Nút Giỏ Hàng Tròn */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="w-9 h-9 rounded-full border border-foreground/10 hover:border-foreground/25 hover:bg-foreground/5 flex items-center justify-center transition-all duration-300 cursor-pointer text-foreground relative"
                        aria-label="Shopping Cart"
                    >
                        <ShoppingBag className="w-[17px] h-[17px] stroke-[1.5]" />

                        {totalItems > 0 && (
                            <div className="absolute -top-1.5 -right-1.5 w-[16px] h-[16px] pointer-events-none">
                                {/* Sóng lan tỏa chỉ phát ra từ vòng tròn số */}
                                <AnimatePresence>
                                    {isBumping && (
                                        <motion.span
                                            initial={{ scale: 0.8, opacity: 0.8 }}
                                            animate={{ scale: 2.2, opacity: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.9, ease: "easeOut" }}
                                            className="absolute inset-0 rounded-full bg-[#111] dark:bg-white pointer-events-none"
                                        />
                                    )}
                                </AnimatePresence>

                                {/* Vòng tròn số chính có hiệu ứng nảy lò xo */}
                                <motion.span
                                    key={totalItems}
                                    initial={{ scale: 0.6, rotate: -15 }}
                                    animate={{ scale: 1.1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 180, damping: 12 }}
                                    className="absolute inset-0 bg-[#111] dark:bg-white text-white dark:text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-sm border border-background"
                                >
                                    {totalItems}
                                </motion.span>
                            </div>
                        )}
                    </button>

                    {/* Nút Đổi Theme Tròn trên Desktop */}
                    <button
                        onClick={toggleTheme}
                        className="hidden lg:flex w-9 h-9 rounded-full border border-foreground/10 hover:border-foreground/25 hover:bg-foreground/5 items-center justify-center transition-all duration-300 cursor-pointer text-foreground"
                        aria-label="Toggle Theme"
                    >
                        {theme === "light" ? (
                            <Moon className="w-[17px] h-[17px] stroke-[1.5]" />
                        ) : (
                            <Sun className="w-[17px] h-[17px] stroke-[1.5]" />
                        )}
                    </button>
                </div>
            </div>

            {/* Menu thả xuống cho Mobile */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-background/80 backdrop-blur-md border-b border-foreground/5 animate-in slide-in-from-top-5 duration-300 shadow-lg">
                    <nav className="flex flex-col p-6 pb-8 gap-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsVisible(true);
                                    isNavScrolling.current = true;
                                    if (navScrollTimer.current) clearTimeout(navScrollTimer.current);
                                    navScrollTimer.current = setTimeout(() => {
                                        isNavScrolling.current = false;
                                    }, 1200);
                                }}
                                className="text-[10px] font-semibold tracking-[0.2em] text-foreground/80 hover:text-foreground py-3 transition-colors border-b border-foreground/5 font-sans whitespace-nowrap"
                            >
                                {link.label}
                            </a>
                        ))}

                        {/* Nút Đổi Theme ở cuối menu */}
                        <div className="flex items-center justify-between pt-4 mt-2 border-t border-foreground/5">
                            <span className="text-[10px] font-semibold tracking-[0.2em] text-foreground/40 font-sans">THEME MODE</span>
                            <button
                                onClick={toggleTheme}
                                className="w-9 h-9 rounded-full border border-foreground/10 hover:border-foreground/25 hover:bg-foreground/5 flex items-center justify-center transition-all duration-300 cursor-pointer text-foreground"
                                aria-label="Toggle Theme"
                            >
                                {theme === "light" ? (
                                    <Moon className="w-[17px] h-[17px] stroke-[1.5]" />
                                ) : (
                                    <Sun className="w-[17px] h-[17px] stroke-[1.5]" />
                                )}
                            </button>
                        </div>

                        {/* Mạng xã hội trên Mobile */}
                        <div className="flex items-center justify-center gap-4 pt-4 mt-2 border-t border-foreground/5">
                            <a
                                href="https://www.linkedin.com/in/piin-nhs/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-foreground/10 hover:border-foreground/25 flex items-center justify-center transition-all duration-300 text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                                aria-label="LinkedIn"
                            >
                                <FiLinkedin className="w-[15px] h-[15px]" strokeWidth={1.8} />
                            </a>
                            <a
                                href="https://github.com/piin-nhs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-foreground/10 hover:border-foreground/25 flex items-center justify-center transition-all duration-300 text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                                aria-label="GitHub"
                            >
                                <FiGithub className="w-[15px] h-[15px]" strokeWidth={1.8} />
                            </a>
                            <a
                                href="https://www.facebook.com/piin.nhs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-foreground/10 hover:border-foreground/25 flex items-center justify-center transition-all duration-300 text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                                aria-label="Facebook"
                            >
                                <FiFacebook className="w-[15px] h-[15px]" strokeWidth={1.8} />
                            </a>
                            <a
                                href="https://www.instagram.com/piin_nhs/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-foreground/10 hover:border-foreground/25 flex items-center justify-center transition-all duration-300 text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                                aria-label="Instagram"
                            >
                                <FiInstagram className="w-[15px] h-[15px]" strokeWidth={1.8} />
                            </a>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
