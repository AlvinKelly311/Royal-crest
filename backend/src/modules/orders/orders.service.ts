import { CATALOG } from "../../config/catalog";
import { Order } from "../../models/order.model";
import { HttpError } from "../../utils/httpError";

export type OrderStatus = "PENDING" | "PAID" | "FAILED";
export interface CartItem { productId: string; variant: string; quantity: number }

// Prices always come from the server catalog, never from the client.
export function priceCart(items: CartItem[]) {
  let total = 0;
  const lines = items.map((i) => {
    if (!Object.hasOwn(CATALOG, i.productId)) {
      throw new HttpError(404, `Product ${i.productId} not found`);
    }
    const product = CATALOG[i.productId];
    const variant = product.variants.find((v) => v.label === i.variant);
    if (!variant) {
      throw new HttpError(422, `"${i.variant}" is not an option for ${product.name}`);
    }
    total += variant.price * i.quantity;
    return {
      productId: i.productId,
      name: product.name,
      variant: variant.label,
      price: variant.price,
      quantity: i.quantity,
    };
  });
  return { lines, total };
}

export const createOrder = (data: Record<string, unknown>) => Order.create(data);

export const findUserOrder = (referenceId: string, userId: string) =>
  Order.findOne({ referenceId, user: userId });

export const setOrderStatus = (referenceId: string, status: OrderStatus, failureReason?: string) =>
  Order.updateOne({ referenceId }, { status, ...(failureReason ? { failureReason } : {}) });
