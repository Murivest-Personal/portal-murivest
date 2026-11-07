import { createFileRoute } from "@tanstack/react-router";
import PaymentsPage from "@/components/portal/pages/PaymentsPage";
import { paymentsQuery } from "@/lib/portal-data";
import { portalHead } from "@/lib/portal-head";

export const Route = createFileRoute("/portal/payments")({
  head: () => portalHead('Payments | Murivest', 'Submit and track M-Pesa payment confirmations for hard-copy briefs.'),
  loader: ({ context }) => context.queryClient.ensureQueryData(paymentsQuery),
  component: PaymentsPage,
});
