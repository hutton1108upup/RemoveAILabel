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

export type SourceKind = "Official source" | "User discussion";

export interface SourceLink {
  label: string;
  href: string;
  kind: SourceKind;
  note: string;
}

export interface EditorialSectionContent {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface PageContent {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  heroDescription?: string;
  quickAnswer?: string;
  evidenceLabel?: string;
  editorialSections?: EditorialSectionContent[];
  sources?: SourceLink[];
  whyTitle?: string;
  whyPoints?: string[];
  canTitle?: string;
  canCheck?: string[];
  cannotTitle?: string;
  cannotChange?: string[];
  workflowTitle?: string;
  workflow?: string[];
  verifyTitle?: string;
  verifySteps?: string[];
  misunderstandingsTitle?: string;
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

const metaLabelingSource: SourceLink = {
  label: "Meta: How AI labels work on Facebook and Instagram",
  href: "https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/",
  kind: "Official source",
  note: "Explains industry-shared signals, self-disclosure, and Meta's changing treatment of generated versus edited content.",
};

const adobeExportSource: SourceLink = {
  label: "Adobe: Export images with Content Credentials",
  href: "https://helpx.adobe.com/photoshop/desktop/save-and-export/metadata-content-credentials/export-your-work-with-content-credentials.html",
  kind: "Official source",
  note: "Documents current JPG and PNG export choices for attached, cloud-published, or omitted Content Credentials.",
};

const c2paSpecificationSource: SourceLink = {
  label: "C2PA: Content Credentials specification",
  href: "https://spec.c2pa.org/specifications/specifications/2.4/specs/ContentCredentials.html",
  kind: "Official source",
  note: "Defines the manifest, provenance, validation, and storage model used by C2PA Content Credentials.",
};

const pngSpecificationSource: SourceLink = {
  label: "W3C: Portable Network Graphics specification",
  href: "https://www.w3.org/TR/png-3/",
  kind: "Official source",
  note: "Defines PNG chunks and the file structure used by the scanner's format-aware checks.",
};

const webpSpecificationSource: SourceLink = {
  label: "Google: WebP RIFF container specification",
  href: "https://developers.google.com/speed/webp/docs/riff_container",
  kind: "Official source",
  note: "Documents the WebP RIFF container and metadata chunks; cleanup remains disabled in this build.",
};

const adobeCommunitySource: SourceLink = {
  label: "Adobe Community: Photographers discuss minor Generative Fill edits",
  href: "https://community.adobe.com/questions-712/meta-tags-images-as-made-with-ai-if-you-use-gen-fill-1169479/index3.html",
  kind: "User discussion",
  note: "Demand signal: photographers ask how small retouches, export metadata, and AI labels affect client trust. Reports are anecdotal.",
};

const photoshopRedditSource: SourceLink = {
  label: "Reddit: Users ask which Photoshop action triggered AI Info",
  href: "https://www.reddit.com/r/photoshop/comments/1e7bstn/which_photoshop_tools_triggers_the_instagram_ai/",
  kind: "User discussion",
  note: "Demand signal: users want to identify the responsible export, including after crops, undo, or deleted edits. Reports are not product documentation.",
};

const facebookRedditSource: SourceLink = {
  label: "Reddit: Facebook users report unexpected AI Info on photos",
  href: "https://www.reddit.com/r/facebook/comments/1f83oxn/help_taking_ai_info_off_my_posts_please_i_dont/",
  kind: "User discussion",
  note: "Demand signal: users ask what a label means and whether an existing post can be changed. The thread is not an official Meta source.",
};

const comfyUiDiscussionSource: SourceLink = {
  label: "Reddit: ComfyUI users discuss workflow metadata and privacy",
  href: "https://www.reddit.com/r/comfyui/comments/1guy7ck/is_it_safe_to_share_comfyui_images_to_civitai/",
  kind: "User discussion",
  note: "Demand signal: some creators need workflow reuse while others want to avoid sharing prompts, node data, or private workflow details.",
};

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
    heroDescription:
      "Posted a real or lightly retouched photo and saw AI Info? Check the original JPG or PNG for supported embedded signals before deciding what to do next.",
    quickAnswer:
      "AI Info does not, by itself, prove that an entire photo was generated. Meta says its labels can use industry-shared signals and disclosure, while platform systems may also act outside the file. This tool reports only the supported metadata in the local file you select.",
    evidenceLabel:
      "Last reviewed: 2026-09-03\nFacts: official Meta documentation + local file-format testing\nUser discussions: used to identify questions, not platform facts",
    editorialSections: [
      {
        title: "What Instagram AI Info Does—and Does Not—Mean",
        paragraphs: [
          "The notice signals that AI-related information or disclosure may be associated with a post. It is not a percentage score, and it does not tell viewers how much of the image was generated rather than photographed.",
          "A real photo can still carry an embedded credential or editing record after an AI-assisted retouch. The scan can show supported file metadata, but it cannot explain Instagram's complete decision.",
        ],
      },
      {
        title: "Already Posted? Start With the Original File",
        paragraphs: [
          "This tool cannot edit, appeal, or relabel a live Instagram post. If you plan to publish another copy, start with the local source or final export instead of downloading the social-media version.",
          "For a carousel, inspect each original file separately. A file-by-file result is more useful than guessing which image or non-file signal affected the post.",
        ],
      },
    ],
    sources: [metaLabelingSource, adobeCommunitySource, photoshopRedditSource],
    whyTitle: "Why a Real or Lightly Edited Photo Can Show AI Info",
    whyPoints: [
      "Meta describes industry-shared signals and creator disclosure as inputs to its labeling approach.",
      "An editing app can attach Content Credentials or AI-related XMP to the exported file.",
      "Instagram can use platform-side systems that are not visible to a local metadata scanner.",
    ],
    canTitle: "What the Local File Scan Can Confirm",
    canCheck: [
      "Whether the selected JPG or PNG has an embedded C2PA credential",
      "Whether confirmed AI-related XMP is present in a supported packet",
      "Whether supported prompt or workflow text is stored in the file",
    ],
    cannotTitle: "What Instagram Still Controls",
    cannotChange: [
      "The label, menu, or appeal state of an existing post",
      "How Instagram interprets disclosure or non-file signals",
      "Visible edits, watermarks, or artifacts in the image pixels",
    ],
    workflowTitle: "Check an Image Before Posting to Instagram",
    workflow: [
      "Keep the original photo or layered master before making a social copy.",
      "Scan each final JPG or PNG that you plan to include in the post.",
      "Read the result: ready, already clean, review needed, unsupported, or failed.",
      "Use a verified cleaned copy when appropriate, keep the original, and follow any disclosure rules that apply.",
    ],
    verifyTitle: "How to Read the Instagram Preflight Result",
    verifySteps: [
      "Clean copy ready means the supported targets were removed and the new file passed the local verification step.",
      "Already clean means no supported target was found; it is not a prediction about Instagram.",
      "Review needed or failed means the tool did not produce a downloadable clean copy.",
    ],
    misunderstandingsTitle: "What a Clean Result Does Not Promise",
    misunderstandings: [
      "It does not remove AI Info from a post that is already live.",
      "It does not prove that Instagram has no other signals or disclosures.",
      "It does not hide visible edits or replace a disclosure you are required to make.",
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
    heroDescription:
      "Preparing a real photo, product image, or campaign asset for Facebook? Scan the exported JPG or PNG for supported AI-related metadata before posting.",
    quickAnswer:
      "Facebook AI Info can reflect industry-shared signals or disclosure, but it does not explain every platform decision. This local scan can identify supported fields in your file; it cannot remove a label from a live post or guarantee how Facebook will treat a new upload.",
    evidenceLabel:
      "Last reviewed: 2026-09-03\nFacts: official Meta documentation + local file-format testing\nUser discussions: used to identify questions, not platform facts",
    editorialSections: [
      {
        title: "Check a Batch Before a Campaign Goes Live",
        paragraphs: [
          "Product and brand teams often work with several exports from different editing tools. Add the final files as one batch so each image gets its own result instead of assuming the whole set is clean.",
          "One unsupported or failed file does not cancel the completed checks. Download is offered only for clean copies that passed verification, and the original files remain unchanged.",
        ],
      },
    ],
    sources: [metaLabelingSource, facebookRedditSource],
    whyTitle: "Why Facebook May Show AI Info",
    whyPoints: [
      "Meta uses an AI-labeling approach across Facebook and Instagram that includes industry-shared signals and disclosure.",
      "A photo can carry Content Credentials or AI-related XMP after it leaves an editing app.",
      "A new local copy changes supported metadata in that file, not Facebook's account, post, or policy systems.",
    ],
    canTitle: "What the Facebook Preflight Scan Can Confirm",
    canCheck: [
      "Embedded C2PA credentials in the selected file",
      "Confirmed AI-related XMP in supported packets",
      "Supported prompt or workflow text stored in PNG files",
    ],
    cannotTitle: "What Remains Outside the File",
    cannotChange: [
      "AI Info already attached to a live Facebook post",
      "Disclosure choices, account settings, or platform-side classifiers",
      "Visible retouching, watermarks, or synthetic-looking details",
    ],
    workflowTitle: "Check Images Before Posting to Facebook",
    workflow: [
      "Collect the final JPG and PNG exports you intend to publish.",
      "Scan the files locally, one result per image, without sending their contents to this site.",
      "Download only the copies marked Clean copy ready.",
      "Keep the originals for provenance, editing history, and future revisions.",
    ],
    verifyTitle: "How to Read a Batch Result",
    verifySteps: [
      "Check each file's before and clean-copy columns instead of relying on the batch total alone.",
      "Confirm that expected EXIF, orientation, copyright, and ICC data stayed preserved when separable.",
      "Treat the report as file verification, not a Facebook outcome prediction.",
    ],
    misunderstandingsTitle: "What This Does Not Fix on Facebook",
    misunderstandings: [
      "It cannot edit, appeal, or relabel an existing post.",
      "It cannot change visible edits inside the pixels.",
      "It cannot rule out platform signals that are not stored in the file.",
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
    heroDescription:
      "Used Generative Fill, Generative Expand, Crop, or an AI-assisted Remove option on a real photo? Check the final JPG or PNG export instead of guessing from the tool name.",
    quickAnswer:
      "An AI-related credential says that an AI-assisted action may be part of the file's history; it does not measure how much of the image was generated. Photoshop versions and export paths change, so inspect the final export before delivery or posting.",
    evidenceLabel:
      "Last reviewed: 2026-09-03\nFacts: official Adobe and Meta documentation + local file-format testing\nUser discussions: used to identify questions, not trigger rules",
    editorialSections: [
      {
        title: "Check the Export, Not Just the Tool Name",
        paragraphs: [
          "Photographers repeatedly ask whether Generative Fill, Generative Expand, Crop, Remove, or an undone edit caused an AI Info notice. There is no stable tool-name checklist that covers every Photoshop version and export path.",
          "Use Photoshop's current export options to review how Content Credentials will be handled, then scan the actual JPG or PNG you plan to share. That is more reliable than inferring metadata from the editing step alone.",
        ],
      },
      {
        title: "A Small Retouch Is Not the Same as a Fully Generated Photo",
        paragraphs: [
          "Community discussions often come from photographers who removed a distraction, extended a crop, or repaired a small area in a photo they shot. Their concern is that viewers or clients may read an AI label as proof that the whole image was generated.",
          "This scanner avoids that conclusion. It reports supported fields in the exported file; it does not estimate the percentage of generated pixels or decide whether the photograph is authentic.",
        ],
      },
    ],
    sources: [adobeExportSource, metaLabelingSource, adobeCommunitySource, photoshopRedditSource],
    whyTitle: "Why a Photoshop Export Can Carry AI-related Information",
    whyPoints: [
      "Adobe documents export choices that can attach Content Credentials, publish them to its cloud, or omit them from supported exports.",
      "An AI-assisted edit can be recorded as part of provenance or editing history without describing the whole image as generated.",
      "A cleaned copy changes supported metadata only; it does not reverse the visible Photoshop edit.",
    ],
    canTitle: "What the Export Scan Can Confirm",
    canCheck: [
      "Whether the final JPG or PNG contains an embedded C2PA credential",
      "Whether supported XMP includes confirmed AI-related fields",
      "Whether supported prompt or workflow text is present",
    ],
    cannotTitle: "What the File Cannot Tell You",
    cannotChange: [
      "Which Photoshop button definitively caused a platform label",
      "How much of the visible image was generated or photographed",
      "How Instagram, Facebook, or another service will classify the upload",
    ],
    workflowTitle: "Check a Photoshop Export Before You Share It",
    workflow: [
      "Keep the layered document and original export before creating a delivery copy.",
      "Review the Content Credentials choice shown by your current Photoshop export workflow.",
      "Scan the final JPG or PNG that will actually be posted or delivered.",
      "Download a verified clean copy when appropriate and archive the original with its provenance.",
    ],
    verifyTitle: "Read the Export Result Without Overclaiming",
    verifySteps: [
      "Removed means a supported target existed before cleanup and is absent from the verified copy.",
      "Preserved means the scanner confirmed the relevant EXIF, orientation, copyright, or ICC data stayed intact when separable.",
      "Not found describes this export only; it is not proof that no AI-assisted edit occurred.",
    ],
    misunderstandingsTitle: "Questions the Export Alone Cannot Answer",
    misunderstandings: [
      "Undoing or deleting a layer does not prove what metadata is present in the final export.",
      "Removing an embedded credential does not remove a credential stored elsewhere.",
      "A clean verification table does not promise a particular platform label.",
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
    heroDescription:
      "A photo can be real and still carry AI-related provenance or editing information. Separate what is inside the file from what the platform decides after upload.",
    quickAnswer:
      "AI Info can come from an embedded industry signal, a disclosure made during posting, or a platform system outside the file. A local scan answers only the first question, so an already-clean result cannot explain every label.",
    evidenceLabel:
      "Last reviewed: 2026-09-03\nFacts: official Meta, Adobe, and C2PA documentation + local file-format testing\nPlatform behavior may change",
    editorialSections: [
      {
        title: "Where an AI Info Signal Can Come From",
        paragraphs: [
          "The same notice can sit at the end of different paths. Keeping those paths separate prevents a metadata scan from being mistaken for a full explanation of a platform decision.",
        ],
        bullets: [
          "Inside the file: an embedded C2PA credential, supported AI-related XMP, or prompt and workflow text.",
          "During publishing: a person or organization may disclose that AI was used.",
          "On the platform: classifiers or other systems may assess information that is not stored in the local file.",
        ],
      },
      {
        title: "What to Do When the Scan Finds Nothing",
        paragraphs: [
          "First confirm that you scanned the same source or export you intended to upload. A social-media download may not contain the same metadata as your local master.",
          "If the correct local file is already clean, stop treating metadata as the only possible cause. Review disclosure choices and the platform's current help or appeal options instead.",
        ],
      },
    ],
    sources: [metaLabelingSource, adobeExportSource, c2paSpecificationSource],
    whyTitle: "Why Real Photos Can Still Carry AI-related Information",
    whyPoints: [
      "Content Credentials can describe provenance and editing actions, not just fully generated images.",
      "AI-related XMP or workflow text can remain in an export even when the pixels look like an ordinary photo.",
      "Meta says its labeling approach also includes disclosure and systems beyond one metadata field.",
    ],
    canTitle: "What the Local File Can Show",
    canCheck: [
      "Supported embedded provenance and AI-related metadata",
      "Prompt or workflow text stored in supported PNG fields",
      "Whether the verified copy preserved expected EXIF, orientation, and ICC data",
    ],
    cannotTitle: "What Requires a Different Investigation",
    cannotChange: [
      "A disclosure selected during publishing",
      "A classifier or other platform-side signal",
      "The status of a post that is already uploaded",
    ],
    workflowTitle: "Separate the File Check From the Platform Check",
    workflow: [
      "Identify the exact local source or final export used for the post.",
      "Scan it for supported embedded signals.",
      "Keep the original and use a verified copy only when removing those fields fits your purpose.",
      "If the file is already clean, review disclosure and platform-side explanations separately.",
    ],
    verifyTitle: "How to Interpret the File Evidence",
    verifySteps: [
      "Found identifies a supported field in this file, not the origin of every visible pixel.",
      "Removed means that field is absent from the verified copy.",
      "Not found means the scanner did not find a supported target in this file; it is not a platform guarantee.",
    ],
    misunderstandingsTitle: "Conclusions the Scan Does Not Support",
    misunderstandings: [
      "A software name alone does not prove that the whole image was AI-generated.",
      "Removing metadata does not change visible edits or invisible pixel watermarks.",
      "An already-clean result does not guarantee how a third party will label the image.",
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
    heroDescription:
      "Content Credentials can carry verifiable provenance and editing history. Check what is embedded before deciding whether a separate publishing copy should remove it.",
    quickAnswer:
      "Removing a supported embedded C2PA credential also removes that provenance package from the cleaned copy. The original file is never overwritten, and removing one embedded copy does not erase credentials that may be stored elsewhere.",
    evidenceLabel:
      "Last reviewed: 2026-09-03\nFacts: official C2PA and Adobe documentation + local file-format testing\nStorage and platform behavior may change",
    editorialSections: [
      {
        title: "Before You Remove Content Credentials",
        paragraphs: [
          "Ask what the next copy is for. If a client, archive, or publication needs verifiable provenance, keep the original credential-bearing file. If you need a separate publishing copy without a supported embedded credential, create that copy and keep both files clearly named.",
          "Adobe documents both file-attached and cloud-published Content Credentials. Removing an embedded package from one file cannot remove a credential stored in Adobe's cloud or another external location.",
        ],
        bullets: [
          "Keep the original when attribution, edit history, or authenticity review matters.",
          "Use the cleaned copy only for the specific workflow that needs it.",
          "Do not present a cleaned copy as proof that no AI-assisted action occurred.",
        ],
      },
    ],
    sources: [c2paSpecificationSource, adobeExportSource],
    whyTitle: "What Content Credentials Record",
    whyPoints: [
      "A C2PA manifest can record provenance, assertions, and editing history that travel with a file.",
      "The credential is designed to be validated and assessed under a trust model, not treated as a simple AI yes-or-no flag.",
      "Storage can be embedded in the file or associated through an external service, depending on the producing tool.",
    ],
    canTitle: "What This Scanner Can Verify",
    canCheck: [
      "Whether a supported JPG or PNG contains an embedded C2PA package",
      "Whether that embedded package is absent from the cleaned copy",
      "Whether the encoded image payload, orientation, and color data stayed intact where supported",
    ],
    cannotTitle: "What Removing One File Cannot Do",
    cannotChange: [
      "Delete cloud-stored or otherwise external provenance",
      "Remove invisible pixel-level watermarking systems such as SynthID",
      "Control how a platform interprets the image after upload",
    ],
    workflowTitle: "Create a Separate Copy Without Losing the Original",
    workflow: [
      "Scan the intended source file and confirm whether an embedded credential exists.",
      "Decide whether provenance or attribution must remain available for this use case.",
      "Download only a clean copy that passed verification.",
      "Archive the original separately so the provenance record is not lost.",
    ],
    verifyTitle: "Verify Both Removal and Preservation",
    verifySteps: [
      "Check Removed only when Embedded C2PA was found before cleanup.",
      "Confirm the report shows the encoded image payload was not re-encoded on the supported file.",
      "Keep the original master even after the cleaned copy is verified.",
    ],
    misunderstandingsTitle: "What C2PA Removal Does Not Prove",
    misunderstandings: [
      "It does not remove visible AI artifacts or reverse an edit.",
      "It does not remove SynthID or another pixel-level watermark.",
      "A missing embedded credential does not prove that an image was never edited with AI.",
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
    heroDescription:
      "Check what this build can scan, clean, and preserve in JPG and PNG files—and why WebP remains inspect-only until its release gate is complete.",
    quickAnswer:
      "JPG and PNG support verified cleanup for confirmed targets. WebP can be inspected but not cleaned in this build. Keep the original whenever you may need its Content Credentials, camera data, or embedded workflow later.",
    evidenceLabel:
      "Last reviewed: 2026-09-03\nFacts: file-format specifications + local parser and pixel-regression tests\nUser discussions: used to identify preserve-versus-remove decisions",
    editorialSections: [
      {
        title: "Keep or Remove Workflow Metadata?",
        paragraphs: [
          "Keep the original PNG when you want to drag it back into ComfyUI, reproduce settings, or share the workflow intentionally. Prompt, model, seed, sampler, and node data can be useful working material.",
          "Create a cleaned copy when a client or publishing workflow should not receive supported prompt or workflow fields. Not every workflow contains sensitive data, so inspect first and choose based on the destination.",
          "The original file remains unchanged. You can also turn off prompt and workflow removal in Advanced Options and regenerate the copy.",
        ],
      },
    ],
    sources: [pngSpecificationSource, webpSpecificationSource, c2paSpecificationSource, comfyUiDiscussionSource],
    whyTitle: "What This Build Supports Today",
    whyPoints: [
      "JPG and PNG support scanning, confirmed-target cleanup, and post-clean verification.",
      "WebP is inspect-only because the full real-image and decoded-pixel release gate is not complete.",
      "An ambiguous or damaged file fails closed rather than falling back to Canvas re-encoding.",
    ],
    canTitle: "What the Scanner Can Inspect",
    canCheck: [
      "JPG: confirmed C2PA APP11 groups, AI-related XMP, EXIF, orientation, copyright, and ICC",
      "PNG: caBX, supported prompt and workflow text, XMP, eXIf, color, transparency, and animation chunks",
      "WebP: supported container and metadata inspection without a cleaned download",
    ],
    cannotTitle: "What Is Not a Supported Cleanup",
    cannotChange: [
      "HEIC, AVIF, video, PDF, audio, or Office files",
      "Visible image content or pixel-level watermarks",
      "A metadata layout that cannot be rewritten and verified safely",
    ],
    workflowTitle: "Choose the Right Copy for the Job",
    workflow: [
      "Keep the original file as the archive and working master.",
      "Scan the exact copy you plan to publish, share, or deliver.",
      "Review what was found and adjust Advanced Options when you need to preserve workflow data.",
      "Use a downloaded copy only when its status is Clean copy ready.",
    ],
    verifyTitle: "How Format Support Appears in the Result",
    verifySteps: [
      "Ready provides a verified download for a supported rewrite.",
      "Already clean leaves the source untouched because no supported target was found.",
      "Review needed, unsupported, or failed never provides an unverified clean download.",
    ],
    misunderstandingsTitle: "Format Limits Worth Knowing",
    misunderstandings: [
      "A .jpg, .png, or .webp extension does not override the file's real magic bytes.",
      "WebP support on this page does not mean WebP cleanup is enabled.",
      "Preserving the original is still necessary when provenance or workflow reuse matters.",
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
