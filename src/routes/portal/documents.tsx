import { createFileRoute } from "@tanstack/react-router";
import DocumentsPage from "@/components/portal/pages/DocumentsPage";
import { documentsQuery } from "@/lib/portal-data";
import { portalHead } from "@/lib/portal-head";

export const Route = createFileRoute("/portal/documents")({
  head: () => portalHead('Document Room | Murivest', 'Briefs, NDAs and reports your Murivest advisor has shared with you.'),
  loader: ({ context }) => context.queryClient.ensureQueryData(documentsQuery),
  component: DocumentsPage,
});
