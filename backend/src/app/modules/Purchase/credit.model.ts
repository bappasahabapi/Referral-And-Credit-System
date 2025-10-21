import mongoose, { Schema, model, type InferSchemaType } from 'mongoose';

const creditSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  meta: { type: String }
}, { timestamps: { createdAt: true, updatedAt: false } });

//!fix prevent duplicate payouts and need to check again
creditSchema.index({ userId: 1, reason: 1, meta: 1 }, { unique: true });

export type CreditDoc = InferSchemaType<typeof creditSchema> & { _id: mongoose.Types.ObjectId };
export const CreditLedger = model('CreditLedger', creditSchema);
