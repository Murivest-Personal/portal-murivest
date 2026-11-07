import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import AuthScreen, { type AuthMode } from "@/components/portal/AuthScreen";
import { authUserQuery } from "@/lib/portal-data";

export default function InvestorPortalLoginPage({
  initialMode,
  expired,
}: {
  initialMode?: AuthMode | undefined;
  expired?: boolean | undefined;
}) {
  const navigate = useNavigate();
  const { data: user } = useQuery(authUserQuery);

  // Already signed in: go straight to the workspace.
  useEffect(() => {
    if (user) navigate({ to: "/portal" });
  }, [user, navigate]);

  return (
    <AuthScreen
      initialMode={initialMode ?? "signin"}
      notice={expired ? "Your session has ended. Please sign in again." : undefined}
      redirectTo="/portal"
    />
  );
}
