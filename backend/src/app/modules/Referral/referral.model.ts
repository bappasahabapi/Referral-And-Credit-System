import mongoose, { Schema, model, type InferSchemaType } from "mongoose";

const referralSchema = new Schema(
  {
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    referredUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONVERTED"],
      default: "PENDING",
      index: true,
    },
    creditedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type ReferralDoc = InferSchemaType<typeof referralSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const Referral = model("Referral", referralSchema);
