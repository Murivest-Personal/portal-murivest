import { createFileRoute } from "@tanstack/react-router";
import NotificationsPage from "@/components/portal/pages/NotificationsPage";
import { notificationsQuery } from "@/lib/portal-data";
import { portalHead } from "@/lib/portal-head";

export const Route = createFileRoute("/portal/notifications")({
  head: () => portalHead('Notifications | Murivest', 'Updates on your orders, verification status, deals and new publications.'),
  loader: ({ context }) => context.queryClient.ensureQueryData(notificationsQuery),
  component: NotificationsPage,
});
