<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- The investor portal lives under `/portal` and renders client-side (`ssr: false` on `src/routes/portal/route.tsx`); page reads go through `src/lib/portal-data.ts` with the browser client, so database access rules are the security boundary.
- Brief orders and M-Pesa confirmations are written only by server functions in `src/lib/orders.functions.ts` (ownership check, then privileged insert); investors have no direct insert/update rights on those tables, so prices and statuses cannot be forged.
- Pricing, cancellability and payment-eligibility rules live in `src/lib/order-rules.ts` with tests beside it; change rules there, not in components.
- Investor tier and verification fields on `profiles` are guarded by a database trigger; admin rights come only from `user_roles` via `has_role`.
- Links to pages of the public website (not migrated) use `SiteLink`/`siteUrl` from `src/lib/site.ts`, never router links.
- Profile photos are stored as object paths in the private `user-uploads` bucket and displayed with signed URLs.
- Ported portal pages live in `src/components/portal/pages/`; route files stay thin (head, loader, search params).
