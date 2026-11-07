import { createFileRoute } from "@tanstack/react-router";
import OverviewPage from "@/components/portal/pages/OverviewPage";
import { overviewQuery } from "@/lib/portal-data";
import { portalHead } from "@/lib/portal-head";

type PortalSearch = { mode?: "login" | "register" | undefined };

export const Route = createFileRoute("/portal/")({
  validateSearch: (search: Record<string, unknown>): PortalSearch => ({
    mode: search["mode"] === "register" || search["mode"] === "login" ? search["mode"] : undefined,
  }),
  head: () =>
    portalHead(
      "Murivest Investor Portal",
      "Secure access to proprietary research and off-market opportunities for verified investors.",
    ),
  loader: ({ context }) => context.queryClient.ensureQueryData(overviewQuery),
  component: PortalIndex,
});

function PortalIndex() {
  const { mode } = Route.useSearch();
  return <OverviewPage initialMode={mode} />;
}
