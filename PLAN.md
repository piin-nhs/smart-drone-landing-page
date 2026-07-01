# 🛸 Kế Hoạch Triển Khai Landing Page Smart Drone (HeLiFly Project)

Dự án xây dựng một trang Landing Page cao cấp, thẩm mỹ cao giới thiệu sản phẩm Drone thông minh thuộc hệ sinh thái **HELICORP**. Trang web tích hợp đầy đủ các tính năng cốt lõi và tất cả các cấu phần điểm cộng: Chế độ tối (Dark Mode), Cuộn trang kể chuyện (Scrollytelling), Tính năng thương mại điện tử mini, Chatbot tư vấn bằng AI đa mô hình dự phòng qua OpenRouter, và tích hợp Webhook lưu hành vi/gửi form.

## 🏗️ Kiến Trúc Hệ Thống & Công Nghệ

Dự án sử dụng **Next.js (App Router)** làm framework chính dưới dạng một ứng dụng **Monorepo/Monolith** duy nhất để tối ưu hóa hiệu năng và triển khai đồng bộ lên Vercel.

* **Frontend:** React 19, TypeScript, Tailwind CSS (Styling), Framer Motion (Animations), React Hook Form + Zod (Validation), Zustand hoặc React Context (State Management).
* **Backend (API Routes):** Next.js Route Handlers (Node.js runtime).
* **Database:** MongoDB Atlas (Mongoose ODM) với cơ chế Single-connection caching cho Serverless.
* **AI Integration:** OpenRouter API (Tự động chuyển đổi mô hình: `Gemini 1.5 Flash` làm mặc định $\rightarrow$ `Llama 3` dự phòng khi nghẽn/lỗi).
* **Third-party:** Discord Webhook (Theo dõi hệ thống thực tế), Resend/Nodemailer (Dịch vụ gửi Dual-Email).

---

## 🌳 Chiến Lược Phân Nhánh Git (Git Branching Strategy)

Dự án tuân thủ nghiêm ngặt quy trình Git Workflow khoa học, tách biệt môi trường phát triển thử nghiệm và sản phẩm chạy live.

* `main`: Nhánh sản phẩm sạch, ổn định 100%, kết nối trực tiếp với Vercel Production.
* `develop`: Nhánh tích hợp chính (Integration branch). Toàn bộ các nhánh tính năng phải bẻ ra từ đây và gộp ngược về đây sau khi kiểm thử thành công.

### Danh sách các nhánh tính năng tuần tự (Feature Branches):
1. `feature/01-setup-project`
2. `feature/02-database-backend`
3. `feature/03-hero-and-scrollytelling`
4. `feature/04-ecommerce-mini`
5. `feature/05-webhook-mail-tracking`
6. `feature/06-chatbot-openrouter`
7. `feature/07-performance-seo`

---

## 🛠️ Các Bước Triển Khai Chi Tiết

### Giai đoạn 1: Khởi tạo dự án (`feature/01-setup-project`)
* Khởi tạo dự án Next.js sử dụng TypeScript, Tailwind CSS, App Router và ESLint tại thư mục gốc.
* Xây dựng cấu trúc thư mục chuẩn: `src/components`, `src/hooks`, `src/contexts`, `src/utils`, `src/models`, và `src/app/api`.
* Cấu hình hệ thống màu sắc (Color palette) và typography trong `tailwind.config.ts` mang phong cách tương lai (Deep Dark `#0b0f19` kết hợp ánh sáng neon cyan/blue).
* Cài đặt cấu hình hỗ trợ Dark Mode dạng thuộc tính lớp (`class`).

### Giai đoạn 2: Cơ sở dữ liệu & API Backend (`feature/02-database-backend`)
* Cấu hình kết nối MongoDB bằng `mongoose` sử dụng cơ chế **Global Cached Connection** để tối ưu hóa tài nguyên trên môi trường Serverless (Vercel Functions), tránh lỗi tràn kết nối của Atlas Free Tier.
* Xây dựng các Schema/Model dữ liệu:
    * `Product`: Lưu thông tin danh mục sản phẩm Drone chính và phụ kiện sinh thái bổ trợ.
    * `Contact`: Lưu thông tin đăng ký nhận tin / liên hệ từ form (Kho lưu trữ gốc an toàn trước khi bắn Webhook).
    * `UserBehavior`: Ghi nhận dữ liệu tracking (sự kiện click, mốc scroll depth) phục vụ phân tích hành vi ngầm, tránh spam kênh thông báo.
* Tạo các API route nền tảng trong `src/app/api/products/route.ts` để cung cấp dữ liệu cho Frontend.

### Giai đoạn 3: Hero & Cuộn kể chuyện (`feature/03-hero-and-scrollytelling`)
* Thiết kế Header/Navbar cố định (`sticky`) tích hợp nút gạt Dark/Light Mode mượt mà và các liên kết neo cuộn trang mượt (`smooth scroll`).
* Thiết kế Hero Section hoành tráng với hình ảnh/video Drone chất lượng cao, tiêu đề ấn tượng và nút kêu gọi hành động (CTA).
* Tạo hiệu ứng Scrollytelling và Parallax sử dụng `framer-motion` (kết hợp `useScroll`, `useTransform`), mô tả trực quan các linh kiện bóc tách, thông số bay, và cụm camera của Drone khi người dùng cuộn chuột.

