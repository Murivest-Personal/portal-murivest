import { createFileRoute } from "@tanstack/react-router";
import OrdersPage from "@/components/portal/pages/OrdersPage";
import { ordersQuery } from "@/lib/portal-data";
import { portalHead } from "@/lib/portal-head";

export const Route = createFileRoute("/portal/orders")({
  head: () => portalHead('My Orders | Murivest', 'Track investment brief orders, deliveries and M-Pesa payments.'),
  loader: ({ context }) => context.queryClient.ensureQueryData(ordersQuery),
  component: OrdersPage,
});
