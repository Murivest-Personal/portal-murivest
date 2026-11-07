import type { AnchorHTMLAttributes, ReactNode } from "react";
import { siteUrl } from "@/lib/site";

type SiteLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
};

/** Link to a page on the main Murivest website (outside the portal). */
export function SiteLink({ href, children, ...rest }: SiteLinkProps) {
  return (
    <a href={siteUrl(href)} {...rest}>
      {children}
    </a>
  );
}
