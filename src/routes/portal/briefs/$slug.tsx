import { createFileRoute } from "@tanstack/react-router";
import BriefDetailPage from "@/components/portal/pages/BriefDetailPage";
import { briefDetailQuery } from "@/lib/portal-data";
import { portalHead } from "@/lib/portal-head";

export const Route = createFileRoute("/portal/briefs/$slug")({
  head: () => portalHead("Investment Memorandum | Murivest", "Confidential investment memorandum for qualified investors."),
  loader: ({ context, params }) => context.queryClient.ensureQueryData(briefDetailQuery(params.slug)),
  component: BriefDetailRoute,
});

function BriefDetailRoute() {
  const { slug } = Route.useParams();
  return <BriefDetailPage slug={slug} />;
}
