import { homeFaqs, pageFaqs, type FaqItem } from "./faqs";

export interface BreadcrumbLink {
  label: string;
  href: string;
}

export interface GuideCard {
  title: string;
  description: string;
  href: string;
}

export interface PageContent {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  quickAnswer?: string;
  evidenceLabel?: string;
  whyTitle?: string;
  whyPoints?: string[];
  canCheck?: string[];
  cannotChange?: string[];
  workflow?: string[];
  verifySteps?: string[];
  misunderstandings?: string[];
  faqs: FaqItem[];
  relatedGuides?: GuideCard[];
  breadcrumbs?: BreadcrumbLink[];
  indexable: boolean;
}

export const launchRouteOrder = [
  "/",
  "/instagram-ai-info",
  "/facebook-ai-info",
  "/photoshop-ai-label",
  "/why-does-my-photo-say-ai-info",
  "/c2pa-ai-label",
  "/supported-formats",
  "/guides",
  "/about",
  "/privacy",
  "/terms",
] as const;

const guideCards: GuideCard[] = [
  {
    title: "Instagram AI Info",
    description: "Check supported file signals before posting a lightly edited real photo.",
    href: "/instagram-ai-info/",
  },
  {
    title: "Photoshop Generative Fill",
    description: "Inspect Photoshop exports for embedded credentials and AI-related metadata.",
    href: "/photoshop-ai-label/",
  },
  {
    title: "Facebook AI Info",
    description: "Review file-level signals before you publish a cleaned local copy to Facebook.",
    href: "/facebook-ai-info/",
  },
  {
    title: "Why Does My Photo Say AI Info",
    description: "Understand which file signals, disclosures, and platform systems may contribute.",
    href: "/why-does-my-photo-say-ai-info/",
  },
];

export const homePageContent = {
  title: "Remove AI Label from Images - Free & Private Tool",
  description:
    "Check and remove supported C2PA, XMP and AI label metadata from JPG and PNG images locally in your browser. Free, private and no account.",
  h1: "Check and Remove AI Label Metadata Before You Post",
  subtitle:
    "Create a cleaned local copy by removing supported C2PA, XMP and AI workflow metadata. Your images never leave your browser.",
  trustBadges: [
    "Local-only processing",
    "No account",
    "Original file untouched",
    "No image re-encoding on supported files",
  ],
  checks: [
    {
      title: "Embedded C2PA Credentials",
      description: "Inspect embedded Content Credentials and remove confirmed C2PA payloads when safe.",
    },
    {
      title: "AI-related XMP Fields",
      description: "Identify confirmed XMP packets that describe supported generative AI workflows.",
    },
    {
      title: "Prompt and Workflow Data",
      description: "Scan supported PNG and XMP fields for prompt, workflow, model, and seed-style metadata.",
    },
    {
      title: "Optional Privacy Metadata",
      description: "Optionally regenerate a clean copy without EXIF privacy fields such as GPS or device details.",
    },
  ],
  preserves: [
    "Encoded image payload on supported files",
    "Camera EXIF by default",
    "ICC color profile",
    "Orientation",
    "PNG transparency",
    "Original source file",
  ],
  canDo: [
    "Can remove supported file metadata",
    "Can verify the cleaned copy after processing",
    "Can preserve camera and color data by default when separable",
  ],
  cannotDo: [
    "Cannot change an existing post",
    "Cannot remove visible or pixel-level watermarks",
    "Cannot change visible AI artifacts",
    "Cannot guarantee platform classification",
    "Cannot replace required disclosure",
  ],
  evidenceSources: [
    {
      label: "Meta labeling policy",
      href: "https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/",
    },
    {
      label: "Adobe export settings",
      href: "https://helpx.adobe.com/photoshop/desktop/save-and-export/metadata-content-credentials/export-your-work-with-content-credentials.html",
    },
    {
      label: "Adobe Content Credentials overview",
      href: "https://helpx.adobe.com/firefly/web/get-started/learn-the-basics/content-credentials-overview.html",
    },
    {
      label: "C2PA Content Credentials spec",
      href: "https://spec.c2pa.org/specifications/specifications/2.4/specs/ContentCredentials.html",
    },
    {
      label: "SynthID reference",
      href: "https://deepmind.google/models/synthid/",
    },
  ],
  scenarios: [
    {
      title: "Real Photos Lightly Edited with AI",
      description: "Create a publish-ready copy after AI-assisted retouching, expand, or object cleanup.",
    },
    {
      title: "Social Media Image Preflight",
      description: "Run a fast local check before posting to Instagram, Facebook, or another social platform.",
    },
    {
      title: "Authentic Product Photo Delivery",
      description: "Prepare client or marketplace copies while preserving color and ordinary camera metadata.",
    },
    {
      title: "Clean Client Copies",
      description: "Remove supported prompt or workflow traces before delivering a derivative file to a client.",
    },
  ],
  workflow: [
    "Add files",
    "Scan locally",
    "Prepare a recommended clean copy",
    "Verify and download",
  ],
  entryCards: guideCards,
  faqs: homeFaqs,
  footerSiteBLabel: "Explore the companion visual cleanup site",
} as const;