### Giai đoạn 4: Thương mại điện tử Mini (`feature/04-ecommerce-mini`)
* **Kiến trúc danh mục sản phẩm thương mại:** Thiết kế module hiển thị tập trung vào **1 sản phẩm Drone đinh** và hệ sinh thái các **sản phẩm bổ trợ phụ kiện** đi kèm ngay phía dưới (Bố cục Grid Layout):
    1. *Sản phẩm đinh (Hero Product):* `HeLiFly Drone X1 (Standard)` - Máy bay không người lái thông minh.
    2. *Biến thể cao cấp (Variant Combo):* `HeLiFly Drone X1 (Pro Combo)` - Trọn bộ kèm 3 pin và dock sạc nhanh.
    3. *Sản phẩm bổ trợ 1 (Hình ảnh):* `HeLiVision FPV Glass` - Kính thực tế ảo truyền hình ảnh góc nhìn thứ nhất.
    4. *Sản phẩm bổ trợ 2 (Năng lượng):* `HeLiPower Smart Battery` - Pin thông minh tăng thời gian bay.
    5. *Sản phẩm bổ trợ 3 (Bảo vệ):* `HeLiFly Propeller v1` - Cánh quạt carbon dự phòng.
* Quản lý trạng thái bằng React Context/Zustand cho các tính năng: Giỏ hàng (`slide-over drawer`), Danh sách yêu thích (`Favorites`), và Danh sách sản phẩm đã xem gần đây (`Recently Viewed`).
* Đồng bộ dữ liệu an toàn xuống `localStorage`. Áp dụng giải pháp kiểm tra trạng thái mount ở Client để tránh lỗi **Hydration Mismatch** của Next.js SSR.

### Giai đoạn 5: Biểu mẫu & Webhook (`feature/05-webhook-mail-tracking`)
* Thiết kế Form Đăng ký nhận tin / nhận ưu đãi độc quyền ở cuối trang (Footer Section) gồm các trường: Họ tên, Email, Số điện thoại.
* Thực hiện kiểm tra tính hợp lệ dữ liệu (validation) nghiêm ngặt phía Client bằng `react-hook-form` kết hợp `zod` để chặn hoàn toàn dữ liệu rác trước khi gửi lên Server.
* Xây dựng API Route tiếp nhận form: Thực hiện lưu dữ liệu sạch vào MongoDB Atlas, đồng thời gọi song song 2 tiến trình:
    * Bắn dữ liệu cấu trúc đẹp mắt sang hệ thống **Discord Webhook** thời gian thực để quản trị viên dễ dàng theo dõi hệ thống.
    * Kích hoạt tiến trình gửi **Dual-Email**: 1 email cảm ơn tự động kèm mã giảm giá gửi tới khách hàng, và 1 email thông báo hệ thống gửi tới hòm thư quản trị viên.
* Tích hợp Client-side tracking: Theo dõi hành vi người dùng khi cuộn trang đạt các mốc (25%, 50%, 75%, 100%) hoặc click nút chức năng, tự động gửi dữ liệu ngầm về API `UserBehavior` để lưu trữ dữ liệu lớn (Big Data) và hiển thị Toast thông báo tương tác sinh động.

### Giai đoạn 6: Chatbot tư vấn AI đa mô hình (`feature/06-chatbot-openrouter`)
* Xây dựng widget bong bóng chatbot trực tuyến ở góc dưới bên phải màn hình, hỗ trợ đóng/mở mượt mà kèm hiệu ứng Micro-interactions.
* Tạo API Route trung gian kết nối an toàn với **OpenRouter API**, bảo mật tuyệt đối `OPENROUTER_API_KEY` trong môi trường Server.
* Cấu hình **Mảng mô hình dự phòng (Fallback Array)** trong code Backend: Ưu tiên gọi mô hình thông minh nhất `google/gemini-1.5-flash:free`. Nếu OpenRouter trả về lỗi hoặc hết lượt dùng (Rate Limit), hệ thống tự động nuốt lỗi và chuyển sang gọi mô hình Free dự phòng `meta-llama/llama-3-8b-instruct:free` để chatbot luôn trong trạng thái "bất tử".
* Cấu hình **System Instruction (Prompt hệ thống)** truyền lên OpenRouter: Định hình AI trở thành chuyên gia tư vấn sản phẩm cao cấp của thương hiệu HeLiFly, am hiểu sâu sắc thông số kỹ thuật và triết lý dịch vụ của HELICORP.
* Xử lý trạng thái chờ phản hồi bằng hiệu ứng **Skeleton Loading** nhấp nháy.

### Giai đoạn 7: Tối ưu hiệu năng & SEO (`feature/07-performance-seo`)
* Cấu hình Metadata toàn diện cho Next.js Metadata API: `title`, `description`, cấu hình đầy đủ Open Graph (`og:image`, `og:title`, `og:type`) phục vụ hiển thị liên kết mạng xã hội chuẩn chỉnh.
* Tối ưu hóa hình ảnh tài nguyên: Chuyển đổi toàn bộ định dạng ảnh sang `.webp` dung lượng thấp, tận dụng tối đa sức mạnh tối ưu tự động của component `next/image` kết hợp thuộc tính `loading="lazy"`.
* Tối ưu hóa mã nguồn thông qua việc phân tách bundle và chạy kiểm tra Lighthouse/PageSpeed Insights.

---

## 🔐 Cấu Hình Biến Môi Trường (File `.env.example`)

Để chạy được toàn bộ hệ thống này, các biến môi trường sau cần được chuẩn bị sẵn ở local và cấu hình trực tiếp trên Vercel Dashboard:
```env
# Database Connections
MONGODB_URI=mongodb+srv://nhsang2709:sang1234@cluster...mongodb.net/helicorp-drone

# AI Chatbot Integration (OpenRouter Gateway)
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxx

# System Notifications & Mail Services
DISCORD_WEBHOOK_URL=[https://discord.com/api/webhooks/](https://discord.com/api/webhooks/)...
RESEND_API_KEY=re_xxxxxxxxx