import { createFileRoute } from "@tanstack/react-router";
import EnquiriesPage from "@/components/portal/pages/EnquiriesPage";
import { enquiriesQuery } from "@/lib/portal-data";
import { portalHead } from "@/lib/portal-head";

export const Route = createFileRoute("/portal/enquiries")({
  validateSearch: (search: Record<string, unknown>): { subject?: string | undefined } => ({
    subject: typeof search["subject"] === "string" ? search["subject"].slice(0, 200) : undefined,
  }),
  head: () => portalHead("Enquiries | Murivest", "Message your Murivest advisor about mandates, deals or general questions."),
  loader: ({ context }) => context.queryClient.ensureQueryData(enquiriesQuery),
  component: EnquiriesRoute,
});

function EnquiriesRoute() {
  const { subject } = Route.useSearch();
  return <EnquiriesPage defaultSubject={subject} />;
}
