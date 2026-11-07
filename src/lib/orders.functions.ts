import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { acceptsPayment, canCancel, extractMpesaCode, newOrderTerms } from "./order-rules";

// Orders and payment confirmations are written only here, after checking the
// signed-in investor, so prices and statuses cannot be set from the browser.

const createOrderInput = z.object({
  orderType: z.enum(["digital", "hard"]),
  briefTitle: z.string().trim().max(200).optional(),
  shippingAddress: z.string().trim().max(500).optional(),
  phone: z.string().trim().max(40).optional(),
});

export const createBriefOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => createOrderInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, organisation, phone")
      .eq("id", userId)
      .maybeSingle();

    if (data.orderType === "hard" && !data.shippingAddress) {
      return { error: "Please provide a delivery address for the hard copy." };
    }

    const terms = newOrderTerms(data.orderType);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("brief_orders")
      .insert({
        user_id: userId,
        order_type: terms.order_type,
        amount_kes: terms.amount_kes,
        amount_usd: terms.amount_usd,
        status: terms.status,
        delivery_method: terms.delivery_method,
        brief_title: data.briefTitle || "Nairobi Private Commercial Asset Brief",
        contact_name: profile?.full_name ?? null,
        contact_email: profile?.email ?? null,
        contact_phone: data.phone || profile?.phone || null,
        organisation: profile?.organisation ?? null,
        shipping_address: data.orderType === "hard" ? (data.shippingAddress ?? null) : null,
      })
      .select("id")
      .single();

    if (error || !order) {
      console.error("createBriefOrder failed", error);
      return { error: "We couldn't create your order. Please try again." };
    }
    return { orderId: order.id, nextStep: terms.nextStep };
  });

const mpesaInput = z.object({
  orderId: z.string().uuid(),
  mpesaMessage: z.string().trim().min(10, "Please paste the full M-Pesa confirmation message.").max(1000),
});

export const submitMpesaConfirmation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => mpesaInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // Reading through the investor's own session confirms the order is theirs.
    const { data: order } = await supabase
      .from("brief_orders")
      .select("id, user_id, order_type, status, amount_kes, amount_usd, brief_title")
      .eq("id", data.orderId)
      .maybeSingle();

    if (!order || order.user_id !== userId) return { error: "Order not found." };
    if (!acceptsPayment(order)) return { error: "This order is not awaiting payment." };

    const code = extractMpesaCode(data.mpesaMessage);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("payment_confirmations").insert({
      user_id: userId,
      order_id: order.id,
      payment_method: "M-Pesa",
      mpesa_message: data.mpesaMessage,
      review_status: "submitted",
      amount_kes: order.amount_kes,
      amount_usd: order.amount_usd,
      transaction_id: code,
      order_type: order.order_type,
      brief_title: order.brief_title,
    });
    if (error) {
      console.error("submitMpesaConfirmation failed", error);
      return { error: "Payment confirmation failed. Please try again." };
    }
    await supabaseAdmin
      .from("brief_orders")
      .update({ payment_method: "M-Pesa", transaction_id: code, status: "awaiting_payment" })
      .eq("id", order.id);
    return { ok: true as const };
  });

const cancelInput = z.object({
  orderId: z.string().uuid(),
  cancellationReason: z.string().trim().max(500).optional(),
});

export const cancelBriefOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => cancelInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: order } = await supabase
      .from("brief_orders")
      .select("id, user_id, status")
      .eq("id", data.orderId)
      .maybeSingle();
    if (!order || order.user_id !== userId) return { error: "Order not found." };
    if (!canCancel(order.status)) return { error: "This order can no longer be cancelled." };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("brief_orders")
      .update({ status: "cancelled", cancellation_reason: data.cancellationReason || null })
      .eq("id", order.id);
    if (error) {
      console.error("cancelBriefOrder failed", error);
      return { error: "Failed to cancel order." };
    }
    return { ok: true as const };
  });
