import { createFileRoute } from "@tanstack/react-router";
import BriefsPage from "@/components/portal/pages/BriefsPage";
import { briefsQuery } from "@/lib/portal-data";
import { portalHead } from "@/lib/portal-head";

export const Route = createFileRoute("/portal/briefs/")({
  head: () => portalHead('Investment Briefs | Murivest', 'Tier-based access to off-market East African real estate investment briefs.'),
  loader: ({ context }) => context.queryClient.ensureQueryData(briefsQuery),
  component: BriefsPage,
});
