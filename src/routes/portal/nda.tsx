import { createFileRoute } from "@tanstack/react-router";
import NdaPage from "@/components/portal/pages/NdaPage";
import { authUserQuery } from "@/lib/portal-data";
import { portalHead } from "@/lib/portal-head";

export const Route = createFileRoute("/portal/nda")({
  head: () => portalHead('Non-Disclosure Agreements | Murivest', 'Confidentiality agreements for accessing restricted investment opportunities.'),
  loader: ({ context }) => context.queryClient.ensureQueryData(authUserQuery),
  component: NdaPage,
});