export const launchPages: Record<string, PageContent> = {
  home: {
    slug: "home",
    path: "/",
    title: homePageContent.title,
    description: homePageContent.description,
    h1: homePageContent.h1,
    faqs: homeFaqs,
    indexable: true,
  },
  "instagram-ai-info": {
    slug: "instagram-ai-info",
    path: "/instagram-ai-info",
    title: "Instagram AI Info on Photos: What You Can Check",
    description:
      "Learn why Instagram may show AI Info on a real or lightly edited photo, inspect supported file metadata, and create a cleaned local copy before posting.",
    h1: "Why Instagram Shows AI Info on Some Photos",
    quickAnswer:
      "Instagram can react to supported file-level signals such as embedded credentials or AI-related editing metadata. This tool can inspect those signals locally and create a cleaned copy before you publish.",
    evidenceLabel:
      "Last reviewed: 2026-09-03\nBased on: official platform documentation + local file-format testing\nPlatform behavior may change",
    whyTitle: "Why This Can Happen",
    whyPoints: [
      "Meta says labels can use industry-shared signals and creator disclosure, not only one metadata field.",
      "Photos edited with AI-assisted features can still contain embedded credentials or AI-related XMP after export.",
      "A platform menu or disclosure flow can still add context that this tool does not control.",
    ],
    canCheck: [
      "Embedded C2PA credentials in supported files",
      "Confirmed AI-related XMP packets",
      "Supported prompt and workflow fields",
    ],
    cannotChange: [
      "An existing Instagram post",
      "Visible retouching or synthetic-looking details",
      "Instagram policy or disclosure systems",
    ],
    workflow: [
      "Export a local source file before posting.",
      "Run the tool to inspect supported metadata locally.",
      "Download a verified cleaned copy only if the result is ready.",
      "Post the cleaned copy and keep your original master file.",
    ],
    verifySteps: [
      "Check that the result says Clean copy ready.",
      "Confirm the verification table shows Removed for supported targets.",
      "Keep the original file if you need provenance or editing history later.",
    ],
    misunderstandings: [
      "Cleaning metadata does not promise Instagram will remove or avoid a label.",
      "The tool does not rewrite an existing post on Instagram.",
      "No supported metadata found does not prove a platform has no other signals.",
    ],
    faqs: pageFaqs["instagram-ai-info"],
    relatedGuides: guideCards.filter((card) => card.href !== "/instagram-ai-info/"),
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/guides/", label: "Guides" },
      { href: "/instagram-ai-info/", label: "Instagram AI Info" },
    ],
    indexable: true,
  },
  "facebook-ai-info": {
    slug: "facebook-ai-info",
    path: "/facebook-ai-info",
    title: "Facebook AI Info on Photos: File Signals Explained",
    description:
      "Check a Facebook-ready image for supported C2PA and AI editing metadata, then create a local cleaned copy without uploading the file.",
    h1: "Why Facebook Adds AI Info to Some Photos",
    quickAnswer:
      "Facebook can evaluate embedded credentials, editing metadata, and disclosure systems. The local tool can inspect supported file-level signals and create a cleaned local copy before publishing.",
    evidenceLabel:
      "Last reviewed: 2026-09-03\nBased on: official platform documentation + local file-format testing\nPlatform behavior may change",
    whyTitle: "Why This Can Happen",
    whyPoints: [
      "Meta describes industry-shared provenance signals and self-disclosure as inputs to labeling.",
      "Supported image files can contain Content Credentials or AI-related XMP after export from editing software.",
      "A cleaned local copy only changes supported file metadata, not platform-side rules.",
    ],
    canCheck: [
      "Confirmed embedded C2PA credentials",
      "AI-related XMP fields in supported packets",
      "Prompt or workflow text in supported PNG files",
    ],
    cannotChange: [
      "Facebook posts that are already live",
      "Visible content artifacts",
      "Disclosure decisions made inside Meta products",
    ],
    workflow: [
      "Prepare the image locally before posting to Facebook.",
      "Use the tool to inspect supported signals without upload.",
      "Download the verified cleaned copy only if verification passes.",
      "Keep the original source file for archive and provenance.",
    ],
    verifySteps: [
      "Review the before and clean-copy columns for removed targets.",
      "Confirm preserved items like EXIF or ICC stayed intact when expected.",
      "Do not treat verification as a platform guarantee.",
    ],
    misunderstandings: [
      "This tool is not a Facebook account setting.",
      "Removing metadata does not change visible edits.",
      "A file can still be labeled for reasons outside the local file.",
    ],
    faqs: pageFaqs["facebook-ai-info"],
    relatedGuides: guideCards.filter((card) => card.href !== "/facebook-ai-info/"),
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/guides/", label: "Guides" },
      { href: "/facebook-ai-info/", label: "Facebook AI Info" },
    ],
    indexable: true,
  },
  "photoshop-ai-label": {
    slug: "photoshop-ai-label",
    path: "/photoshop-ai-label",
    title: "Photoshop Generative Fill AI Label: Check the Export",
    description:
      "Inspect Photoshop exports for C2PA and supported generative AI metadata after Generative Fill, Expand or other AI-assisted edits.",
    h1: "Check Photoshop Exports for AI Label Metadata",
    quickAnswer:
      "Photoshop exports can carry Content Credentials or related metadata after AI-assisted edits. This page helps you inspect supported file-level signals and create a cleaned local copy before delivery or posting.",
    evidenceLabel:
      "Last reviewed: 2026-09-03\nBased on: official Adobe documentation + local file-format testing\nPlatform behavior may change",
    whyTitle: "Why This Can Happen",
    whyPoints: [
      "Adobe documents that Content Credentials can be attached to files, stored in the cloud, or omitted depending on export choices.",
      "Generative Fill, Expand, and similar features can leave supported file-level signals behind the final export.",
      "A cleaned local copy removes supported metadata only and does not alter the visible export.",
    ],
    canCheck: [
      "Embedded Content Credentials in supported JPG or PNG exports",
      "Confirmed AI-related XMP packets from export metadata",
      "Prompt or workflow-style text fields when present",
    ],
    cannotChange: [
      "Visible Photoshop edits",
      "Photoshop export settings you already used",
      "Platform labeling rules outside the file",
    ],
    workflow: [
      "Export the source file from Photoshop.",
      "Inspect the file locally with the tool.",
      "Use Advanced Options only if you need a privacy-focused variant.",
      "Download the verified cleaned copy and archive the original export.",
    ],
    verifySteps: [
      "Check Removed for supported metadata targets.",
      "Check Preserved for ICC and camera metadata when separable.",
      "Keep the original export if you need the embedded provenance record.",
    ],
    misunderstandings: [
      "This tool does not make Photoshop edits invisible.",
      "A clean verification table does not promise platform treatment.",
      "A missing metadata hit does not prove the image was never AI-assisted.",
    ],
    faqs: pageFaqs["photoshop-ai-label"],
    relatedGuides: guideCards.filter((card) => card.href !== "/photoshop-ai-label/"),
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/guides/", label: "Guides" },
      { href: "/photoshop-ai-label/", label: "Photoshop AI Label" },
    ],
    indexable: true,
  },
  "why-does-my-photo-say-ai-info": {
    slug: "why-does-my-photo-say-ai-info",
    path: "/why-does-my-photo-say-ai-info",
    title: "Why Does My Photo Say AI Info? Signals Explained",
    description:
      "Understand how Content Credentials, XMP, editing software, disclosures and platform systems can contribute to an AI label on a photo.",
    h1: "Why Does My Real Photo Say “AI Info”?",
    quickAnswer:
      "A real photo can still carry provenance or editing metadata after AI-assisted workflows. This tool can inspect supported file-level signals locally, but it cannot explain or control every platform-side decision.",
    evidenceLabel:
      "Last reviewed: 2026-09-03\nBased on: official documentation + local file-format testing\nPlatform behavior may change",
    whyTitle: "Signals That Can Contribute",
    whyPoints: [
      "Embedded Content Credentials can describe provenance or editing history.",
      "AI-related XMP can survive export from supported tools and workflows.",
      "Platforms may also consider disclosure systems or other non-file signals.",
    ],
    canCheck: [
      "Supported file-level provenance signals",
      "Confirmed AI-related XMP and workflow fields",
      "Preservation of ordinary EXIF and ICC data after cleanup",
    ],
    cannotChange: [
      "How a platform interprets other signals",
      "Visible edits in the pixels",
      "Any existing uploaded post",
    ],
    workflow: [
      "Start with the original local file.",
      "Inspect supported metadata signals with the tool.",
      "If a clean copy is verified, use that copy for your next publish step.",
      "If nothing is found, investigate disclosure rules or visible-artifact concerns separately.",
    ],
    verifySteps: [
      "Read the verification table rather than guessing from a software name.",
      "Treat no-supported-metadata as a factual scan result, not a promise.",
      "Keep your original file if provenance matters.",
    ],
    misunderstandings: [
      "A Photoshop tag alone is not enough evidence to call a file AI-generated.",
      "This tool does not remove visible synthetic artifacts.",
      "No supported metadata found does not guarantee platform behavior.",
    ],
    faqs: pageFaqs["why-does-my-photo-say-ai-info"],
    relatedGuides: guideCards.filter((card) => card.href !== "/why-does-my-photo-say-ai-info/"),
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/guides/", label: "Guides" },
      { href: "/why-does-my-photo-say-ai-info/", label: "Why Does My Photo Say AI Info" },
    ],
    indexable: true,
  },
  "c2pa-ai-label": {
    slug: "c2pa-ai-label",
    path: "/c2pa-ai-label",
    title: "C2PA and AI Labels: What Content Credentials Mean",
    description:
      "Learn what C2PA Content Credentials record, how they relate to AI labels, and what is lost when an embedded credential is removed.",
    h1: "How C2PA Content Credentials Relate to AI Labels",
    quickAnswer:
      "C2PA Content Credentials can carry provenance and editing history inside a file. This tool can remove a supported embedded credential from a new local copy, but that also removes the embedded provenance record from that copy.",
    evidenceLabel:
      "Last reviewed: 2026-09-03\nBased on: official C2PA and Adobe documentation + local file-format testing\nPlatform behavior may change",
    whyTitle: "What C2PA Means Here",
    whyPoints: [
      "C2PA stores a manifest package that can travel with a file copy.",
      "Adobe can attach Content Credentials to the file or store them in the cloud depending on export settings.",
      "Removing an embedded credential can remove provenance information from the cleaned copy.",
    ],
    canCheck: [
      "Whether a supported file contains embedded C2PA data",
      "Whether the cleaned copy no longer contains that embedded credential",
      "Whether ordinary payload and color data stayed intact",
    ],
    cannotChange: [
      "Cloud-stored provenance outside the file",
      "Invisible pixel-level watermarking systems",
      "Platform policy choices after upload",
    ],
    workflow: [
      "Inspect the file locally to confirm whether embedded C2PA exists.",
      "Review the one-time warning before keeping a cleaned copy.",
      "Download only the verified cleaned copy if you want a publish-ready variant.",
      "Archive the original if you want to preserve provenance.",
    ],
    verifySteps: [
      "Check Removed for Embedded C2PA.",
      "Confirm the one-time warning explains what is lost.",
      "Keep the original master file.",
    ],
    misunderstandings: [
      "C2PA removal is not the same thing as removing visible AI artifacts.",
      "This MVP does not claim to remove SynthID.",
      "A missing credential does not guarantee how a platform will classify the image.",
    ],
    faqs: pageFaqs["c2pa-ai-label"],
    relatedGuides: guideCards.filter((card) => card.href !== "/c2pa-ai-label/"),
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/guides/", label: "Guides" },
      { href: "/c2pa-ai-label/", label: "C2PA and AI Labels" },
    ],
    indexable: true,
  },
  "supported-formats": {
    slug: "supported-formats",
    path: "/supported-formats",
    title: "Supported Formats and Metadata Fields",
    description:
      "See what the local tool can inspect, remove or preserve in JPG, PNG and beta WebP files, including C2PA, XMP, EXIF and ICC.",
    h1: "Supported Image Formats and Metadata",
    quickAnswer:
      "JPG and PNG are the primary cleanup formats in the MVP. WebP remains beta inspect-only in this build while its real-image and decoded-pixel release gate is incomplete.",
    evidenceLabel:
      "Last reviewed: 2026-09-03\nBased on: file-format specifications + local file-format testing\nPlatform behavior may change",
    whyTitle: "Format Coverage",
    whyPoints: [
      "JPG and PNG support scanning and recommended cleanup for confirmed targets.",
      "WebP is surfaced as beta inspect-only because release gating depends on the full test matrix.",
      "Unsupported or ambiguous variants fail closed instead of falling back to re-encoding.",
    ],
    canCheck: [
      "JPG: C2PA APP11 groups, AI-related XMP, preserved EXIF and ICC",
      "PNG: caBX, supported prompt/workflow text fields, preserved color and transparency chunks",
      "WebP: inspect-only beta presentation in this build",
    ],
    cannotChange: [
      "HEIC or AVIF in the MVP",
      "Visible image content",
      "Unsupported metadata layouts that cannot be removed safely",
    ],
    workflow: [
      "Choose a supported file type.",
      "Review whether the result is ready, already clean, review needed, unsupported, or failed.",
      "Use the verified cleaned copy only when the result is ready.",
    ],
    verifySteps: [
      "Check that verified downloads are only offered for ready results.",
      "Use the table to confirm preserved vs removed metadata classes.",
      "Treat WebP as beta inspect-only until the complete release gate is verified.",
    ],
    misunderstandings: [
      "WebP should not be marketed as full-clean by default.",
      "A supported extension does not override magic-byte validation.",
      "The tool does not switch to Canvas re-encoding when cleanup is unsafe.",
    ],
    faqs: pageFaqs["supported-formats"],
    relatedGuides: guideCards,
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/supported-formats/", label: "Supported Formats" },
    ],
    indexable: true,
  },
  guides: {
    slug: "guides",
    path: "/guides",
    title: "AI Info and Image Label Guides",
    description:
      "Practical guides for checking AI label metadata in Instagram, Facebook, Photoshop and other image workflows.",
    h1: "AI Label and AI Info Guides",
    quickAnswer:
      "These launch guides explain supported file-level signals and let you run the same local tool without leaving the page.",
    faqs: pageFaqs.guides,
    relatedGuides: guideCards,
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/guides/", label: "Guides" },
    ],
    indexable: true,
  },
};

export function getPageContent(slug: keyof typeof launchPages) {
  return launchPages[slug];
}
