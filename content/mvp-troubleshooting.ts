import type { EditorialSectionContent, GuideCard, PageContent } from "./pages";

export const troubleshootingGuide: GuideCard = {
  title: "AI Label Still Showing After Cleanup?",
  description: "Check the downloaded copy, later exports, and where the remaining label appears.",
  href: "/ai-label-after-metadata-removal/",
};

export const firstScanDecision: EditorialSectionContent = {
  title: "Read the Scan Result Before Choosing Your Next Step",
  paragraphs: ["Start with the exact local export used for your photo. These results describe that file, rather than the platform's reason for labeling it."],
  table: {
    caption: "What your first file check means",
    columns: ["Result", "Next step"],
    rows: [
      ["File-level clean copy ready", "Review what was removed and preserved. Download that separate copy and select its new filename when sharing."],
      ["Already clean", "No supported target was found. Check that this is the final export, then consider disclosure and platform-side explanations."],
      ["Review needed / unsupported", "Read the reason in the result. Check the format limits; the tool has not offered a verified clean download."],
      ["Failed", "Keep the original and follow the error message. A failed operation is not evidence that the file was cleaned."],
    ],
  },
  links: [
    { label: "Check supported formats and cleanup limits", href: "/supported-formats/" },
    { label: "Already cleaned the file, but the label remains?", href: troubleshootingGuide.href },
  ],
};

export const instagramUploadWorkflow: EditorialSectionContent = {
  title: "How to Check a Photo Before Posting to Instagram",
  paragraphs: ["An AI Info remover can prepare a separate local image copy. Start before publishing, with the file you actually intend to share."],
  bullets: [
    "Finish editing and select the final JPG or PNG in the tool above. Keep the original export.",
    "Review the per-file scan. If confirmed targets can be cleaned safely, the result offers a verified copy.",
    "Choose Download Cleaned Image and find the filename ending in -clean in your downloads.",
    "Open that copy and check its appearance. You can select it in the tool again to inspect the downloaded file before sharing.",
    "Attach the downloaded copy deliberately when preparing your post. A later editor export creates another file that may need checking.",
  ],
  table: {
    caption: "Instagram photos and video are different file tasks",
    columns: ["What you plan to share", "What to check here"],
    rows: [
      ["Feed photo or carousel", "Check each final still image. One clean file does not describe the entire carousel."],
      ["Story photo", "Check the local still you will attach. This tool cannot edit an existing Story or inspect a video."],
      ["Reel cover", "Check the separate cover image, if you have one. That result does not describe the Reel's video."],
      ["Video, live post, or profile label", "Use Instagram's current help for that situation. The image tool does not change platform records or account notices."],
    ],
  },
  links: [{ label: "The file was cleaned, but Instagram still shows AI Info", href: troubleshootingGuide.href }],
};

export const formatDecisionExamples: EditorialSectionContent = {
  title: "Common File Decisions Before You Clean",
  paragraphs: ["Choose a format the tool can process, then decide which information the new copy should keep."],
  table: {
    caption: "Examples of supported and unsupported next steps",
    columns: ["Your situation", "What to do"],
    rows: [
      ["WebP has metadata", "WebP is inspection only. If you need cleanup here, export a genuine JPG or PNG and inspect that new file. Conversion can change image encoding."],
      ["An iPhone photo is HEIC", "Export or convert it to a supported format. Changing .heic to .jpg does not change the file's contents."],
      ["No supported metadata was found", "There may be nothing supported to remove. Already clean does not prove that a platform will omit an AI notice."],
      ["Keep camera information", "Use default cleanup and review the preservation report. Camera EXIF and copyright stay when separable from removed packets."],
      ["Remove private location or device fields", "Use the optional privacy cleanup only when you want that information removed too. Check which camera or copyright details are affected."],
    ],
  },
  links: [{ label: "Follow the iPhone photo and download workflow", href: "/remove-ai-label-iphone/" }],
};

