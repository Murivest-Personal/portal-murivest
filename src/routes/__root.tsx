
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF9F6] px-6 py-16">

      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-px w-full bg-[#B8956B]/30" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-[#B8956B]/30" />

        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full border border-[#1B4332]/5" />
        <div className="absolute -left-28 -top-28 h-72 w-72 rounded-full border border-[#1B4332]/5" />

        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full border border-[#B8956B]/10" />
        <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full border border-[#B8956B]/10" />
      </div>

      {/* 404 Content */}
      <div className="relative z-10 w-full max-w-xl text-center">

        {/* Brand Identity */}
        <div className="mb-12">
          <div className="font-serif text-2xl font-medium tracking-[0.18em] text-[#1B4332]">
            MURIVEST
          </div>

          <div className="mt-2 text-[9px] uppercase tracking-[0.35em] text-[#B8956B]">
            The Concierge of Capital
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="mx-auto mb-10 flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-[#B8956B]/50" />
          <div className="h-1.5 w-1.5 rotate-45 border border-[#B8956B]" />
          <div className="h-px w-12 bg-[#B8956B]/50" />
        </div>

        {/* Error Number */}
        <div className="relative mb-5">
          <h1 className="font-serif text-[112px] font-normal leading-none tracking-tight text-[#1B4332] sm:text-[144px]">
            404
          </h1>

          <div className="mt-3 text-[10px] font-medium uppercase tracking-[0.35em] text-[#B8956B]">
            Page Not Found
          </div>
        </div>

        {/* Description */}
        <div className="mx-auto mb-10 max-w-md">
          <h2 className="mb-4 font-serif text-2xl font-normal text-[#1B4332] sm:text-3xl">
            An Unexpected Detour.
          </h2>

          <p className="text-sm font-light leading-7 tracking-wide text-[#1B4332]/65">
            The page you are looking for may have been moved,
            is no longer available, or the address may be incorrect.
            We invite you to return to the Murivest Investor Portal
            and continue your investment journey.
          </p>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">

          <Link
            to="/portal"
            className="inline-flex min-w-[190px] items-center justify-center border border-[#1B4332] bg-[#1B4332] px-8 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[#FAF9F6] transition-all duration-300 hover:border-[#B8956B] hover:bg-[#0E2A1C]"
          >
            Return to Portal
          </Link>

          <Link
            to="/"
            className="inline-flex min-w-[190px] items-center justify-center border border-[#B8956B]/50 bg-transparent px-8 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[#1B4332] transition-all duration-300 hover:border-[#1B4332] hover:bg-[#1B4332]/5"
          >
            Main Website
          </Link>

        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-[#1B4332]/10 pt-7">

          <div className="mb-3 text-[9px] uppercase tracking-[0.25em] text-[#1B4332]/45">
            Discreet. Strategic. Institutional. Exceptional.
          </div>

          <div className="font-serif text-xs tracking-[0.15em] text-[#B8956B]">
            MURIVEST GROUP
          </div>

          <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-[#1B4332]/40">
            Institutional Real Estate Advisory
          </p>

          <p className="mt-5 text-[9px] tracking-wider text-[#1B4332]/35">
            © {new Date().getFullYear()} Murivest Group Ltd. All rights reserved.
          </p>

        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);

  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, {
      boundary: "tanstack_root_error_component",
    });
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF9F6] px-6 py-16">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-px w-full bg-[#B8956B]/30" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-[#B8956B]/30" />
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">

        {/* Brand */}
        <div className="mb-12">
          <div className="font-serif text-2xl tracking-[0.18em] text-[#1B4332]">
            MURIVEST
          </div>

          <div className="mt-2 text-[9px] uppercase tracking-[0.35em] text-[#B8956B]">
            The Concierge of Capital
          </div>
        </div>

        {/* Error Icon */}
        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-[#B8956B]/40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#B8956B"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.3 3.9 1.8 18.5a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </div>

        <div className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#B8956B]">
          System Notification
        </div>

        <h1 className="mb-4 font-serif text-3xl font-normal text-[#1B4332] sm:text-4xl">
          An Unexpected Interruption.
        </h1>

        <p className="mx-auto mb-9 max-w-md text-sm font-light leading-7 text-[#1B4332]/65">
          We encountered an unexpected issue while loading this page.
          Your session and account information remain separate from
          this display error. Please try again or return to the portal.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">

          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-w-[170px] items-center justify-center border border-[#1B4332] bg-[#1B4332] px-8 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[#FAF9F6] transition-all duration-300 hover:bg-[#0E2A1C]"
          >
            Try Again
          </button>

          <a
            href="/portal"
            className="inline-flex min-w-[170px] items-center justify-center border border-[#B8956B]/50 px-8 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[#1B4332] transition-all duration-300 hover:border-[#1B4332] hover:bg-[#1B4332]/5"
          >
            Return to Portal
          </a>

        </div>

        <div className="mt-16 border-t border-[#1B4332]/10 pt-7">
          <div className="font-serif text-xs tracking-[0.15em] text-[#B8956B]">
            MURIVEST GROUP
          </div>

          <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-[#1B4332]/40">
            Institutional Real Estate Advisory
          </p>

          <p className="mt-5 text-[9px] tracking-wider text-[#1B4332]/35">
            © {new Date().getFullYear()} Murivest Group Ltd.
          </p>
        </div>

      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Murivest Investor Portal" },
      {
        name: "description",
        content: "Murivest private investor portal.",
      },
      { name: "author", content: "Murivest" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Jost:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (
        event !== "SIGNED_IN" &&
        event !== "SIGNED_OUT" &&
        event !== "USER_UPDATED"
      ) {
        return;
      }

      if (event === "SIGNED_OUT") {
        queryClient.removeQueries({ queryKey: ["portal"] });
      } else {
        queryClient.invalidateQueries();
      }

      router.invalidate();
    });

    return () => data.subscription.unsubscribe();
  }, [queryClient, router]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
