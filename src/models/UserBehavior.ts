import mongoose, { Schema, Document, model, models } from "mongoose";
import { UserBehavior } from "@/types";

export interface IUserBehavior extends Omit<UserBehavior, "_id" | "createdAt" | "updatedAt">, Document { }

const UserBehaviorSchema = new Schema<IUserBehavior>(
  {
    sessionId: { type: String, required: true },
    eventType: { type: String, enum: ["click", "scroll", "pageview"], required: true },
    eventData: { type: Schema.Types.Mixed, default: {} },
    userAgent: { type: String, required: true },
    ip: { type: String },
  },
  { timestamps: true }
);

export default models.UserBehavior || model<IUserBehavior>("UserBehavior", UserBehaviorSchema);
