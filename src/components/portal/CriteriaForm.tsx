import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { criteriaQuery } from "@/lib/portal-data";

const MARKETS = ["nairobi", "mombasa", "kisumu", "nakuru", "kampala", "dar-es-salaam", "kigali", "addis-ababa"];
const ASSET_TYPES = ["office", "retail", "industrial-logistics", "residential", "mixed-use", "hospitality", "land", "healthcare"];

function Chips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(active ? value.filter((v) => v !== o) : [...value, o])}
            className={`px-3 py-1.5 text-[11px] uppercase tracking-wider border transition-colors capitalize ${
              active ? "bg-forest text-ivory border-forest" : "bg-white text-forest/70 border-forest/20 hover:border-gold"
            }`}
          >
            {o.replace(/-/g, " ")}
          </button>
        );
      })}
    </div>
  );
}

const inputCls =
  "w-full bg-ivory border border-forest/20 text-forest px-4 py-3 text-sm focus:border-gold focus:outline-none";
const labelCls = "block text-[10px] uppercase tracking-[0.15em] text-forest/60 mb-2";

export default function CriteriaForm() {
  const queryClient = useQueryClient();
  const [markets, setMarkets] = useState<string[]>([]);
  const [assetTypes, setAssetTypes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYield, setMinYield] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const num = (v: string) => (v.trim() === "" ? null : Number(v));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!markets.length || !assetTypes.length) {
      setStatus({ type: "error", text: "Select at least one market and one asset type." });
      return;
    }
    const min = num(minPrice);
    const max = num(maxPrice);
    if ((min !== null && Number.isNaN(min)) || (max !== null && Number.isNaN(max)) || (min !== null && max !== null && min > max)) {
      setStatus({ type: "error", text: "Check your price range." });
      return;
    }
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      setStatus({ type: "error", text: "Please sign in again." });
      return;
    }
    const { error } = await supabase.from("acquisition_criteria").insert({
      investor_id: user.id,
      markets,
      asset_types: assetTypes,
      min_price: min,
      max_price: max,
      min_yield: num(minYield),
      notes: notes.trim() || null,
    });
    setSaving(false);
    if (error) {
      setStatus({ type: "error", text: "Could not save criteria. Please try again." });
      return;
    }
    setMarkets([]);
    setAssetTypes([]);
    setMinPrice("");
    setMaxPrice("");
    setMinYield("");
    setNotes("");
    setStatus({ type: "success", text: "Criteria saved. Your advisor has been notified." });
    queryClient.invalidateQueries({ queryKey: criteriaQuery.queryKey });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <span className={labelCls}>Target Markets</span>
        <Chips options={MARKETS} value={markets} onChange={setMarkets} />
      </div>
      <div>
        <span className={labelCls}>Asset Types</span>
        <Chips options={ASSET_TYPES} value={assetTypes} onChange={setAssetTypes} />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Min Price (USD)</label>
          <input className={inputCls} inputMode="numeric" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="1,000,000" />
        </div>
        <div>
          <label className={labelCls}>Max Price (USD)</label>
          <input className={inputCls} inputMode="numeric" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="20,000,000" />
        </div>
        <div>
          <label className={labelCls}>Min Yield (%)</label>
          <input className={inputCls} inputMode="decimal" value={minYield} onChange={(e) => setMinYield(e.target.value)} placeholder="8" />
        </div>
      </div>
      <div>
        <label className={labelCls}>Notes</label>
        <textarea className={`${inputCls} min-h-24`} value={notes} maxLength={2000} onChange={(e) => setNotes(e.target.value)} />
      </div>
      {status && (
        <div
          className={`p-4 text-sm border-l-4 ${
            status.type === "error" ? "bg-red-50 border-red-500 text-red-700" : "bg-green-50 border-green-500 text-green-700"
          }`}
        >
          {status.text}
        </div>
      )}
      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 bg-forest text-ivory px-6 py-3 text-xs uppercase tracking-[0.15em] hover:bg-forest-soft transition-colors disabled:opacity-60"
      >
        <Plus className="h-4 w-4" />
        {saving ? "Saving..." : "Save Criteria"}
      </button>
    </form>
  );
}