export const troubleshootingPage: PageContent = {
  slug: "ai-label-after-metadata-removal",
  path: "/ai-label-after-metadata-removal",
  title: "AI Label Still Showing After Metadata Removal?",
  description: "Check the cleaned file, export history and publishing workflow when an AI label remains. Learn what metadata cleanup can verify and what needs platform help.",
  h1: "Why an AI Label Can Remain After Metadata Cleanup",
  heroDescription: "Already downloaded a cleaned image, but still seeing AI Info or another AI label? Check the copy and publishing step before repeating cleanup.",
  quickAnswer: "A verified download confirms supported changes in one local file. If a label remains, check which copy you shared, whether it was exported again, and whether the notice belongs to an existing post or account. Metadata cleanup cannot control every platform signal.",
  evidenceLabel: "Content reviewed October 12, 2026\nFile scope: verified local copy and export workflow\nPlatform scope: official Meta documentation; no promise about a future upload",
  editorialSections: [
    {
      title: "1. Find the Exact Copy You Shared",
      paragraphs: ["The original and the cleaned copy can look identical. Locate the file ending in -clean and compare its filename with the attachment you selected. A screenshot of a labeled post or a file downloaded from a social app is not necessarily the export you checked.", "For a carousel, identify each attachment separately. One successful report cannot explain every image or the platform's decision about a whole post."],
    },
    {
      title: "2. Recheck the Downloaded File",
      paragraphs: ["Select the downloaded copy in the tool above. Compare it with the first report: supported targets that were removed should no longer appear as confirmed findings. Read warnings rather than assuming every field in every format is covered."],
      table: {
        caption: "Use the second scan to choose a useful action",
        columns: ["What the second check shows", "Action"],
        rows: [
          ["No supported target found", "Keep the result as file evidence. Move on to export history and the location of the label instead of repeatedly cleaning the same copy."],
          ["A confirmed target is present", "Confirm this is the downloaded copy and whether another app saved it again. Inspect that final export; do not treat an earlier report as evidence about a later file."],
          ["Review needed, unsupported, or failed", "Read the explanation and format limits. No verified clean result has been established for this operation."],
        ],
      },
      links: [{ label: "Understand the supported formats and report limits", href: "/supported-formats/" }],
    },
    {
      title: "3. Check Any Editing or Export After Cleanup",
      paragraphs: ["An editor, converter, or sharing workflow may create a new file and write different metadata. A report for the downloaded copy does not describe that later export. Check the final file after the last editing step.", "Keep the original export and the cleaned copy separately. If camera details or copyright matter, review what was preserved before using a privacy-cleaning option. Repeated cleanup does not make a platform outcome more certain."],
    },
    {
      title: "4. Locate the Remaining Notice",
      paragraphs: ["A notice on an already-published post is stored on the platform, not inside a local image you are now editing. This tool cannot relabel that post. A profile notice is an account question, while a new-upload label may involve file indicators, disclosure, or other systems.", "Meta describes using industry signals and creator disclosure in its labeling approach. An embedded Content Credential and a pixel-level watermark are different mechanisms. This tool removes supported metadata; it does not remove SynthID or change an independent visual classifier."],
      links: [
        { label: "Instagram: before posting and already-published situations", href: "/instagram-ai-info/" },
        { label: "Facebook AI Info and platform-side limits", href: "/facebook-ai-info/" },
      ],
    },
    {
      title: "5. Know When to Stop Repeating Cleanup",
      paragraphs: ["When the correct final file has no supported targets, more passes through the same metadata cleaner do not address a live-post label, disclosure, or a signal outside the file. Use the platform's current help or available review route for the notice you see.", "Keep the filename, first report, final export, and platform notice together when investigating the problem. Do not delete a post just to test whether metadata was the cause."],
      links: [{ label: "Seeing AI Info for the first time? Start with the cause guide", href: "/why-does-my-photo-say-ai-info/" }],
    },
  ],
  sources: [
    { label: "Meta: How AI Info labels work", href: "https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/", kind: "Official source", note: "Explains industry-shared indicators, disclosure, and the generated-versus-edited distinction." },
    { label: "Google DeepMind: SynthID", href: "https://deepmind.google/models/synthid/", kind: "Official source", note: "Describes watermarking beyond ordinary file metadata; removal is outside this tool." },
  ],
  faqs: [
    { question: "Does a verified clean copy guarantee no AI label?", answer: "No. Verification covers supported changes to that local file. It does not control a platform's classification, disclosures, or records about a published post." },
    { question: "Can editing after cleanup add metadata again?", answer: "A new export can contain different fields. Inspect the final file after editing instead of reusing a report for an earlier copy." },
    { question: "Should I delete and repost to test the label?", answer: "This tool cannot determine that deleting a post is necessary or that reposting will change the label. Keep the post and original file while checking the source, copy, and platform's current help." },
    { question: "Can the cleaner remove SynthID or every AI detection signal?", answer: "No. It works on supported file metadata, not invisible pixel watermarks or visual classifiers. A clean metadata report does not prove human authorship." },
  ],
  relatedGuides: [
    { title: "Why Does My Photo Say AI Info?", description: "Understand a label before your first cleanup.", href: "/why-does-my-photo-say-ai-info/" },
    { title: "Supported Image Formats", description: "Know which files can be inspected and cleaned.", href: "/supported-formats/" },
  ],
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Guides", href: "/guides/" }, { label: "AI Label After Cleanup", href: "/ai-label-after-metadata-removal/" }],
  indexable: true,
};
