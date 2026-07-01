import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import Product from "@/models/Product";

const sampleProducts = [
  {
    name: "HeLiFly Drone X1 (Standard)",
    slug: "helifly-drone-x1-standard",
    price: 15990000,
    originalPrice: 18990000,
    description: "Next-generation smart drone featuring an 8K camera with a 3-axis gimbal, omni-directional obstacle sensing, and up to 40 minutes of flight time.",
    image: "/images/products/product_01.webp",
    category: "drone",
    features: [
      "Professional 8K Ultra HD Camera",
      "3-Axis Mechanical Gimbal",
      "Smart Omni-directional Obstacle Avoidance",
      "40 Minutes Flight Time",
      "Up to 12km HD Video Transmission"
    ],
    specs: {
      "Weight": "249g (No registration required)",
      "Resolution": "48MP Photo, 8K/30fps Video",
      "Flight Time": "Up to 40 minutes",
      "Sensors": "Omni-directional cameras",
      "Wind Resistance": "Level 5 (up to 38km/h)",
      "Positioning": "GPS + GLONASS + Galileo"
    },
    inStock: true,
    rating: 4.8
  },
  {
    name: "HeLiControl Smart Remote",
    slug: "helicontrol-smart-remote",
    price: 4500000,
    originalPrice: 5500000,
    description: "High-precision smart remote controller featuring a white premium grip, dual high-gain antennas, and an integrated adjustable phone mount.",
    image: "/images/products/product_02.webp",
    category: "accessory",
    features: [
      "Dual high-gain antennas for 12km range",
      "White premium ergonomic grip design",
      "Integrated adjustable smartphone mount",
      "Precision metal control joysticks",
      "4-hour long-lasting built-in battery"
    ],
    specs: {
      "Transmission": "OcuSync 3.0 (up to 12km)",
      "Battery Life": "Up to 4 hours",
      "Frequency": "2.4 GHz / 5.8 GHz",
      "Compatibility": "HeLiFly Drone X1 Series",
      "Charging Port": "USB Type-C Fast Charge"
    },
    inStock: true,
    rating: 4.9
  },
  {
    name: "HeLiPower Brushless Motor (Pair)",
    slug: "helipower-brushless-motor",
    price: 1890000,
    originalPrice: 2200000,
    description: "High-efficiency 2312 brushless motors designed by DJI Propulsion Laboratory. Delivering maximum lift force, silent operation, and long endurance.",
    image: "/images/products/product_03.webp",
    category: "accessory",
    features: [
      "DJI 2312 high-performance motors",
      "Special electromagnetic design for silent flights",
      "Integrated CW & CCW self-tightening threads",
      "Up to 25% more lift force than standard motors",
      "Durable high-temperature copper coils"
    ],
    specs: {
      "Model": "DJI 2312",
      "KV Rating": "960 KV",
      "Weight": "55g per motor",
      "Stator Size": "23 x 12 mm",
      "Input Voltage": "3S - 4S LiPo"
    },
    inStock: true,
    rating: 4.7
  }
];

export async function GET() {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});

    // Insert exactly 3 products
    const insertedProducts = await Product.insertMany(sampleProducts);

    return NextResponse.json({
      success: true,
      message: "Seeded database successfully with Drone and 2 user uploaded accessories!",
      count: insertedProducts.length,
      data: insertedProducts
    });
  } catch (error: any) {
    console.error("Lỗi seed dữ liệu:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Server error seeding data",
      },
      { status: 500 }
    );
  }
}
