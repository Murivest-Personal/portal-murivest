import { supabase } from "@/integrations/supabase/client";

// All portal reads run in the browser (the portal is client-rendered) with the
// signed-in investor's session, so database access rules apply to every query.

import { queryOptions } from '@tanstack/react-query'
import { fetchBriefs, fetchBriefDetail } from './briefs.functions'

export const briefsQuery = queryOptions({
  queryKey: ['portal', 'briefs'],
  queryFn: () => fetchBriefs(),
})

export const briefDetailQuery = (slug: string) =>
  queryOptions({
    queryKey: ['portal', 'briefs', slug],
    queryFn: () => fetchBriefDetail({ data: slug }),
  })

async function currentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

export const authUserQuery = queryOptions({
  queryKey: ["portal", "auth-user"],
  queryFn: currentUser,
});

export const myProfileQuery = queryOptions({
  queryKey: ["portal", "my-profile"],
  queryFn: async () => {
    const user = await currentUser();
    if (!user) return null;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    return data;
  },
});

export const overviewQuery = queryOptions({
  queryKey: ["portal", "overview"],
  queryFn: async () => {
    const user = await currentUser();
    if (!user) return { user: null, profile: null, publications: [] };
    const [{ data: profile }, { data: publications }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase
        .from("publications")
        .select("id,title,summary,category,fliphtml_url,file_url,published_at,access_level")
        .eq("is_portal_visible", true)
        .order("created_at", { ascending: false }),
    ]);
    return { user, profile, publications: publications ?? [] };
  },
});

export const dashboardQuery = queryOptions({
  queryKey: ["portal", "dashboard"],
  queryFn: async () => {
    const user = await currentUser();
    if (!user) return { user: null, profile: null, ordersCount: 0, paymentsCount: 0 };
    const [{ data: profile }, { count: ordersCount }, { count: paymentsCount }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("brief_orders").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase
        .from("payment_confirmations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);
    return { user, profile, ordersCount: ordersCount ?? 0, paymentsCount: paymentsCount ?? 0 };
  },
});

export const criteriaQuery = queryOptions({
  queryKey: ["portal", "criteria"],
  queryFn: async () => {
    const user = await currentUser();
    if (!user) return { user: null, criteria: [] };
    const { data } = await supabase
      .from("acquisition_criteria")
      .select("*")
      .eq("investor_id", user.id)
      .order("created_at", { ascending: false });
    return { user, criteria: data ?? [] };
  },
});

export const documentsQuery = queryOptions({
  queryKey: ["portal", "documents"],
  queryFn: async () => {
    const user = await currentUser();
    if (!user) return { user: null, access: [] };
    const { data } = await supabase
      .from("document_access")
      .select("id, granted_at, viewed_at, document:document_id(id, title, description, file_url, file_type, created_at)")
      .eq("user_id", user.id)
      .order("granted_at", { ascending: false });
    return { user, access: data ?? [] };
  },
});

export const enquiriesQuery = queryOptions({
  queryKey: ["portal", "enquiries"],
  queryFn: async () => {
    const user = await currentUser();
    if (!user) return { user: null, enquiries: [] };
    const { data } = await supabase
      .from("enquiries")
      .select("*")
      .eq("investor_id", user.id)
      .order("created_at", { ascending: false });
    return { user, enquiries: data ?? [] };
  },
});

export const offMarketQuery = queryOptions({
  queryKey: ["portal", "off-market"],
  queryFn: async () => {
    const user = await currentUser();
    if (!user) return { user: null, profile: null, deals: [], error: null };
    const { data: profile } = await supabase
      .from("profiles")
      .select("investor_status, aum")
      .eq("id", user.id)
      .maybeSingle();
    const { data: deals, error } = await supabase
      .from("off_market_deals")
      .select(
        "id,title,asset_class,location,location_detail,indicative_price,price_kes,teaser,status,access_level,created_at,confidentiality,metrics,highlights,minimumTicket",
      )
      .eq("is_visible_to_verified", true)
      .order("created_at", { ascending: false });
    return { user, profile, deals: deals ?? [], error: error ? { message: error.message } : null };
  },
});

export const ordersQuery = queryOptions({
  queryKey: ["portal", "orders"],
  queryFn: async () => {
    const user = await currentUser();
    if (!user) return { user: null, orders: [], error: null };
    const { data, error } = await supabase
      .from("brief_orders")
      .select(
        "id,order_type,amount_kes,amount_usd,status,contact_name,contact_email,organisation,shipping_address,created_at,updated_at,brief_title,delivery_method,tracking_number,payment_method,transaction_id",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    return { user, orders: data ?? [], error: error ? { message: error.message } : null };
  },
});

export const paymentsQuery = queryOptions({
  queryKey: ["portal", "payments"],
  queryFn: async () => {
    const user = await currentUser();
    if (!user) return { user: null, payments: [], error: null };
    const { data, error } = await supabase
      .from("payment_confirmations")
      .select(
        "id,order_id,payment_method,mpesa_message,review_status,created_at,confirmed_at,amount_kes,amount_usd,transaction_id,order_type,brief_title",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    return { user, payments: data ?? [], error: error ? { message: error.message } : null };
  },
});

export const publicationsQuery = queryOptions({
  queryKey: ["portal", "publications"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("publications")
      .select("id,title,summary,category,fliphtml_url,file_url,created_at,access_level")
      .eq("is_portal_visible", true)
      .order("created_at", { ascending: false });
    return { publications: data ?? [], error: error ? { message: error.message } : null };
  },
});

export const publicationDetailQuery = (slug: string) =>
  queryOptions({
    queryKey: ["portal", "publication", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("publications")
        .select("*")
        .eq("slug", slug)
        .eq("is_portal_visible", true)
        .maybeSingle();
      return data;
    },
  });

export const notificationsQuery = queryOptions({
  queryKey: ["portal", "notifications"],
  queryFn: async () => {
    const user = await currentUser();
    if (!user) return { user: null, notifications: [] };
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    return { user, notifications: data ?? [] };
  },
});
