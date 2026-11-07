import { createFileRoute } from "@tanstack/react-router";
import CriteriaPage from "@/components/portal/pages/CriteriaPage";
import { criteriaQuery } from "@/lib/portal-data";
import { portalHead } from "@/lib/portal-head";

export const Route = createFileRoute("/portal/criteria")({
  head: () => portalHead('Acquisition Criteria | Murivest', 'Define target markets, asset types and pricing bands for off-market matching.'),
  loader: ({ context }) => context.queryClient.ensureQueryData(criteriaQuery),
  component: CriteriaPage,
});
