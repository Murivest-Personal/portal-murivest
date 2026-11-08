## Project rules

- The investor portal lives under `/portal` and renders client-side (`ssr: false` on `src/routes/portal/route.tsx`); page reads go through `src/lib/portal-data.ts` with the browser client, so database access rules are the security boundary.
- Brief orders and M-Pesa confirmations are written only by server functions in `src/lib/orders.functions.ts` (ownership check, then privileged insert); investors have no direct insert/update rights on those tables, so prices and statuses cannot be forged.
- Pricing, cancellability and payment-eligibility rules live in `src/lib/order-rules.ts` with tests beside it; change rules there, not in components.
- Investor tier and verification fields on `profiles` are guarded by a database trigger; admin rights come only from `user_roles` via `has_role`.
- Links to pages of the public website (not migrated) use `SiteLink`/`siteUrl` from `src/lib/site.ts`, never router links.
- Profile photos are stored as object paths in the private `user-uploads` bucket and displayed with signed URLs.
- Ported portal pages live in `src/components/portal/pages/`; route files stay thin (head, loader, search params).
