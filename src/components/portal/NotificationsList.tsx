import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Bell, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { notificationsQuery } from "@/lib/portal-data";
import { AuthRequired } from "./AuthRequired";

export default function NotificationsList() {
  const { data } = useSuspenseQuery(notificationsQuery);
  const queryClient = useQueryClient();

  if (!data.user) return <AuthRequired />;

  async function markRead(id: string) {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: notificationsQuery.queryKey });
  }

  if (data.notifications.length === 0) {
    return (
      <div className="bg-white border border-forest/10 p-12 text-center">
        <Bell className="h-10 w-10 text-forest/20 mx-auto mb-4" />
        <p className="text-sm text-ink/60">No notifications yet. Updates on orders and deals will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-forest/10 divide-y divide-forest/5">
      {data.notifications.map((n) => (
        <div key={n.id} className={`p-5 flex items-start justify-between gap-4 ${n.is_read ? "" : "bg-gold/5"}`}>
          <div>
            <div className="flex items-center gap-2">
              {!n.is_read && <span className="w-2 h-2 rounded-full bg-gold" />}
              <p className="text-sm font-medium text-forest">{n.title}</p>
              <span className="text-[10px] uppercase tracking-wider text-gold">{n.type}</span>
            </div>
            {n.message && <p className="text-sm text-ink/70 mt-1">{n.message}</p>}
            <p className="text-[10px] text-forest/40 mt-2">
              {new Date(n.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          {!n.is_read && (
            <button
              onClick={() => markRead(n.id)}
              className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-gold hover:text-forest whitespace-nowrap"
            >
              <CheckCircle2 className="h-3 w-3" /> Mark read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
