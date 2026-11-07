import { createFileRoute } from "@tanstack/react-router";
import PublicationDetailPage from "@/components/portal/pages/PublicationDetailPage";
import { publicationDetailQuery } from "@/lib/portal-data";
import { portalHead } from "@/lib/portal-head";

export const Route = createFileRoute("/portal/publications/$slug")({
  head: () => portalHead("Research Report | Murivest", "Institutional research from the Murivest research library."),
  loader: ({ context, params }) => context.queryClient.ensureQueryData(publicationDetailQuery(params.slug)),
  component: PublicationDetailRoute,
});

function PublicationDetailRoute() {
  const { slug } = Route.useParams();
  return <PublicationDetailPage slug={slug} />;
}
