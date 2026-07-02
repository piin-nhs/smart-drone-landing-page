import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import Contact from "@/models/Contact";
import nodemailer from "nodemailer";
import * as z from "zod";

// Zod Schema để validate dữ liệu ở server
const subscribeSchema = z.object({
  fullName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/),
});

// Cấu hình Nodemailer transporter với Gmail App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate dữ liệu đầu vào phía Server
    const validation = subscribeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Dữ liệu đầu vào không hợp lệ." },
        { status: 400 }
      );
    }

    const { fullName, email, phone } = validation.data;

    // 2. Kết nối CSDL và lưu dữ liệu sạch
    await connectDB();

    // Kiểm tra xem email này đã đăng ký trước đó chưa
    const existingSubscription = await Contact.findOne({ email });
    if (existingSubscription) {
      return NextResponse.json(
        { success: false, message: "Email này đã đăng ký nhận tin trước đó rồi." },
        { status: 400 }
      );
    }

    // Lưu vào bộ sưu tập Contact
    const newSubscription = new Contact({
      fullName,
      email,
      phone,
      message: "Đăng ký nhận tin từ chân trang Footer",
      status: "new",
    });
    await newSubscription.save();

    // 3. Gửi thông tin sang Discord Webhook (chờ hoàn thành)
    const discordUrl = process.env.DISCORD_WEBHOOK_URL;
    if (discordUrl) {
      await fetch(discordUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: "THÀNH VIÊN MỚI ĐĂNG KÝ NHẬN TIN",
              color: 38233,
              fields: [
                { name: "Họ và Tên", value: fullName, inline: true },
                { name: "Số điện thoại", value: phone, inline: true },
                { name: "Email", value: email, inline: false },
                { name: "Nguồn", value: "Footer Newsletter Form", inline: true },
              ],
              timestamp: new Date().toISOString(),
              footer: { text: "HELIFLY Telemetry System" },
            },
          ],
        }),
      }).catch((err) => console.error("Lỗi gửi tin Discord Webhook:", err));
    } else {
      console.log("=> Discord Webhook URL chưa được cấu hình. Bỏ qua.");
    }

    // 4. Kích hoạt tiến trình gửi Dual-Email qua Nodemailer + Gmail (chờ hoàn thành song song)
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASS;
    if (gmailUser && gmailPass) {
      await Promise.all([
        // Email 1: Cảm ơn khách hàng kèm mã giảm giá 15%
        transporter.sendMail({
          from: `HELIFLY <${gmailUser}>`,
          to: email,
          subject: "[HELIFLY] Xác nhận đăng ký thành viên câu lạc bộ",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
              <h2 style="color: #111; text-transform: uppercase; letter-spacing: 2px;">Chào mừng bạn đến với HELIFLY, ${fullName}!</h2>
              <p>Cảm ơn bạn đã đăng ký gia nhập Câu lạc bộ Công nghệ Tương lai của HELIFLY.</p>
              <p>Như đã hứa, dưới đây là mã giảm giá <strong>15%</strong> dành riêng cho đơn hàng đầu tiên của bạn:</p>
              <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 20px; font-weight: bold; letter-spacing: 3px; border: 1px dashed #333; margin: 20px 0;">
                HELIPIONEER15
              </div>
              <p style="font-size: 12px; color: #666;">* Mã áp dụng cho tất cả sản phẩm Drone và phụ kiện thông minh trên cửa hàng trực tuyến của HELIFLY.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="font-size: 11px; color: #999; text-align: center;">© ${new Date().getFullYear()} HELIFLY. All rights reserved.</p>
            </div>
          `,
        }).catch((err) => console.error("Lỗi gửi email cho Khách hàng:", err)),

        // Email 2: Thông báo Admin hệ thống
        transporter.sendMail({
          from: `HELIFLY System <${gmailUser}>`,
          to: gmailUser,
          subject: "[HELIFLY Notification] Có thành viên mới đăng ký nhận tin",
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h3>Hệ thống HELIFLY báo cáo thành viên đăng ký mới:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Họ và Tên</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Số điện thoại</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Thời gian</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td>
                </tr>
              </table>
            </div>
          `,
        }).catch((err) => console.error("Lỗi gửi email cho Admin:", err))
      ]);
    } else {
      console.log("=> Gmail credentials chưa được cấu hình. Bỏ qua gửi email.");
    }

    return NextResponse.json({
      success: true,
      message: "Đăng ký thành công!",
    });
  } catch (error) {
    console.error("Lỗi hệ thống đăng ký:", error);
    return NextResponse.json(
      { success: false, message: "Đã xảy ra lỗi máy chủ nội bộ." },
      { status: 500 }
    );
  }
}
