import type { EditorialSectionContent } from "./pages";

export const homeIntentSection: EditorialSectionContent = {
  title: "Remove Hidden AI Tags from an Image",
  paragraphs: [
    "An AI tag remover checks hidden metadata in JPG and PNG images: supported Content Credentials, AI-related XMP, and prompt or workflow fields. Platform notices and visible watermarks need different next steps.",
  ],
  bullets: [
    "Choose your final image after editing or exporting.",
    "Review the findings and download a verified copy when available. Your original stays unchanged.",
    "Recheck the download. A clean metadata report does not guarantee no platform label.",
  ],
  table: {
    caption: "File metadata, platform labels, and visible watermarks are different",
    columns: ["Your problem", "Start here"],
    rows: [
      ["Hidden AI tags in a JPG or PNG", "Choose the final file above. The tool checks supported C2PA, XMP, and workflow fields and verifies a separate copy."],
      ["AI Info on Instagram or Facebook", "Open the platform guide below to distinguish a local file from an existing post or account notice."],
      ["Visible text, a watermark, or an AI editing effect", "Read the image-content limits below. Metadata cleanup leaves pixels unchanged; visible edits need an image editor."],
    ],
  },
  links: [
    { label: "Check hidden AI tags in a local image", href: "/#use-free-tool" },
    { label: "Instagram AI Info: before posting or already live", href: "/instagram-ai-info/" },
    { label: "Facebook AI Info: choose the right next step", href: "/facebook-ai-info/" },
    { label: "Visible watermarks and image-content limits", href: "/#what-this-tool-can-change" },
  ],
};

export function platformDecisionSection(platform: "Instagram" | "Facebook"): EditorialSectionContent {
  return {
    title: `Before Posting or Already Live on ${platform}?`,
    paragraphs: ["Start with where you see the label. A local image file, a published post, and a profile notice need different next steps."],
    table: {
      caption: `Choose your ${platform} workflow`,
      columns: ["Situation", "Next step"],
      rows: [
        ["You have not published yet", "Check the final JPG or PNG above. Review the findings and download a verified copy when supported targets are found."],
        ["The post is already live", `This tool cannot edit that post. Check ${platform}'s current help and available review options; do not delete a post just to test metadata cleanup.`],
        ["The label is on your profile", "An account notice is separate from image metadata. Use the platform's account help rather than repeatedly cleaning the same file."],
        ["The scan finds no supported AI metadata", "Check that you selected the final export. Unsupported fields, disclosures, or platform systems may still matter; a clean scan is not a platform prediction."],
      ],
    },
    links: [{ label: `Before posting to ${platform}, check hidden image tags with the free AI tag remover`, href: "/#use-free-tool" }],
  };
}

export const homeTagFieldsSection: EditorialSectionContent = {
  title: "What Does an AI Tag in an Image Mean?",
  paragraphs: ["AI tags can mean different things. Distinguish hidden file metadata from visible marks and platform records."],
  table: {
    caption: "Common names, file information, and cleanup scope",
    columns: ["What you call it", "What may be in the file", "What this tool can do"],
    rows: [
      ["Content Credentials or a provenance tag", "An embedded C2PA package; its presence alone is not an AI verdict.", "Remove confirmed packages when safe. Keep the original if you need provenance."],
      ["AI editing tags", "Supported XMP packets containing confirmed AI-related fields.", "Remove eligible packets in a separate copy. Information inside a removed packet cannot always be kept separately."],
      ["Prompts, seeds, or workflow data", "Supported PNG text or XMP fields containing generation settings or a workflow.", "Remove recognized targets when enabled. Keep the original if you need to reproduce or reopen the workflow."],
      ["AI Info, a watermark, or an AI badge", "A platform record, visible image content, or a signal encoded in pixels may be involved.", "File cleanup cannot edit an existing post, erase visible marks, or remove pixel-level watermarks."],
    ],
  },
  links: [
    { label: "Check which image formats and fields are supported", href: "/supported-formats/" },
    { label: "Understand C2PA credentials before removing them", href: "/c2pa-ai-label/" },
  ],
};

