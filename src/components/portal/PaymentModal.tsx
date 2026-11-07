import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Smartphone, X } from "lucide-react";
import { submitMpesaConfirmation } from "@/lib/orders.functions";
import { MPESA_ACCOUNT, MPESA_PAYBILL } from "@/lib/site";

export default function PaymentModal({
  isOpen,
  onClose,
  orderId,
  orderAmount,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderAmount: number;
  onSuccess: () => void;
}) {
  const submit = useServerFn(submitMpesaConfirmation);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (message.trim().length < 10) {
      setError("Please paste the full M-Pesa confirmation message.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await submit({ data: { orderId, mpesaMessage: message.trim() } });
      if ("error" in res && res.error) {
        setError(res.error);
        return;
      }
      setMessage("");
      onSuccess();
    } catch {
      setError("Payment confirmation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-forest/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white max-w-lg w-full shadow-2xl">
        <div className="bg-forest text-ivory p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="h-6 w-6 text-gold" />
            <div>
              <h3 className="font-serif text-2xl">Confirm M-Pesa Payment</h3>
              <p className="text-xs text-ivory/60">Order {orderId.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-ivory/60 hover:text-gold">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-ivory p-3">
              <div className="text-[10px] uppercase tracking-wider text-forest/50">Pay Bill</div>
              <div className="font-mono text-forest">{MPESA_PAYBILL}</div>
            </div>
            <div className="bg-ivory p-3">
              <div className="text-[10px] uppercase tracking-wider text-forest/50">Account</div>
              <div className="font-mono text-forest">{MPESA_ACCOUNT}</div>
            </div>
            <div className="bg-ivory p-3">
              <div className="text-[10px] uppercase tracking-wider text-forest/50">Amount</div>
              <div className="font-serif text-lg text-gold">KES {orderAmount.toLocaleString()}</div>
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-forest/60 mb-2">
              M-Pesa Confirmation Message
            </label>
            <textarea
              className="w-full bg-ivory border border-forest/20 text-forest px-4 py-3 text-sm focus:border-gold focus:outline-none min-h-28"
              placeholder="Paste the full SMS you received from M-Pesa"
              value={message}
              maxLength={1000}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          {error && <div className="bg-red-50 border-l-4 border-red-500 p-3 text-sm text-red-700">{error}</div>}
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-5 py-3 text-xs uppercase tracking-[0.15em] border border-forest/20 text-forest hover:border-gold">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-3 text-xs uppercase tracking-[0.15em] bg-forest text-ivory hover:bg-forest-soft disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Confirmation"}
            </button>
          </div>
          <p className="text-[10px] text-forest/40 text-center">Our team verifies every payment before dispatch.</p>
        </form>
      </div>
    </div>
  );
}
