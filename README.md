# 🛸 Smart Drone Landing Page - HeLiFly Project

Dự án xây dựng trang Landing Page giới thiệu và kinh doanh sản phẩm Drone thông minh thuộc hệ sinh thái **HELICORP** (Healthy Living Corporation). Đây là sản phẩm hoàn thiện các yêu cầu tuyển dụng Thực tập sinh IT phát triển Website tại [HELICORP](https://helicorp.vn).

---

## 📋 YÊU CẦU CHI TIẾT DỰ ÁN

### 1. Giao diện & Thẩm mỹ (UI/UX)
- **Công nghệ sử dụng:** Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript, Framer Motion (Xử lý mượt mà toàn bộ animation).
- **Cấu trúc trang:** Đầy đủ các phần cốt lõi:
  - **Hero Section:** Thiết kế cuốn hút, hiện đại với hiệu ứng ánh sáng tương lai và nút Kêu gọi hành động (CTA).
  - **Tính năng nổi bật:** Trình bày chi tiết những tính năng cao cấp của Drone.
  - **Thông số kỹ thuật (Spec):** Thiết kế trực quan, hiển thị đầy đủ các thông số hoạt động của thiết bị.
  - **Form đăng ký nhận tin:** Đăng ký nhận ưu đãi ở Footer, kiểm tra dữ liệu bằng Zod + React Hook Form.
- **Tư duy UI/UX:** Layout tối giản sang trọng (Sử dụng hệ màu Deep Dark `#0b0f19` kết hợp ánh sáng Neon Cyan/Blue). Khoảng cách (Spacing) và kiểu chữ (Typography - sử dụng font Bebas Neue và Inter) được tinh chỉnh hợp lý tạo trải nghiệm liền mạch.
- **Responsive:** Tương thích hoàn hảo trên mọi thiết bị (Desktop, Tablet, Mobile) không lỗi vỡ khung.

### 2. Tối ưu Hiệu năng & SEO Technical
- **Performance:** Mã nguồn và hình ảnh được tối ưu hóa. Toàn bộ hình ảnh chuyển đổi sang định dạng `.webp` dung lượng thấp, sử dụng cơ chế `next/image` và `lazy loading` đạt điểm Google PageSpeed Insights cao (tối thiểu từ 85/100 trở lên ở Mobile).
- **SEO:** Tích hợp đầy đủ Meta tags (Title, Meta Description, Open Graph cho Facebook/Zalo chia sẻ link đẹp mắt).

### 3. Triển khai & Quản lý
- **Git/GitHub:** Quản lý mã nguồn chặt chẽ bằng Git, chia nhánh tính năng khoa học (`feature/...`, `develop`, `main`) kèm commit message rõ ràng.
- **Deployment:** Deploy thành công lên Cloud miễn phí (Vercel).

---

## ⭐ CÁC ĐIỂM CỘNG ĐÃ TÍCH HỢP (BONUS FEATURES)

- **[x] Dark/Light Mode:** Hỗ trợ giao diện sáng/tối mượt mà qua thuộc tính CSS variables.
- **[x] Scrollytelling & Parallax:** Thiết kế giao diện cuộn trang kể chuyện, Drone xoay góc, phóng to/thu nhỏ và bay theo thao tác cuộn chuột cùng HUD pointer động chỉ dẫn thông số.
- **[x] E-commerce Mini:**
  - Giỏ hàng trượt từ cạnh (`Slide-over drawer`).
  - Lưu trữ danh sách sản phẩm yêu thích (`Favorites list`).
  - Hiển thị danh sách sản phẩm đã xem gần đây (`Recently Viewed`).
  - Dữ liệu đồng bộ an toàn qua `localStorage` (tránh Hydration mismatch).
- **[x] Chatbot Trực Tuyến AI Đa Mô Hình (HeLiBot):**
  - Bong bóng chat nổi ở góc màn hình.
  - Tích hợp API **OpenRouter** (gọi mô hình chính: `Gemini 2.5 Flash`, cấu hình tự động **Fallback Array** chuyển sang mô hình dự phòng `Llama 3` hoặc `Qwen` khi lỗi/nghẽn).
  - Có System Prompt định hình trợ lý chuyên nghiệp, am hiểu sản phẩm và từ chối khéo léo các câu hỏi ngoài lề.
- **[x] Backend API Routes & Database:**
  - Tích hợp cơ sở dữ liệu **MongoDB Atlas** thông qua `mongoose` để lưu trữ danh sách sản phẩm thực tế, form đăng ký liên hệ, và hành vi người dùng.
- **[x] Webhook Thực Tế & Tracking Hành Vi:**
  - Theo dõi hành vi người dùng (Mốc cuộn trang 25%, 50%, 75%, 100%, click nút, đóng mở popup) gửi dữ liệu ngầm về DB.
  - Gửi dữ liệu form liên hệ sang **Discord Webhook** thời gian thực với định dạng Rich Embed đẹp mắt.
  - Tự động kích hoạt luồng gửi email xác nhận cho khách hàng qua dịch vụ email.

---

## 📁 CẤU TRÚC THƯ MỤC CHÍNH

```bash
smart-drone-landing-page/
├── public/                 # Tài nguyên tĩnh (Hình ảnh .webp, Mockups, Icons)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API Route Handlers (chat, behavior, subscribe, products)
│   │   ├── layout.tsx      # Layout chính & Cấu hình SEO Meta
│   │   └── page.tsx        # Trang chủ Landing Page chính
│   ├── components/         # Các Component giao diện UI
│   │   ├── ChatWidget.tsx  # Widget Chatbot HeLiBot & Nút cuộn lên đầu trang
│   │   ├── Features.tsx    # Tính năng nổi bật & Scrollytelling HUD
│   │   ├── Hero.tsx        # Hero Section hoành tráng
│   │   ├── ProductCatalog.tsx # Danh mục E-commerce Mini
│   │   └── ...             # Các component bổ trợ khác
│   ├── contexts/           # Quản lý State (EcomContext, ThemeContext)
│   ├── models/             # Mongoose Schemas (Product, Contact, UserBehavior)
│   ├── types/              # Định nghĩa Typescript toàn cục (Mới Refactor tách biệt)
│   │   ├── chat.ts         # Type tin nhắn cho Chatbot
│   │   ├── features.ts     # Type cho Scrollytelling & HUD Telemetry
│   │   └── index.ts        # Index xuất bản types tập trung
│   └── utils/              # Kết nối database & các helper functions
├── README.md               # Hướng dẫn dự án và yêu cầu chi tiết
└── PLAN.md                 # Kế hoạch triển khai chi tiết các tính năng
```
