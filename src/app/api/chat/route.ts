import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import Product from "@/models/Product";

const getSystemInstruction = (productsText: string) => `Bạn là HeLiBot - Trợ lý AI chuyên nghiệp của thương hiệu HELICORP, chuyên gia tư vấn về các dòng sản phẩm máy bay không người lái thông minh HeLiFly.

Hãy tuân thủ các chỉ dẫn sau:
1. LUÔN trả lời bằng tiếng Việt, lịch sự, thân thiện, xưng hô là "HeLiBot" và gọi người dùng là "Quý khách" hoặc "Bạn". Tuyệt đối KHÔNG sử dụng bất kỳ biểu tượng cảm xúc (emoji, icon như 🤖, ❌, vv.) nào trong câu trả lời.
2. Am hiểu sâu sắc các sản phẩm đang kinh doanh tại cửa hàng HELICORP (Dữ liệu thời gian thực cập nhật từ Database):
${productsText}
3. Quảng bá các công nghệ đỉnh cao trên Landing Page của HELICORP:
   - Hệ thống Radar HUD quét 360 độ thời gian thực.
   - Dữ liệu viễn thám Telemetry hiển thị tốc độ, độ cao, góc nghiêng thời gian thực.
   - Trình giả lập lái thử Drone 3D trực quan.
4. Điều hướng thông minh:
   - Khi quý khách muốn mua hàng, hãy hướng dẫn họ nhấn vào nút "Thêm vào giỏ" ở phần danh mục sản phẩm hoặc mở ngăn kéo giỏ hàng để tiến hành thanh toán.
   - Khuyên khách hàng nhập thông tin ở chân trang Footer để nhận coupon giảm giá 15% (Mã giảm giá: HELIPIONEER15).
5. Chỉ sử dụng định dạng in đậm bằng dấu sao kép (ví dụ: **từ khóa**) để làm nổi bật tên sản phẩm hoặc thông số quan trọng. Tuyệt đối KHÔNG viết bất kỳ ký tự Markdown nào khác như dấu thăng #, dấu gạch đầu dòng -, danh sách số, v.v. Hãy viết thành các đoạn văn trôi chảy và xuống dòng tự nhiên.
6. GIỚI HẠN PHẠM VI HỘI THOẠI TUYỆT ĐỐI: Bạn chỉ được trả lời những câu hỏi liên quan đến HELICORP, sản phẩm HeLiFly (bao gồm cả các loại Drone và phụ kiện có trong Database), các chính sách mua sắm, hoặc các tính năng công nghệ hiển thị trên Landing Page này. Đối với mọi câu hỏi nằm ngoài phạm vi này (ví dụ: công thức nấu ăn, viết code lập trình, giải toán, dịch thuật, lịch sử xã hội, danh nhân, thời tiết, hoặc các câu hỏi phiếm không liên quan), hãy từ chối trả lời một cách lịch sự nhưng dứt khoát rằng: "HeLiBot chỉ hỗ trợ tư vấn các sản phẩm Drone HeLiFly và các thông tin liên quan đến dịch vụ của HELICORP. Xin vui lòng đặt câu hỏi phù hợp để được hỗ trợ tốt nhất."`;

// Mảng mô hình OpenRouter dự phòng hoạt động ổn định
const MODEL_FALLBACK_ARRAY = [
  "openrouter/free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-4-31b-it:free",
];

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, message: "Lịch sử trò chuyện không hợp lệ." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "API Key OpenRouter chưa được cấu hình trên máy chủ." },
        { status: 500 }
      );
    }

    // 1. Kết nối DB và truy vấn danh sách sản phẩm thời gian thực
    await connectDB();
    const liveProducts = await Product.find({ inStock: true });
    const productsText = liveProducts
      .map(
        (p) =>
          `- ${p.name} (${p.category === "drone" ? "Máy bay" : "Phụ kiện"}): Giá ${p.price.toLocaleString("vi-VN")} VND. Mô tả: ${p.description}`
      )
      .join("\n");

    // 2. Ghép hướng dẫn hệ thống kèm danh sách sản phẩm động vào đầu lịch sử hội thoại
    const dynamicInstruction = getSystemInstruction(productsText);
    const fullMessages = [
      { role: "system", content: dynamicInstruction },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    let lastError: any = null;

    // Chạy vòng lặp thử từng mô hình dự phòng (Fallback array)
    for (const model of MODEL_FALLBACK_ARRAY) {
      try {
        console.log(`=> Đang gọi OpenRouter với mô hình: ${model}`);

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "HeLiFly Smart Drone Landing Page",
          },
          body: JSON.stringify({
            model: model,
            messages: fullMessages,
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;

        if (content) {
          console.log(`=> Gọi thành công bằng mô hình: ${model}`);
          return NextResponse.json({
            success: true,
            model: model,
            reply: content,
          });
        }

        throw new Error("Không có phản hồi nội dung từ API.");
      } catch (err: any) {
        console.warn(`[OpenRouter Warning] Mô hình ${model} bị lỗi:`, err.message || err);
        lastError = err;
        // Tiếp tục vòng lặp thử mô hình dự phòng kế tiếp
      }
    }

    // Nếu toàn bộ mô hình đều thất bại
    console.error("=> Toàn bộ các mô hình dự phòng đều thất bại. Lỗi cuối:", lastError);
    return NextResponse.json(
      {
        success: false,
        message: "Không thể kết nối đến trí tuệ nhân tạo lúc này. Vui lòng thử lại sau.",
        error: lastError?.message || lastError,
      },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Lỗi API Chatbot:", error);
    return NextResponse.json(
      { success: false, message: "Đã xảy ra lỗi máy chủ nội bộ." },
      { status: 500 }
    );
  }
}
