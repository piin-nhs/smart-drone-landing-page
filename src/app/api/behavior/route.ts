import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import UserBehavior from "@/models/UserBehavior";
import * as z from "zod";

// Zod Schema validate hành vi người dùng
const behaviorSchema = z.object({
  sessionId: z.string(),
  eventType: z.enum(["click", "scroll", "pageview"]),
  eventData: z.record(z.string(), z.any()),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate dữ liệu
    const validation = behaviorSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Dữ liệu hành vi không hợp lệ." },
        { status: 400 }
      );
    }

    const { sessionId, eventType, eventData } = validation.data;

    // 2. Lấy thông tin User Agent và IP từ Header
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";

    // 3. Kết nối CSDL và lưu dữ liệu
    await connectDB();
    const newBehavior = new UserBehavior({
      sessionId,
      eventType,
      eventData,
      userAgent,
      ip,
    });
    await newBehavior.save();

    return NextResponse.json({
      success: true,
      message: "Ghi nhận hành vi thành công!",
    });
  } catch (error) {
    console.error("Lỗi lưu hành vi người dùng:", error);
    return NextResponse.json(
      { success: false, message: "Đã xảy ra lỗi máy chủ nội bộ." },
      { status: 500 }
    );
  }
}
