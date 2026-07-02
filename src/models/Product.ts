import mongoose, { Schema, Document, model, models } from "mongoose";
import { Product } from "@/types";

export interface IProduct extends Omit<Product, "_id" | "createdAt" | "updatedAt">, Document { }

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, enum: ["drone", "accessory"], required: true },
    features: [{ type: String }],
    specs: { type: Schema.Types.Mixed, default: {} },
    inStock: { type: Boolean, default: true },
    rating: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export default models.Product || model<IProduct>("Product", ProductSchema);
