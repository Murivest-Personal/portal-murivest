// The public Murivest website (home, contact, research pages) was not part of the
// migrated archive and keeps running on its existing address. Portal links that
// pointed at those pages open them there.
export const MAIN_SITE_URL = "https://murivest.com";

export function siteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${MAIN_SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// Hard-copy investment brief pricing used by the original portal.
export const HARD_COPY_PRICE_KES = 19500;
export const HARD_COPY_PRICE_USD = 150;

// M-Pesa Pay Bill details shown to investors (copied from the original portal).
export const MPESA_PAYBILL = "522522";
export const MPESA_ACCOUNT = "1234567890";
