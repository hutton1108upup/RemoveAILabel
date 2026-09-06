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
      "No. The selected file is processed in your browser by a local Web Worker. This tool does not upload it to an application server.",
  },
  {
    question: "Can this remove AI Info from an existing post?",
    answer:
      "No. The tool only checks a local file and can create a cleaned local copy before you publish or deliver it.",
  },
  {
    question: "Does cleaning metadata guarantee no AI label?",
    answer:
      "No. Cleaning file metadata does not determine the platform result. A platform may use other signals, disclosure rules, or policy systems.",
  },
  {
    question: "Does the tool reduce image quality?",
    answer:
      "On supported JPG and PNG files, the image data is not re-encoded. Other metadata may change depending on the cleanup options you choose.",
  },
  {
    question: "What is C2PA?",
    answer:
      "C2PA is a standard for Content Credentials that can embed provenance and editing information inside a file.",
  },
  {
    question: "Will camera EXIF and copyright be preserved?",
    answer:
      "They are kept by default when they are separate from the fields being removed. Privacy cleanup can remove camera details and some copyright data, and a copyright field inside a removed packet cannot be preserved separately.",
  },
  {
    question: "Can it remove PNG prompts and ComfyUI workflows?",
    answer:
      "Yes, when supported PNG text chunks or XMP packets contain confirmed prompt, workflow, model, or seed fields.",
  },
  {
    question: "Why was no metadata found?",
    answer:
      "The file may already be clean, the metadata may not use a supported format, or a platform may rely on signals outside the file itself.",
  },
  {
    question: "Is the tool free?",
    answer:
      "Yes. It is free to use, requires no account, and does not charge for downloads.",
  },
];

export const pageFaqs: Record<string, FaqItem[]> = {
  "instagram-ai-info": [
    {
      question: "Does Instagram AI Info mean the whole photo was generated?",
      answer:
        "No. The notice can reflect an industry signal or a disclosure that AI was involved. It does not say what percentage of the image was generated rather than photographed.",
    },
    {
      question: "Can this remove AI Info from an Instagram post that is already live?",
      answer:
        "No. The tool can only inspect a local file and create a separate copy before a future upload. It cannot edit, appeal, or relabel an existing Instagram post.",
    },
    {
      question: "Which file should I check in an Instagram carousel?",
      answer:
        "Check each original JPG or PNG separately. The tool reports file-level findings and cannot determine which file or platform-side signal affected the carousel as a whole.",
    },
    {
      question: "What if the scan finds no supported metadata?",
      answer:
        "Confirm that you scanned the same export you planned to upload. If it is already clean, the notice may involve disclosure or another platform-side signal that this local scanner cannot inspect.",
    },
  ],
  "facebook-ai-info": [
    {
      question: "Why can a real photo show AI Info on Facebook?",
      answer:
        "A real photo can still carry a Content Credential or AI-related editing record. Meta also describes disclosure and other platform systems, so one notice does not prove the whole image was generated.",
    },
    {
      question: "Can this remove AI Info from an existing Facebook post?",
      answer:
        "No. It changes only a new local copy. It cannot edit a live post, change an account setting, or submit an appeal to Facebook.",
    },
    {
      question: "Can I check a batch of product or campaign images?",
      answer:
        "Yes. Add the final files together and review each result. One failed or unsupported file does not stop the other checks.",
    },
    {
      question: "Can a cleaned file still receive AI Info on Facebook?",
      answer:
        "Yes. Cleaning removes only supported metadata in that file. Facebook may use disclosure or other systems that the local scanner cannot inspect or control.",
    },
  ],
  "photoshop-ai-label": [
    {
      question: "Which Photoshop tool triggered the AI Info label?",
      answer:
        "The final file does not provide a reliable, version-independent list of which button caused a platform notice. Review the current Photoshop export options and scan the actual JPG or PNG you plan to share.",
    },
    {
      question: "Does undoing Generative Fill remove every AI-related signal?",
      answer:
        "Undoing or deleting an edit does not prove what the final export contains. Photoshop behavior can vary by version and export path, so inspect the exported file instead of relying on the document history alone.",
    },
    {
      question: "Does Content Credentials mean the whole photo was generated?",
      answer:
        "No. Content Credentials can record provenance and editing actions. This scanner does not estimate how much of an image was generated or photographed.",
    },
    {
      question: "Should I keep the original Photoshop export?",
      answer:
        "Yes. Keep the original document and export when provenance or client records matter. A cleaned copy may no longer contain the embedded credential.",
    },
  ],
  "why-does-my-photo-say-ai-info": [
    {
      question: "Can a software name prove that my photo was AI-generated?",
      answer:
        "No. A software tag such as Photoshop does not show that the whole image was generated. The scanner keeps confirmed targets separate from general metadata.",
    },
    {
      question: "Why can AI Info remain when no supported metadata is found?",
      answer:
        "The notice may involve a disclosure, a platform classifier, another non-file signal, or an unsupported metadata format. A local scan covers only the fields listed on this site.",
    },
    {
      question: "Will removing metadata make a photo look more natural?",
      answer:
        "No. Metadata cleanup does not change skin, lighting, hands, texture, or other visible artifacts.",
    },
    {
      question: "Can this tool tell whether a photo is authentic?",
      answer:
        "No. It reports supported file metadata and verifies a cleanup copy. It does not authenticate the event shown, identify every edit, or judge the creator's disclosure.",
    },
  ],
  "c2pa-ai-label": [
    {
      question: "What is lost when embedded Content Credentials are removed?",
      answer:
        "You lose the embedded provenance package and the editing history that can travel with that file copy.",
    },
    {
      question: "Does removing an embedded credential delete a cloud copy?",
      answer:
        "No. Removing a supported embedded package changes only the new local file. A credential stored in Adobe's cloud or another external service is outside this tool's control.",
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
        "JPG and PNG are the supported cleanup formats. WebP can be inspected but not cleaned in this version.",
    },
    {
      question: "Does WebP cleaning ship by default?",
      answer:
        "No. This version can inspect WebP metadata but does not create cleaned WebP files.",
    },
    {
      question: "Should I keep ComfyUI prompt and workflow metadata?",
      answer:
        "Keep the original when you want to reload or share the workflow. Create a separate cleaned copy when supported prompt or node data should not travel with a client or public file.",
    },
    {
      question: "What stays preserved by default?",
      answer:
        "The tool aims to preserve camera EXIF, ICC profiles, orientation, and the encoded image payload on supported files.",
    },
  ],
  guides: [
    {
      question: "Which guide should I start with?",
      answer:
        "Choose the platform where you see the notice, or the editor or device you used for the final photo. Start with Supported Image Formats if you are unsure whether your file can be checked here.",
    },
    {
      question: "Do all guides include the tool?",
      answer:
        "Yes. Each workflow guide includes the same browser-local image tool, followed by guidance for that scenario. An embedded tool does not mean every platform label or file type can be changed.",
    },
  ],
};
