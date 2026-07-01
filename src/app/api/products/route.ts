import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({ inStock: true }).sort({ category: 1, price: -1 });
    
    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    console.error("Lỗi lấy danh sách sản phẩm:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Lỗi máy chủ nội bộ khi lấy sản phẩm",
      },
      { status: 500 }
    );
  }
}
