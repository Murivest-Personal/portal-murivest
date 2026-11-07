import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { criteriaQuery } from "@/lib/portal-data";

export default function CriteriaActiveToggle({ id, isActive }: { id: string; isActive: boolean }) {
  const queryClient = useQueryClient();
  const [active, setActive] = useState(isActive);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const next = !active;
    const { error } = await supabase.from("acquisition_criteria").update({ is_active: next }).eq("id", id);
    setBusy(false);
    if (!error) {
      setActive(next);
      queryClient.invalidateQueries({ queryKey: criteriaQuery.queryKey });
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={active}
      className={`flex-shrink-0 text-[10px] uppercase tracking-wider px-3 py-1.5 border transition-colors disabled:opacity-60 ${
        active ? "bg-green-50 text-green-700 border-green-200" : "bg-forest/5 text-forest/50 border-forest/10"
      }`}
    >
      {active ? "Active" : "Paused"}
    </button>
  );
}
