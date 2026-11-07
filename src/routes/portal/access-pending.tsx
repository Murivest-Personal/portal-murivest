import { createFileRoute } from "@tanstack/react-router";
import AccessPendingPage from "@/components/portal/pages/AccessPendingPage";
import { portalHead } from "@/lib/portal-head";

export const Route = createFileRoute("/portal/access-pending")({
  head: () => portalHead("Verification Pending | Murivest", "Your Murivest investor portal access is being reviewed."),
  component: AccessPendingPage,
});
