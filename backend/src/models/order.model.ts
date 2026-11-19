import { Schema, model } from "mongoose";

const itemSchema = new Schema(
  { productId: String, name: String, variant: String, price: Number, quantity: Number },
  { _id: false }
);

const customerSchema = new Schema(
  {
    name: String,
    phone: String, // contact number
    mode: { type: String, enum: ["pickup", "delivery"] },
    address: String,
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    referenceId: { type: String, required: true, unique: true }, // also MoMo X-Reference-Id
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: [itemSchema],
    customer: customerSchema,
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    phone: { type: String, required: true }, // MoMo number that pays
    status: { type: String, enum: ["PENDING", "PAID", "FAILED"], default: "PENDING" },
    failureReason: String,
  },
  { timestamps: true }
);

export const Order = model("Order", orderSchema);
