import { createFileRoute, redirect } from "@tanstack/react-router";


// Only the investor portal was migrated; the public website lives at its
// existing address, so the root opens the portal.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/portal" });
  },
  head: () => ({
    meta: [
      { title: "Murivest Investor Portal" },
      { name: "description", content: "Private investor portal for Murivest research, briefs and off-market opportunities." },
      { property: "og:title", content: "Murivest Investor Portal" },
      { property: "og:description", content: "Private investor portal for Murivest research, briefs and off-market opportunities." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: 'theme-color', content: '#0f3d2e' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-title', content: 'Murivest' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    ],
    links: [
    // ...your existing links
    { rel: 'manifest', href: '/manifest.webmanifest' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  ],
  }),
});
