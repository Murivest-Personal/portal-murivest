import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { notificationsQuery } from "@/lib/portal-data";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { data } = useQuery(notificationsQuery);
  const notifications = data?.notifications ?? [];
  const unread = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function markAllRead() {
    const ids = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (!ids.length) return;
    await supabase.from("notifications").update({ is_read: true }).in("id", ids);
    queryClient.invalidateQueries({ queryKey: notificationsQuery.queryKey });
  }

  if (!data?.user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={unread ? `${unread} unread notifications` : "Notifications"}
        onClick={() => setOpen((v) => !v)}
        className="lux-nav"
      >
        Notifications
        {unread > 0 && <span className="ml-2 text-gold-deep">{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <div className="absolute right-0 mt-4 w-80 bg-background border border-border z-[80]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-forest/10">
            <span className="text-[10px] uppercase tracking-[0.15em] text-forest font-medium">Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-[10px] uppercase tracking-wider text-gold hover:text-forest">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-forest/5">
            {notifications.length === 0 ? (
              <p className="p-6 text-center text-xs text-ink/60">You're all caught up.</p>
            ) : (
              notifications.slice(0, 6).map((n) => (
                <div key={n.id} className={`px-4 py-3 ${n.is_read ? "" : "bg-gold/5"}`}>
                  <p className="text-sm text-forest font-medium">{n.title}</p>
                  {n.message && <p className="text-xs text-ink/70 mt-0.5">{n.message}</p>}
                  <p className="text-[10px] text-forest/40 mt-1">
                    {new Date(n.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              ))
            )}
          </div>
          <Link
            to="/portal/notifications"
            onClick={() => setOpen(false)}
            className="block text-center py-3 text-[10px] uppercase tracking-[0.15em] text-gold hover:text-forest border-t border-forest/10"
          >
            View all
          </Link>
        </div>
      )}
    </div>
  );
}
