import Link from "next/link";

interface SiteBUpsellProps {
  href: string;
  variant: "post-clean" | "already-clean";
}

export function SiteBUpsell({ href, variant }: SiteBUpsellProps) {
  const title =
    variant === "post-clean" ? "Make the Image Look More Natural" : "Check Visible AI Artifacts";
  const body =
    variant === "post-clean"
      ? "File metadata is clean. This does not change visible skin, lighting, hands, textures or other image artifacts."
      : "No supported file metadata was found. If the image still looks AI-generated, the issue may be visual rather than file-level.";

  return (
    <aside className="siteb-card">
      <h3>{title}</h3>
      <p>{body}</p>
      <Link href={href} className="button button-primary">
        {title}
      </Link>
    </aside>
  );
}
