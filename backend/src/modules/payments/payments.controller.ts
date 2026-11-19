import { randomUUID } from "node:crypto";
import { z } from "zod";
import { env } from "../../config/env";
import { asyncHandler } from "../../utils/asyncHandler";
import { HttpError } from "../../utils/httpError";
import { createOrder, findUserOrder, priceCart, setOrderStatus } from "../orders/orders.service";
import { getPaymentStatus, requestToPay } from "./momo.service";

const initiateSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variant: z.string().min(1),
        quantity: z.number().int().positive().max(100),
      })
    )
    .min(1),
  phone: z.string().regex(/^\d{9,15}$/, "Enter a valid Mobile Money number"),
  customer: z
    .object({
      name: z.string().trim().min(1).max(100),
      phone: z.string().trim().min(5).max(20),
      mode: z.enum(["pickup", "delivery"]),
      address: z.string().trim().max(300).optional(),
    })
    .refine((c) => c.mode === "pickup" || !!c.address, {
      message: "Delivery address is required",
      path: ["address"],
    }),
});

export const initiatePayment = asyncHandler(async (req, res) => {
  const { items, phone, customer } = initiateSchema.parse(req.body);
  const { lines, total } = priceCart(items);
  const referenceId = randomUUID();

  await createOrder({
    referenceId,
    user: req.user!.id,
    items: lines,
    customer,
    amount: total,
    currency: env.MOMO_CURRENCY,
    phone,
    status: "PENDING",
  });

  try {
    await requestToPay({
      referenceId,
      amount: total,
      phone,
      externalId: referenceId,
      message: "Royal Crest order",
    });
  } catch {
    await setOrderStatus(referenceId, "FAILED", "Could not start payment");
    throw new HttpError(502, "Could not start MoMo payment");
  }

  res.status(202).json({ orderId: referenceId, status: "PENDING", amount: total });
});

export const paymentStatus = asyncHandler(async (req, res) => {
  const orderId = String(req.params.orderId);
  const order = await findUserOrder(orderId, req.user!.id);
  if (!order) throw new HttpError(404, "Order not found");

  let status = order.status as string;
  if (status === "PENDING") {
    const momo = await getPaymentStatus(orderId);
    if (momo.status === "SUCCESSFUL") {
      await setOrderStatus(orderId, "PAID");
      status = "PAID";
    } else if (momo.status === "FAILED") {
      await setOrderStatus(orderId, "FAILED", momo.reason ?? "Payment failed");
      status = "FAILED";
    }
  }
  res.json({ orderId, status });
});
