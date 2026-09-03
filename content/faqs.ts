export interface FaqItem {
  question: string;
  answer: string;
}

export const homeFaqs: FaqItem[] = [
  {
    question: "What does an AI label remover actually remove?",
    answer:
      "It removes supported file-level metadata such as embedded C2PA credentials, confirmed AI-related XMP packets, and supported prompt or workflow fields in a new local copy.",
  },
  {
    question: "Are my images uploaded?",
    answer:
      "No. Files are read locally in your browser, sent to a local Web Worker for processing, and are not uploaded to a server by this tool.",
  },
  {
    question: "Can this remove AI Info from an existing post?",
    answer:
      "No. The tool only checks a local file and can create a cleaned local copy before you publish or deliver it.",
  },
  {
    question: "Does cleaning metadata guarantee no AI label?",
    answer:
      "No. Platforms may still use other signals, disclosure rules, or policy systems that this tool cannot control.",
  },
  {
    question: "Does the tool reduce image quality?",
    answer:
      "On supported JPG and PNG files, the tool is designed to keep the encoded image payload unchanged rather than re-encoding the image.",
  },
  {
    question: "What is C2PA?",
    answer:
      "C2PA is a standard for Content Credentials that can embed provenance and editing information inside a file.",
  },
  {
    question: "Will camera EXIF and copyright be preserved?",
    answer:
      "They are preserved by default when they are separable from the metadata packet being removed. If a copyright field lives inside the same removable packet, it cannot be preserved independently.",
  },
  {
    question: "Can it remove PNG prompts and ComfyUI workflows?",
    answer:
      "Yes, for supported PNG text chunks and XMP packets that contain confirmed prompt, workflow, model, or seed-style fields.",
  },
  {
    question: "Why was no metadata found?",
    answer:
      "The file may already be clean, the metadata may not use a supported format, or a platform may rely on signals outside the file itself.",
  },
  {
    question: "Is the tool free?",
    answer:
      "Yes. The MVP is free, requires no account, and does not gate downloads behind a paywall.",
  },
];

export const pageFaqs: Record<string, FaqItem[]> = {
  "instagram-ai-info": [
    {
      question: "Why can a real photo still show AI Info on Instagram?",
      answer:
        "A real photo can still carry Content Credentials or editing metadata after AI-assisted tools such as Generative Fill, Expand, or denoise workflows.",
    },
    {
      question: "Can this tool edit an Instagram post after upload?",
      answer:
        "No. It only checks a local source file and can create a cleaned copy before you post.",
    },
    {
      question: "Does Instagram only use metadata?",
      answer:
        "No. Meta says labels can come from industry-shared signals, creator disclosure, and other platform systems.",
    },
  ],
  "facebook-ai-info": [
    {
      question: "Why does Facebook add AI Info to some photos?",
      answer:
        "Facebook can react to embedded credentials, disclosures, or other systems that interpret how the file was produced or edited.",
    },
    {
      question: "Can a cleaned file still be labeled on Facebook?",
      answer:
        "Yes. The tool can remove supported file metadata, but Facebook can still apply its own rules.",
    },
    {
      question: "What should I verify before posting?",
      answer:
        "Check whether embedded C2PA credentials, AI-related XMP, or prompt-style text fields were removed from the cleaned copy.",
    },
  ],
  "photoshop-ai-label": [
    {
      question: "Can Photoshop export Content Credentials into JPG or PNG?",
      answer:
        "Yes. Adobe documents that Content Credentials can be attached directly to a file, stored in the cloud, or omitted on export depending on the workflow.",
    },
    {
      question: "Does this tool remove visible edits from Generative Fill?",
      answer:
        "No. It only works on supported file metadata and does not change visible content.",
    },
    {
      question: "Should I keep the original Photoshop export?",
      answer:
        "Yes. Keep the original source file because the cleaned copy may no longer carry the embedded provenance record.",
    },
  ],
  "why-does-my-photo-say-ai-info": [
    {
      question: "Can software names alone prove a photo is AI generated?",
      answer:
        "No. A software tag like Photoshop alone is not enough to treat a file as AI-generated, which is why the tool only removes confirmed targets.",
    },
    {
      question: "What if no supported metadata is found?",
      answer:
        "The label may come from disclosure requirements, platform-side inference, or unsupported metadata formats.",
    },
    {
      question: "Will removing metadata make a photo look more natural?",
      answer:
        "No. Metadata cleanup does not change skin, lighting, hands, texture, or other visible artifacts.",
    },
  ],
  "c2pa-ai-label": [
    {
      question: "What is lost when embedded Content Credentials are removed?",
      answer:
        "You lose the embedded provenance package and the editing history that can travel with that file copy.",
    },
    {
      question: "Does this tool touch SynthID or invisible pixel watermarks?",
      answer:
        "No. The MVP does not claim to remove pixel-level invisible watermarking systems such as SynthID.",
    },
    {
      question: "Why is C2PA treated differently from general EXIF?",
      answer:
        "C2PA is a provenance system tied to Content Credentials, while EXIF mainly stores camera and image information.",
    },
  ],
  "supported-formats": [
    {
      question: "Which formats can the MVP clean today?",
      answer:
        "JPG and PNG are the primary supported cleanup formats. WebP is beta inspect-only in this build while its complete real-image release gate remains unfinished.",
    },
    {
      question: "Does WebP cleaning ship by default?",
      answer:
        "No. This build keeps WebP inspect-only until the complete real-image and decoded-pixel release gate has passed.",
    },
    {
      question: "What stays preserved by default?",
      answer:
        "The tool aims to preserve camera EXIF, ICC profiles, orientation, and the encoded image payload on supported files.",
    },
  ],
  guides: [
    {
      question: "Why are there only a few launch guides?",
      answer:
        "The launch set is intentionally limited to substantive pages rather than programmatic pages that only swap platform names.",
    },
    {
      question: "Do all guides include the tool?",
      answer:
        "Yes. Launch guides embed the same local tool so the explanation and action stay on one page.",
    },
  ],
};
