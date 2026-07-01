import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import Product from "@/models/Product";

const sampleProducts = [
  {
    name: "HeLiFly Drone X1 (Standard)",
    slug: "helifly-drone-x1-standard",
    price: 15990000,
    originalPrice: 18990000,
    description: "Máy bay không người lái thông minh thế hệ mới tích hợp camera 8K Gimbal 3 trục, cảm biến tránh vật cản omni-directional và thời lượng bay lên tới 40 phút.",
    image: "/images/products/drone-standard.webp",
    category: "drone",
    features: [
      "Camera 8K Ultra HD chuyên nghiệp",
      "Gimbal chống rung cơ học 3 trục",
      "Tránh vật cản đa hướng thông minh",
      "Thời gian bay liên tục 40 phút",
      "Truyền hình ảnh HD xa tới 12km"
    ],
    specs: {
      "Trọng lượng": "249g (Không cần đăng ký ở nhiều nước)",
      "Độ phân giải": "Hình ảnh 48MP, Video 8K/30fps",
      "Thời gian bay": "Tối đa 40 phút",
      "Cảm biến va chạm": "Cảm biến hồng ngoại & camera đa hướng",
      "Kháng gió": "Cấp độ 5 (tối đa 38km/h)",
      "Định vị": "GPS + GLONASS + Galileo"
    },
    inStock: true,
    rating: 4.8
  },
  {
    name: "HeLiFly Drone X1 (Pro Combo)",
    slug: "helifly-drone-x1-pro-combo",
    price: 21990000,
    originalPrice: 24990000,
    description: "Trọn bộ giải pháp bay chuyên nghiệp HeLiFly Drone X1 kèm theo 3 pin thông minh, dock sạc nhanh hai chiều, bộ cánh dự phòng và túi da đựng cao cấp bảo vệ tối đa.",
    image: "/images/products/drone-pro-combo.webp",
    category: "drone",
    features: [
      "Trọn bộ Drone X1 cùng 3 pin thông minh",
      "Đốc sạc nhanh 3 pin đồng thời",
      "Túi chống sốc bọc da Helicorp cao cấp",
      "Bộ 8 cánh quạt carbon sơ cua",
      "Tích hợp gói bảo hiểm bay an toàn 1 năm"
    ],
    specs: {
      "Trọng lượng": "249g (Bản Combo)",
      "Độ phân giải": "Hình ảnh 48MP, Video 8K/30fps",
      "Thời gian bay": "Tổng cộng 120 phút (40 phút x 3 pin)",
      "Phụ kiện đi kèm": "3 Pin, Dock Sạc, Túi da, Cánh dự phòng, Gói Care+",
      "Thời gian sạc": "60 phút sạc đầy cả 3 pin với sạc nhanh"
    },
    inStock: true,
    rating: 5.0
  },
  {
    name: "HeLiVision FPV Glass v1",
    slug: "helivision-fpv-glass-v1",
    price: 8500000,
    originalPrice: 9900000,
    description: "Kính thực tế ảo FPV truyền hình ảnh góc nhìn thứ nhất với độ phân giải siêu nét FHD 1080p, tần số quét 120Hz và độ trễ cực thấp dưới 28ms, đem lại cảm giác bay lượn như chim.",
    image: "/images/products/fpv-glass.webp",
    category: "accessory",
    features: [
      "Màn hình OLED kép độ phân giải FHD",
      "Tần số quét 120Hz mượt mà",
      "Độ trễ truyền tải hình ảnh < 28ms",
      "Góc nhìn siêu rộng FOV lên tới 150 độ",
      "Thiết kế công thái học nhẹ và êm ái"
    ],
    specs: {
      "Màn hình": "Dual-OLED 0.49 inch",
      "Độ phân giải hiển thị": "1920x1080 mỗi mắt",
      "Độ trễ": "Tối thiểu 28ms",
      "Tần số quét": "120Hz",
      "Thời lượng pin kính": "Hoạt động liên tục 2.5 giờ"
    },
    inStock: true,
    rating: 4.7
  },
  {
    name: "HeLiPower Smart Battery",
    slug: "helipower-smart-battery",
    price: 2490000,
    originalPrice: 2800000,
    description: "Pin LiPo 4S thông minh tích hợp chip quản lý năng lượng tự động xả khi không sử dụng dài ngày để bảo vệ pin và hiển thị dung lượng chính xác qua hệ thống LED ngoài.",
    image: "/images/products/smart-battery.webp",
    category: "accessory",
    features: [
      "Dung lượng cao 3850mAh",
      "Hệ thống quản lý pin thông minh BMS",
      "Tự động xả bảo vệ khi lưu kho",
      "Thiết bị chống cháy nổ an toàn",
      "Dễ dàng lắp ráp và kết nối nhanh"
    ],
    specs: {
      "Loại Pin": "LiPo 4S (Lithium Polymer)",
      "Dung lượng": "3850 mAh (59.29 Wh)",
      "Điện áp": "15.4 V",
      "Trọng lượng": "120g",
      "Nhiệt độ sạc": "5°C đến 40°C"
    },
    inStock: true,
    rating: 4.9
  },
  {
    name: "HeLiFly Propeller v1 (Carbon)",
    slug: "helifly-propeller-v1-carbon",
    price: 590000,
    originalPrice: 750000,
    description: "Cặp cánh quạt carbon siêu nhẹ và bền bỉ giúp drone giảm độ ồn tối đa khi bay, tăng lực nâng và tối ưu hóa hiệu suất tiêu thụ năng lượng của động cơ.",
    image: "/images/products/propeller.webp",
    category: "accessory",
    features: [
      "Vật liệu sợi carbon siêu nhẹ và cứng cáp",
      "Thiết kế khí động học giảm thiểu tiếng ồn",
      "Hệ thống khóa nhanh tháo lắp tiện lợi",
      "Kháng lực va đập vật lý cực tốt",
      "Cân bằng động chính xác tuyệt đối"
    ],
    specs: {
      "Vật liệu": "90% Sợi Carbon cao cấp",
      "Số lượng đóng gói": "1 Cặp (1 cánh thuận CW + 1 cánh nghịch CCW)",
      "Trọng lượng": "4.8g mỗi cánh",
      "Đường kính x Bước ren": "7.2 x 3.8 inches"
    },
    inStock: true,
    rating: 4.6
  }
];

export async function GET() {
  try {
    await connectDB();
    
    // Xóa toàn bộ sản phẩm cũ để tránh trùng lặp
    await Product.deleteMany({});
    
    // Thêm các sản phẩm mẫu mới
    const insertedProducts = await Product.insertMany(sampleProducts);
    
    return NextResponse.json({
      success: true,
      message: "Đã xóa dữ liệu cũ và hạt giống (seeded) 5 sản phẩm thành công!",
      count: insertedProducts.length,
      data: insertedProducts
    });
  } catch (error: any) {
    console.error("Lỗi seed dữ liệu:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Lỗi máy chủ khi seed dữ liệu",
      },
      { status: 500 }
    );
  }
}
