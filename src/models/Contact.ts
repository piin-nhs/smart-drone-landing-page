import mongoose, { Schema, Document, model, models } from "mongoose";
import { Contact } from "@/types";

export interface IContact extends Omit<Contact, "_id" | "createdAt" | "updatedAt">, Document { }

const ContactSchema = new Schema<IContact>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["new", "contacted", "ignored"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default models.Contact || model<IContact>("Contact", ContactSchema);
