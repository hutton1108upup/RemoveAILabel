import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface SiteBUpsellProps {
  href: string;
  variant: "post-clean" | "already-clean";
}

export function SiteBUpsell({ href, variant }: SiteBUpsellProps) {
  const title = "Review visible image artifacts";
  const body =
    variant === "post-clean"
      ? "Supported file metadata was removed from the new copy. This does not change visible skin, lighting, hands, textures, or other image artifacts."
      : "No supported file metadata was found. If the image still looks synthetic, the cause may be visual rather than file-level.";

  return (
    <aside className="siteb-card">
      <h3>{title}</h3>
      <p>{body}</p>
      <Link href={href} className="siteb-link">
        Review visible artifacts
        <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
      </Link>
    </aside>
  );
}
