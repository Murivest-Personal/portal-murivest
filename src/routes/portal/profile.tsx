import { createFileRoute } from "@tanstack/react-router";
import ProfilePage from "@/components/portal/pages/ProfilePage";
import { portalHead } from "@/lib/portal-head";

export const Route = createFileRoute("/portal/profile")({
  head: () => portalHead("Investor Profile | Murivest", "Manage your Murivest investor profile and verification status."),
  component: ProfilePage,
});
