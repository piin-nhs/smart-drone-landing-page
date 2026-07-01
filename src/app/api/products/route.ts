import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Products API endpoint placeholder for Giai đoạn 2",
    data: []
  });
}
