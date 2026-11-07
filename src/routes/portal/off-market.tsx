import { createFileRoute } from "@tanstack/react-router";
import OffMarketPage from "@/components/portal/pages/OffMarketPage";
import { offMarketQuery } from "@/lib/portal-data";
import { portalHead } from "@/lib/portal-head";

export const Route = createFileRoute("/portal/off-market")({
  head: () => portalHead('Off-Market Deal Room | Murivest', 'Confidential direct real estate opportunities for verified investors.'),
  loader: ({ context }) => context.queryClient.ensureQueryData(offMarketQuery),
  component: OffMarketPage,
});
