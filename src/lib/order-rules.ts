import { HARD_COPY_PRICE_KES, HARD_COPY_PRICE_USD } from "./site";

export type RequestedOrderType = "digital" | "hard";

/** Pricing, starting status and delivery for a new brief order. */
export function newOrderTerms(type: RequestedOrderType) {
  if (type === "hard") {
    return {
      order_type: "hard_copy" as const,
      amount_kes: HARD_COPY_PRICE_KES,
      amount_usd: HARD_COPY_PRICE_USD,
      status: "awaiting_payment",
      delivery_method: "Courier (G4S)",
      nextStep: `Hard-copy order created. Pay KES ${HARD_COPY_PRICE_KES.toLocaleString("en-US")} via M-Pesa, then paste your confirmation message below.`,
    };
  }
  return {
    order_type: "digital" as const,
    amount_kes: 0,
    amount_usd: 0,
    status: "processing",
    delivery_method: "Secure Download",
    nextStep: "Digital brief requested. Our team will share it in your Document Room shortly.",
  };
}

/** Orders an investor may still cancel themselves. */
export const CANCELLABLE_STATUSES = ["pending", "awaiting_payment"];

export function canCancel(status: string) {
  return CANCELLABLE_STATUSES.includes(status);
}

/** Orders that accept an M-Pesa payment confirmation. */
export function acceptsPayment(order: { order_type: string; status: string }) {
  return order.order_type === "hard_copy" && ["pending", "awaiting_payment"].includes(order.status);
}

/** Pull the M-Pesa transaction code (10 upper-case letters/digits) out of the SMS text. */
export function extractMpesaCode(message: string): string | null {
  const match = message.toUpperCase().match(/\b(?=[A-Z0-9]*[A-Z])(?=[A-Z0-9]*\d)[A-Z0-9]{10}\b/);
  return match ? match[0] : null;
}
