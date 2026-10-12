import type { EditorialSectionContent } from "./pages";

export const homeIntentSection: EditorialSectionContent = {
  title: "Which AI Label Do You Want to Remove?",
  paragraphs: [
    "Choose the problem you want to solve. An AI tag remover can clean supported hidden file metadata; platform notices and visible image content need different next steps.",
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
    links: [{ label: "Use the free AI label remover for a local image", href: "/#use-free-tool" }],
  };
}

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
