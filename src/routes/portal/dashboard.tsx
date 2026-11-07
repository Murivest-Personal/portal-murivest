import { createFileRoute } from "@tanstack/react-router";
import DashboardPage from "@/components/portal/pages/DashboardPage";
import { dashboardQuery } from "@/lib/portal-data";
import { portalHead } from "@/lib/portal-head";

export const Route = createFileRoute("/portal/dashboard")({
  head: () => portalHead('Portfolio Dashboard | Murivest', 'Track allocations against family office benchmarks with Knight Frank 2025 data.'),
  loader: ({ context }) => context.queryClient.ensureQueryData(dashboardQuery),
  component: DashboardPage,
});