export const formatCleanupExamples: EditorialSectionContent = {
  title: "JPG and PNG: Before and After AI Tag Removal",
  paragraphs: ["These are local test examples, not customer cases or tests of a social platform's labeling. The JPG is a public legacy Adobe sample; the PNG is a generated test image with an explicit metadata field added for testing."],
  table: {
    caption: "Reproducible file examples and their limits",
    columns: ["Example", "Before cleanup", "After cleanup and verification"],
    rows: [
      ["JPG: adobe-20220124-CA.jpg", "The public 1024 × 683 JPEG contains an embedded C2PA package.", "The supported embedded package is removed. Local tests confirm unchanged dimensions and decoded pixels. This is not a current Photoshop export or a platform-label prediction."],
      ["PNG: transparent 2 × 2 test image", "A valid PNG has a parameters text field added: Steps: 20, Sampler: Euler, Seed: 42.", "The supported AI text field is removed; local tests confirm unchanged dimensions and decoded pixels, including transparency. This constructed fixture does not establish coverage for every generator export."],
      ["WebP: inspection only", "The scanner can inspect supported metadata in a WebP file.", "No cleaned WebP download is offered in this version. Export a genuine JPG or PNG if needed, then check that new file; conversion may change image encoding."],
    ],
  },
  bullets: [
    "Keep the original. Review the removed and preserved fields before downloading the separate copy.",
    "Recheck the downloaded copy to confirm supported targets no longer appear. No supported target found does not prove the image was never AI-edited.",
  ],
  links: [
    { label: "Open the AI tag remover and choose Try a sample image for the public JPG", href: "/#use-free-tool" },
    { label: "Original Adobe JPG in the C2PA public test files", href: "https://github.com/c2pa-org/public-testfiles/blob/main/legacy/1.4/image/jpeg/adobe-20220124-CA.jpg" },
    { label: "A label remains after file cleanup: check the next step", href: "/ai-label-after-metadata-removal/" },
  ],
};

export const sampleEvidenceSection: EditorialSectionContent = {
  title: "Try a Real C2PA Sample",
  paragraphs: [
    "The tool's Try a sample image button loads adobe-20220124-CA.jpg from the C2PA public test files. It is a 1024 × 683 JPEG with embedded Content Credentials. You can inspect it, download a cleaned copy, and compare the report yourself.",
    "Our local check removes its embedded C2PA package while keeping the encoded image payload, dimensions, and decoded pixels unchanged. This legacy interoperability sample is not a current Photoshop Generative Fill export, and it does not demonstrate how a social platform will label your photo.",
  ],
  links: [
    { label: "Open the tool and choose Try a sample image", href: "/#use-free-tool" },
    { label: "C2PA public test files: original Adobe sample", href: "https://github.com/c2pa-org/public-testfiles/blob/main/legacy/1.4/image/jpeg/adobe-20220124-CA.jpg" },
    { label: "Sample license: CC BY-SA 4.0", href: "https://creativecommons.org/licenses/by-sa/4.0/" },
  ],
};

export const formatComparisonSection: EditorialSectionContent = {
  title: "Can This AI Label Remover Clean Your File?",
  paragraphs: ["Check the format before choosing a file. A scan and a cleaned download are different capabilities."],
  table: {
    caption: "Supported image formats and cleanup limits",
    columns: ["Format", "Inspect", "Cleaned copy"],
    rows: [
      ["JPG / JPEG", "Supported metadata", "Yes, for confirmed targets that can be removed safely; no image re-encoding."],
      ["PNG", "Supported metadata", "Yes, for confirmed targets that can be removed safely; image data and transparency stay intact."],
      ["WebP", "Supported metadata", "No. Inspection only in this version."],
      ["HEIC / AVIF / RAW", "Not supported", "Export a real JPG or PNG first; renaming the extension is not conversion."],
      ["Video / Live Photo video", "Not supported", "This tool handles still-image metadata only."],
    ],
  },
  links: [
    { label: "Check a JPG or PNG with the free AI label remover", href: "/#use-free-tool" },
    { label: "iPhone: choose a full photo and save the cleaned copy", href: "/remove-ai-label-iphone/" },
  ],
};
