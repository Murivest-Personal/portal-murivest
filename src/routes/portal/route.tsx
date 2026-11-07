import { createFileRoute, Outlet } from "@tanstack/react-router";
import PortalLayout, { PortalLoading } from "@/components/portal/PortalLayout";

// The investor session lives in the browser, so the whole portal renders
// client-side; signed-out visitors see the sign-in screen on every page.
export const Route = createFileRoute("/portal")({
  ssr: false,
  component: PortalRoute,
  pendingComponent: PortalLoading,
});

function PortalRoute() {
  return (
    <PortalLayout>
      <Outlet />
    </PortalLayout>
  );
}
