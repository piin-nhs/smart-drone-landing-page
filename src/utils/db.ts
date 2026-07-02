import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Vui lòng cấu hình file .env MONGODB_URI");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Khai báo kiểu dữ liệu cho biến global
declare global {
  var mongoose: MongooseCache | undefined;
}

// Khởi tạo vùng nhớ cache ngắn gọn
const cached: MongooseCache = global.mongoose ?? (global.mongoose = { conn: null, promise: null });

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, { bufferCommands: false }).then((mongooseInstance) => {
      console.log("=> Tạo kết nối MongoDB mới thành công");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("=> Lỗi kết nối MongoDB:", error);
    throw error;
  }

  return cached.conn;
}