import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type AppLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    children: ReactNode;
  };

export function AppLink({ children, ...props }: AppLinkProps) {
  return (
    <Link {...props} prefetch={false} data-prefetch="false">
      {children}
    </Link>
  );
}
