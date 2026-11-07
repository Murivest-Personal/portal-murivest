import { describe, expect, it } from "vitest";
import { acceptsPayment, canCancel, extractMpesaCode, newOrderTerms } from "./order-rules";

describe("brief order rules", () => {
  it("prices a hard copy at KES 19,500 / $150 and waits for payment", () => {
    const t = newOrderTerms("hard");
    expect(t.order_type).toBe("hard_copy");
    expect(t.amount_kes).toBe(19500);
    expect(t.amount_usd).toBe(150);
    expect(t.status).toBe("awaiting_payment");
  });

  it("makes digital briefs free", () => {
    const t = newOrderTerms("digital");
    expect(t.order_type).toBe("digital");
    expect(t.amount_kes).toBe(0);
    expect(t.amount_usd).toBe(0);
  });

  it("only lets investors cancel orders that have not been paid or shipped", () => {
    expect(canCancel("awaiting_payment")).toBe(true);
    expect(canCancel("pending")).toBe(true);
    expect(canCancel("shipped")).toBe(false);
    expect(canCancel("delivered")).toBe(false);
  });

  it("only accepts M-Pesa confirmations for unpaid hard copies", () => {
    expect(acceptsPayment({ order_type: "hard_copy", status: "awaiting_payment" })).toBe(true);
    expect(acceptsPayment({ order_type: "digital", status: "awaiting_payment" })).toBe(false);
    expect(acceptsPayment({ order_type: "hard_copy", status: "cancelled" })).toBe(false);
  });

  it("extracts the M-Pesa transaction code from the SMS", () => {
    expect(extractMpesaCode("QJK3XY12AB Confirmed. Ksh19,500.00 sent to MURIVEST")).toBe("QJK3XY12AB");
    expect(extractMpesaCode("no code here")).toBeNull();
  });
});
