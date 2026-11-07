import { createFileRoute } from "@tanstack/react-router";
import PublicationsPage from "@/components/portal/pages/PublicationsPage";
import { publicationsQuery } from "@/lib/portal-data";
import { portalHead } from "@/lib/portal-head";

export const Route = createFileRoute("/portal/publications/")({
  head: () => portalHead('Research Library | Murivest', 'Knight Frank, McKinsey and proprietary intelligence for private investors.'),
  loader: ({ context }) => context.queryClient.ensureQueryData(publicationsQuery),
  component: PublicationsPage,
});
