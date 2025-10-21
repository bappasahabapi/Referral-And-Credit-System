import mongoose, { Schema, model, type InferSchemaType } from "mongoose";

const purchaseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    isFirst: { type: Boolean, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

purchaseSchema.index({ userId: 1, createdAt: -1 });

export type PurchaseDoc = InferSchemaType<typeof purchaseSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const Purchase = model("Purchase", purchaseSchema);
