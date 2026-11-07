import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, CheckCircle2, Package, Smartphone } from "lucide-react";
import { createBriefOrder, submitMpesaConfirmation } from "@/lib/orders.functions";
import { HARD_COPY_PRICE_KES, HARD_COPY_PRICE_USD, MPESA_ACCOUNT, MPESA_PAYBILL } from "@/lib/site";

type Props = {
  userEmail?: string | undefined;
  userName?: string | undefined;
  userPhone?: string | undefined;
  userOrganisation?: string | undefined;
};

const inputCls =
  "w-full bg-ivory border border-forest/20 text-forest px-4 py-3 text-sm focus:border-gold focus:outline-none";
const labelCls = "block text-[10px] uppercase tracking-[0.15em] text-forest/60 mb-2";

export default function InvestorBriefAccess({ userEmail, userName, userPhone, userOrganisation }: Props) {
  const createOrder = useServerFn(createBriefOrder);
  const confirmPayment = useServerFn(submitMpesaConfirmation);
  const queryClient = useQueryClient();

  const [format, setFormat] = useState<"digital" | "hard">("digital");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(userPhone ?? "");
  const [orderId, setOrderId] = useState("");
  const [mpesaMessage, setMpesaMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const res = await createOrder({
        data: { orderType: format, shippingAddress: format === "hard" ? address : undefined, phone: phone || undefined },
      });
      if ("error" in res && res.error) {
        setError(res.error);
        return;
      }
      if ("orderId" in res && res.orderId) {
        setOrderId(res.orderId);
        setMessage(res.nextStep);
        queryClient.invalidateQueries({ queryKey: ["portal"] });
      }
    } catch {
      setError("Request failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function submitPayment(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!orderId) {
      setError("Please create a hard-copy order first.");
      return;
    }
    setBusy(true);
    try {
      const res = await confirmPayment({ data: { orderId, mpesaMessage: mpesaMessage.trim() } });
      if ("error" in res && res.error) {
        setError(res.error);
        return;
      }
      setPaid(true);
      setMpesaMessage("");
      setMessage("Payment confirmation submitted. We'll notify you once it's verified and dispatched.");
      queryClient.invalidateQueries({ queryKey: ["portal"] });
    } catch {
      setError("Payment confirmation failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div id="brief-access" className="grid lg:grid-cols-5 gap-6 lg:gap-10 scroll-mt-24">
      <div className="lg:col-span-2 space-y-4">
        <p className="text-sm text-ink/80 leading-relaxed">
          Our flagship research on Nairobi's private commercial real estate: pricing, yields, supply pipeline, and
          off-market transaction evidence across Westlands, Upper Hill, Kilimani and the northern logistics corridor.
        </p>
        <ul className="space-y-2">
          {[
            "Prime office, retail & logistics yield benchmarks",
            "Off-market transaction case studies",
            "Supply pipeline and absorption to 2028",
            "Legal and tax structuring considerations",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-ink/70">
              <CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="text-[10px] uppercase tracking-wider text-forest/40 pt-2">
          Requesting as {userName || "investor"}
          {userOrganisation ? ` · ${userOrganisation}` : ""}
          {userEmail ? ` · ${userEmail}` : ""}
        </div>
      </div>

      <div className="lg:col-span-3">
        {!orderId ? (
          <form onSubmit={placeOrder} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat("digital")}
                className={`text-left p-4 border transition-colors ${format === "digital" ? "border-gold bg-gold/5" : "border-forest/15 bg-white hover:border-gold/50"}`}
              >
                <BookOpen className="h-5 w-5 text-gold mb-2" />
                <div className="font-serif text-lg text-forest">Digital Edition</div>
                <div className="text-xs text-ink/60">Complimentary · delivered to your Document Room</div>
              </button>
              <button
                type="button"
                onClick={() => setFormat("hard")}
                className={`text-left p-4 border transition-colors ${format === "hard" ? "border-gold bg-gold/5" : "border-forest/15 bg-white hover:border-gold/50"}`}
              >
                <Package className="h-5 w-5 text-gold mb-2" />
                <div className="font-serif text-lg text-forest">Hard Copy</div>
                <div className="text-xs text-ink/60">
                  KES {HARD_COPY_PRICE_KES.toLocaleString()} (${HARD_COPY_PRICE_USD}) · courier delivery · M-Pesa
                </div>
              </button>
            </div>

            {format === "hard" && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Delivery Address</label>
                  <textarea
                    className={`${inputCls} min-h-20`}
                    value={address}
                    maxLength={500}
                    required
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Building, floor, street, city"
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input className={inputCls} value={phone} maxLength={40} onChange={(e) => setPhone(e.target.value)} placeholder="+254 7..." />
                </div>
              </div>
            )}

            {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={busy}
              className="w-full sm:w-auto bg-forest text-ivory px-8 py-3 text-xs uppercase tracking-[0.15em] hover:bg-forest-soft transition-colors disabled:opacity-60"
            >
              {busy ? "Processing..." : format === "digital" ? "Request Digital Brief" : "Order Hard Copy"}
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            {message && <div className="bg-green-50 border-l-4 border-green-500 p-4 text-green-700 text-sm">{message}</div>}

            {format === "hard" && !paid && (
              <form onSubmit={submitPayment} className="space-y-4 border border-gold/30 p-5 bg-ivory">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-gold" />
                  <span className="font-serif text-lg text-forest">Pay via M-Pesa</span>
                </div>
                <p className="text-xs text-ink/70">
                  Lipa na M-Pesa → Pay Bill → Business No. <span className="font-mono text-forest">{MPESA_PAYBILL}</span> →
                  Account <span className="font-mono text-forest">{MPESA_ACCOUNT}</span> → Amount{" "}
                  <span className="font-mono text-forest">{HARD_COPY_PRICE_KES.toLocaleString()}</span>
                </p>
                <textarea
                  className={`${inputCls} min-h-24 bg-white`}
                  placeholder="Paste your M-Pesa confirmation message"
                  value={mpesaMessage}
                  maxLength={1000}
                  onChange={(e) => setMpesaMessage(e.target.value)}
                />
                {error && <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm">{error}</div>}
                <button
                  type="submit"
                  disabled={busy}
                  className="bg-gold text-forest px-6 py-3 text-xs uppercase tracking-[0.15em] font-medium hover:bg-gold-deep transition-colors disabled:opacity-60"
                >
                  {busy ? "Submitting..." : "Submit Payment Confirmation"}
                </button>
              </form>
            )}

            <div className="flex flex-wrap gap-3">
              <Link
                to="/portal/orders"
                className="inline-flex items-center gap-2 border border-forest/20 text-forest px-5 py-2.5 text-[11px] uppercase tracking-[0.1em] hover:border-gold hover:text-gold"
              >
                Track in My Orders
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOrderId("");
                  setMessage("");
                  setPaid(false);
                  setError("");
                }}
                className="text-[11px] uppercase tracking-[0.1em] text-gold hover:text-forest"
              >
                Place another order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
