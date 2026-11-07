import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "@/components/portal/pages/LoginPage";
import { portalHead } from "@/lib/portal-head";

type LoginSearch = { mode?: "signin" | "register" | "forgot" | undefined; expired?: string | undefined };

export const Route = createFileRoute("/portal/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    mode:
      search["mode"] === "signin" || search["mode"] === "register" || search["mode"] === "forgot"
        ? search["mode"]
        : undefined,
    expired: typeof search["expired"] === "string" ? search["expired"] : undefined,
  }),
  head: () => portalHead("Sign In | Murivest Investor Portal", "Sign in or register for the Murivest private investor portal."),
  component: LoginRoute,
});

function LoginRoute() {
  const { mode, expired } = Route.useSearch();
  return <LoginPage initialMode={mode} expired={expired === "true"} />;
}
