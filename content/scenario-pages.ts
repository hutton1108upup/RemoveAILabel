import type { GuideCard, PageContent, SourceLink } from "./pages";

export const scenarioReviewDate = "2026-09-06";

const metaSource: SourceLink = {
  label: "Meta: AI Info on Instagram, Facebook and Threads",
  href: "https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/",
  kind: "Official source",
  note: "Describes industry signals, creator disclosure, and the distinction between AI-generated and AI-edited content.",
};

export const scenarioGuideCards: GuideCard[] = [
  {
    title: "Lightroom AI Labels",
    description: "Separate AI edits from export credentials and check the final photo.",
    href: "/lightroom-ai-label/",
  },
  {
    title: "Remove AI Label on iPhone",
    description: "Find a supported photo, check it in Safari, and save a separate copy.",
    href: "/remove-ai-label-iphone/",
  },
  {
    title: "Threads AI Info",
    description: "Understand the notice and check each photo before a Threads post.",
    href: "/threads-ai-info/",
  },
  {
    title: "Pinterest Gen AI Labels",
    description: "Check a Pin image before upload or find the official appeal route.",
    href: "/pinterest-ai-label/",
  },
  {
    title: "TikTok Photo AI Labels",
    description: "Review every still in a Photo Mode post, separately from video.",
    href: "/tiktok-photo-ai-label/",
  },
];

const instagramGuide: GuideCard = {
  title: "Instagram AI Info",
  description: "Understand file signals and the limits of a local check before posting.",
  href: "/instagram-ai-info/",
};
const formatsGuide: GuideCard = {
  title: "Supported Image Formats",
  description: "JPG and PNG cleanup, WebP inspection, and formats this tool cannot process.",
  href: "/supported-formats/",
};
const c2paGuide: GuideCard = {
  title: "C2PA and AI Labels",
  description: "What a Content Credential can tell you about an image and its edits.",
  href: "/c2pa-ai-label/",
};
const realPhotoGuide: GuideCard = {
  title: "Why Does My Photo Say AI Info?",
  description: "Why a camera-made photo may still carry an AI-related editing record.",
  href: "/why-does-my-photo-say-ai-info/",
};

export const scenarioPages: Record<string, PageContent> = {
  "lightroom-ai-label": {
    slug: "lightroom-ai-label",
    path: "/lightroom-ai-label",
    title: "Lightroom AI Label: Check Your Export",
    description:
      "Seeing AI Info after a Lightroom edit? Check the final JPG for supported AI label metadata, understand export credentials, and keep your original intact.",
    h1: "Lightroom AI Labels: Check the Final Export",
    heroDescription:
      "A real photo, an AI-assisted edit, and an exported JPG are different parts of the workflow. Start with the file you actually plan to share.",
    quickAnswer:
      "A Lightroom AI Denoise edit alone does not tell you whether a social app will add an AI label. Review the export's Content Credentials settings, then inspect the final JPG or PNG. This tool can clean confirmed file-level targets; it cannot predict a platform's decision.",
    evidenceLabel:
      "Reviewed September 6, 2026\nSources: Adobe export documentation and Meta labeling policy\nCheck your own export: fields vary with settings and editing history.",
    editorialSections: [
      {
        title: "Denoise, Generative Remove and Content Credentials",
        paragraphs: [
          "Denoise is not the same editing operation as generating replacement content. An AI feature name in Lightroom is also not a report of what is inside a downloaded file. Avoid treating every use of an AI-assisted tool as proof that the entire photo was generated.",
          "Adobe's Content Credentials can describe authorship and editing activity. Their presence is worth inspecting, but does not by itself tell you how much of the picture was created with AI. Meta's AI Info notice is a separate platform result.",
        ],
        bullets: [
          "Editing history: note which tools you used, including any Photoshop round trip.",
          "Export settings: review whether credentials are attached to the file or published to the cloud.",
          "Final file: scan the social export, rather than a RAW master or an earlier proof.",
        ],
      },
      {
        title: "Review the Export Settings in Your Lightroom App",
        paragraphs: [
          "In Lightroom Classic, Adobe documents File > Export > Content Credentials. In Lightroom on desktop, the export's Custom Settings include Apply Content Credentials. The controls are not identical across Lightroom apps, so use the source for the app you have.",
          "Adobe distinguishes attaching credentials to a file from publishing them to its Content Credentials cloud. Removing a supported embedded record from a local copy does not delete a separately published cloud record.",
          "Keep your archive export with the attribution and history you need. For a social copy, choose a JPG or PNG and finish all edits before checking it here. This tool does not read a Lightroom catalog, RAW file, or cloud credential history.",
        ],
      },
    ],
    canTitle: "What We Can Check in Your Export",
    canCheck: [
      "Supported embedded C2PA and confirmed AI-related XMP in the selected JPG or PNG",
      "Supported targets remaining in a cleaned copy after local verification",
      "Camera and color metadata that the default cleanup can preserve when stored separately",
    ],
    cannotTitle: "What Stays Outside the File Check",
    cannotChange: [
      "Lightroom edits, catalogs, RAW originals, or cloud-published credentials",
      "The label on an existing Instagram, Facebook or Threads post",
      "Pixel watermarks or any disclosure the content requires",
    ],
    workflowTitle: "Prepare a Lightroom Photo for Social Sharing",
    workflow: [
      "Keep the RAW or working master. Finish your Lightroom edits and any external-editor round trip.",
      "Export a separate JPG or PNG. Review the Content Credentials settings for the app you use.",
      "Add that export to the tool above. Read the per-file findings before downloading a verified copy.",
      "Open the downloaded copy, check color and orientation, and select that exact file for your post.",
    ],
    verifyTitle: "When a Lightroom Export Still Needs Attention",
    verifySteps: [
      "Already clean means no supported target was found in that file. It does not prove that a social platform will leave it unlabeled.",
      "If you edit or export again after cleanup, inspect the new output. It is a different file from the one that passed verification.",
      "If credentials matter for attribution or client delivery, retain the original alongside the social copy.",
    ],
    sources: [
      {
        label: "Adobe: Content Credentials in Lightroom Classic",
        href: "https://helpx.adobe.com/lightroom-classic/desktop/content-authenticity/content-credentials.html",
        kind: "Official source",
        note: "Documents the Classic export panel and file-versus-cloud storage choices. Updated August 25, 2026.",
      },
      {
        label: "Adobe: Content Credentials in Lightroom",
        href: "https://helpx.adobe.com/lightroom/desktop/edit-photos/content-credentials-lightroom.html",
        kind: "Official source",
        note: "Documents Apply Content Credentials and export preferences in Lightroom on desktop. Updated August 25, 2026.",
      },
      metaSource,
    ],
    faqs: [
      {
        question: "Does Lightroom AI Denoise always cause an AI label?",
        answer: "Do not assume that it does. The edit, export settings, embedded records, and destination platform all matter. Inspect the actual export instead of using the name of an editing tool as a verdict.",
      },
      {
        question: "Can I upload a RAW or DNG file here?",
        answer: "No. Keep that file as your master and export a JPG or PNG for this workflow. WebP can be inspected but not cleaned; RAW and DNG are unsupported.",
      },
      {
        question: "Does cleanup delete my Lightroom Content Credentials from the cloud?",
        answer: "No. The tool only works on the local file you select. A credential published separately to Adobe's cloud is outside its reach.",
      },
      {
        question: "Will my camera EXIF and copyright survive?",
        answer: "The default cleanup preserves them when they are separate from removed targets. A field inside a removed packet cannot always be preserved separately. Review the report and keep your original.",
      },
    ],
    relatedGuides: [
      { title: "Photoshop Generative Fill", description: "Check the export when your Lightroom workflow also includes Photoshop.", href: "/photoshop-ai-label/" },
      instagramGuide, c2paGuide, formatsGuide,
    ],
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/guides/", label: "Guides" },
      { href: "/lightroom-ai-label/", label: "Lightroom AI Labels" },
    ],
    indexable: true,
  },
  "remove-ai-label-iphone": {
    slug: "remove-ai-label-iphone",
    path: "/remove-ai-label-iphone",
    title: "Remove AI Label on iPhone: Photo Guide",
    description:
      "Check AI label metadata on iPhone in Safari. Find a full JPG or PNG, handle HEIC limits, and save a verified local copy before posting to social apps.",
    h1: "How to Remove AI Label Metadata on iPhone",
    heroDescription:
      "Use Safari to check a photo before sharing it. Keep the original in Photos and work with a separate, fully downloaded JPG or PNG.",
    quickAnswer:
      "You can check and clean supported AI label metadata on iPhone without installing an app. Select a full JPG or PNG in the tool above and download the verified copy. HEIC and Live Photo video components are not supported, and this does not change a label on a published post.",
    evidenceLabel:
      "Reviewed September 6, 2026\nSources: Apple photo-download guidance and Meta labeling policy\nFile selection and download menus depend on your iOS version.",
    editorialSections: [
      {
        title: "Start with a Complete Photo, Not an iCloud Placeholder",
        paragraphs: [
          "A thumbnail in Photos is not enough to inspect the original file. Let the photo finish downloading before you select it. Choosing a locally saved file from Files makes it easier to identify the exact copy you are checking.",
          "Apple documents Export Unmodified Originals for saving an archive copy to Files. That preserves the captured or imported format, so it may still be HEIC and it will not include your later edits. Keep it as your original, rather than mistaking it for your final edited export.",
        ],
      },
      {
        title: "If Your iPhone Photo Is HEIC",
        paragraphs: [
          "This tool cannot clean HEIC. For a photo in iCloud, Apple's iCloud.com download options include Most Compatible, which provides JPEG for photos. You can also use an editor's JPEG or PNG export. Inspect the resulting file here before sharing it.",
          "Changing .heic to .jpg in a filename does not convert the image. A genuine conversion may also change metadata or image encoding, so check the exported picture's appearance. The local JPG/PNG cleanup itself does not re-encode image data.",
        ],
      },
      {
        title: "Keep the Downloaded Copy Separate in Files",
        paragraphs: [
          "After downloading, use Safari's downloads list or your configured download folder in Files to open the result. Its filename ends in -clean. Check the picture, then use the share sheet to save or share it if that option is available on your device.",
          "If you save it back to Photos, the original and cleaned copy may look identical. Select the new copy deliberately. A subsequent edit or export creates another file, so check again after that step. The tool does not alter the photo already stored in your library.",
        ],
      },
    ],
    canTitle: "What Works in This iPhone Workflow",
    canCheck: [
      "Confirmed AI-related metadata in full JPG and PNG files",
      "A separate verified copy, processed locally in your browser",
      "Up to 10 files and 100 MB per mobile batch; each file must be 25 MB or smaller",
    ],
    cannotTitle: "What Needs Another Workflow",
    cannotChange: [
      "HEIC, RAW, Live Photo video components, or other video files",
      "Your Photos library, editor history, or a social app's existing label",
      "Visible edits or pixel-level watermarks; WebP cleanup is not enabled",
    ],
    workflowTitle: "Check and Save a Photo in Safari",
    workflow: [
      "Keep the original and finish editing. Save a complete JPG or PNG that shows the version you want to post.",
      "Open this page in Safari. Choose image files and select the local export from the picker.",
      "Wait for the per-file result. Download only when a verified cleaned copy is ready.",
      "Open the -clean file in your downloads, confirm it looks right, and select that copy for sharing.",
    ],
    verifyTitle: "If the Photo Will Not Open or Download",
    verifySteps: [
      "Unsupported format: obtain a genuine JPG or PNG; renaming an extension is not enough.",
      "Unreadable file: download the full photo, check that it opens in Files, and select it again.",
      "Large batch: try fewer files and keep Safari open while they process. Originals are not overwritten.",
    ],
    sources: [
      {
        label: "Apple: Download iCloud photos and videos",
        href: "https://support.apple.com/en-ie/111762",
        kind: "Official source",
        note: "Explains original downloads to Files and the Most Compatible JPEG option on iCloud.com.",
      },
      metaSource,
    ],
    faqs: [
      {
        question: "Do I need an iPhone app or account?",
        answer: "No. The tool runs in your browser without an account. Your selected images are processed locally, rather than uploaded to our application server.",
      },
      {
        question: "Can this remove AI Info from an Instagram or Facebook post on my iPhone?",
        answer: "It cannot change an existing post. It can only create a separate local copy before a future upload. The platform still controls its labeling decision.",
      },
      {
        question: "Can I use a photo edited with Apple Clean Up?",
        answer: "You can inspect a supported JPG or PNG export. This tool does not undo the edit or change the record in your Photos library. A file scan also cannot tell you how a social app will label it.",
      },
      {
        question: "Why can I still see the original photo after cleanup?",
        answer: "The original is deliberately left alone. Look for the separately downloaded filename ending in -clean, check that copy, and keep both files if you need an archive.",
      },
    ],
    relatedGuides: [formatsGuide, instagramGuide, scenarioGuideCards[4], realPhotoGuide],
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/guides/", label: "Guides" },
      { href: "/remove-ai-label-iphone/", label: "iPhone AI Labels" },
    ],
    indexable: true,
  },
  "threads-ai-info": {
    slug: "threads-ai-info",
    path: "/threads-ai-info",
    title: "Threads AI Info: Photo Labels Explained",
    description:
      "Understand the Threads AI Info label on photos. Check supported file signals before posting and learn what a local cleaner cannot change on a live post.",
    h1: "Threads AI Info: Check Photos Before Posting",
    heroDescription:
      "If a Threads photo carries an AI Info notice, start with its source file. Check the images you plan to attach without uploading them to this service.",
    quickAnswer:
      "Threads is covered by Meta's AI-labeling approach, which uses industry signals and creator disclosure. A local scan can inspect supported records inside a photo. It cannot tell you every reason for a Threads label or change a post that is already live.",
    evidenceLabel:
      "Reviewed September 6, 2026\nSource: Meta's labeling policy includes Threads\nThis guide concerns your attached photos, not text posts or account settings.",
    editorialSections: [
      {
        title: "What AI Info Means on a Threads Photo",
        paragraphs: [
          "Meta uses AI Info to give context about generated or AI-edited media. It is not an image authenticity score. A camera-made photo that was later edited can still carry an embedded provenance record.",
          "Meta describes different treatment for content it identifies as generated and content it identifies as only edited with AI. Its guidance includes Threads, Facebook and Instagram, but a local file check does not reproduce the interface or decision in any of those apps.",
        ],
      },
      {
        title: "Check the Attachment, Not the Text or Preview",
        paragraphs: [
          "For a post with several photos, inspect each final JPG or PNG you plan to attach. One clean file does not establish the state of the others. Keep track of the downloaded copies so you do not accidentally choose the earlier exports.",
          "A reply with your own photo is another upload to review. A repost, quoted post, or link-preview image may refer to media you did not upload yourself. This tool cannot reach into that post or change the remote image on the source website.",
        ],
      },
      {
        title: "When the Threads Post Is Already Published",
        paragraphs: [
          "Keep the original post and source photo while you investigate. Record the wording of the notice and review the help or reporting options available in Threads. This website cannot submit a report or remove the label for you.",
          "If you choose to publish a new version, inspect the final local export first. Reposting can lose the original conversation, and a cleaned file is not a guarantee of a different label. Avoid deleting an active post on that assumption.",
        ],
      },
    ],
    canTitle: "What We Can Check Before a Threads Upload",
    canCheck: [
      "Supported embedded C2PA and AI-related XMP in each selected image",
      "Supported prompt or workflow fields in a PNG attachment",
      "Whether confirmed targets remain after cleaning a separate local copy",
    ],
    cannotTitle: "What Threads or the Original Publisher Controls",
    cannotChange: [
      "A live post's label, replies, reposts or link-preview media",
      "Creator disclosure, account settings, or platform-side review",
      "A video attachment or signals embedded in the image pixels",
    ],
    workflowTitle: "Prepare Photos for a Threads Post or Reply",
    workflow: [
      "Collect the final photos you own or have permission to process, and keep their originals.",
      "Inspect every JPG or PNG attachment in the tool above, including images in a multi-photo post.",
      "Review each result and download the verified copies you need. Do not treat Already clean as a platform verdict.",
      "Choose those exact files in Threads, keep any required disclosure, and review the post before publishing.",
    ],
    sources: [metaSource],
    faqs: [
      {
        question: "Can a real photo receive an AI Info label on Threads?",
        answer: "A real photo can contain a record of AI-assisted editing. The label alone does not tell you which edits were made or how much of the photo was generated. Start with the source file and the platform's explanation.",
      },
      {
        question: "Can this remove an AI label from an existing Threads post?",
        answer: "No. It works on a local copy of an image, not the post stored by Threads. Use the app's available help options to investigate an existing notice.",
      },
      {
        question: "Should I check every image in a Threads post?",
        answer: "Yes, if you want a file-level report for every attachment. Each photo can come from a different editor or export. One file's result does not cover the rest of the post.",
      },
      {
        question: "Will a clean Instagram export get the same result on Threads?",
        answer: "Do not assume it will. Check the actual file you are reusing, and remember that the local result does not include either app's disclosure, post history, or other platform-side information.",
      },
    ],
    relatedGuides: [
      instagramGuide,
      { title: "Facebook AI Info", description: "Understand a Facebook notice and check the file before your next upload.", href: "/facebook-ai-info/" },
      scenarioGuideCards[1], c2paGuide,
    ],
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/guides/", label: "Guides" },
      { href: "/threads-ai-info/", label: "Threads AI Info" },
    ],
    indexable: true,
  },
  "pinterest-ai-label": {
    slug: "pinterest-ai-label",
    path: "/pinterest-ai-label",
    title: "Pinterest Gen AI Label: Check or Appeal",
    description:
      "A Pinterest Pin labeled Gen AI? Inspect supported metadata before uploading a photo, or find Pinterest's official appeal path for an existing label.",
    h1: "Pinterest Gen AI Labels: Check a Photo or Appeal",
    heroDescription:
      "A future upload and a Pin that is already labeled need different next steps. Check your local image here, or use Pinterest's support route for an appeal.",
    quickAnswer:
      "Pinterest says it adds a Gen AI label when its system detects AI generation or modification through a Pin's metadata. You can inspect supported file records before upload. If your existing Pin is mislabeled, Pinterest directs you to its support team to appeal; this tool cannot change that Pin.",
    evidenceLabel:
      "Reviewed September 6, 2026\nSource: Pinterest's Gen AI labels help page\nA file report is not an appeal decision or a prediction of Pin distribution.",
    editorialSections: [
      {
        title: "Before Upload: Check Your Finished Pin Image",
        paragraphs: [
          "Finish the Pin's crop, text overlay, resizing, and other edits first. Then inspect the JPG or PNG you intend to upload. A report on the original photo does not cover a later design export.",
          "A file can carry an editing record even when the underlying photo came from a camera. Look at the findings before deciding whether you need a separate cleaned copy. Keep the master and any attribution or provenance required for your work.",
        ],
      },
      {
        title: "Already Labeled: Use Pinterest's Appeal Route",
        paragraphs: [
          "Pinterest's Gen AI labels help page links to its support team for label appeals. Open that official source below when you need Pinterest to review a Pin you published.",
          "For your own records, keep the Pin URL, original photo, final export, and a brief description of the edits. These can help explain the issue; they are not a promise of what Pinterest will request or accept. You do not need to delete the Pin merely to inspect a local file.",
        ],
      },
      {
        title: "A Saved Pin or Website Image Is a Different File",
        paragraphs: [
          "Saving someone else's Pin does not give this tool access to its source image or the ability to relabel it. Only process files you own or have permission to edit.",
          "If your publishing workflow takes an image from a website or scheduler, confirm which asset it uses. Cleaning a local copy leaves the website's image untouched. Likewise, a camera original, a designed Pin, and a downloaded platform copy are not interchangeable evidence.",
        ],
      },
    ],
    canTitle: "What the Pin File Check Covers",
    canCheck: [
      "Supported C2PA, confirmed AI-related XMP, and supported PNG text records",
      "A separate locally cleaned JPG or PNG and its verification result",
      "Each final image individually when preparing several Pins",
    ],
    cannotTitle: "What Requires Pinterest or Another Tool",
    cannotChange: [
      "A Gen AI label on an existing or saved Pin",
      "An appeal decision, recommendation setting, ranking or reach",
      "Remote website images, videos, or pixel-level watermarks",
    ],
    workflowTitle: "Prepare a Photo Before Creating a Pin",
    workflow: [
      "Keep the original and finish the Pin design, including any overlays or resizing.",
      "Select the final JPG or PNG in the tool above. Check its findings before choosing a copy.",
      "Download a verified result when appropriate and open it to review text, crop, color and orientation.",
      "Use that exact output for your Pin workflow. Keep any disclosure needed for the content itself.",
    ],
    sources: [
      {
        label: "Pinterest: Gen AI labels and appeals",
        href: "https://help.pinterest.com/en/article/gen-ai-labels",
        kind: "Official source",
        note: "Explains the Gen AI label and links to the support team for an appeal on your own Pin.",
      },
    ],
    faqs: [
      {
        question: "How do I remove a Pinterest AI label from an existing Pin?",
        answer: "This local tool cannot remove it. For a label you believe is incorrect, follow the support link on Pinterest's Gen AI labels help page to request a review.",
      },
      {
        question: "Is Pinterest's Gen AI label the same as Instagram AI Info?",
        answer: "They are different platforms' notices. Use Pinterest's own explanation and appeal process for a Pin, rather than assuming an Instagram setting or help flow applies.",
      },
      {
        question: "Can cleanup improve the reach of my Pins?",
        answer: "There is no reach guarantee. The report describes supported file metadata, not Pinterest's recommendation or ranking decisions. Do not infer a traffic outcome from a clean result.",
      },
      {
        question: "Why did cleaning my local photo not change a saved Pin?",
        answer: "Your local file and the image already stored by Pinterest are separate. This tool does not contact Pinterest, replace a Pin's media, or submit an appeal.",
      },
    ],
    relatedGuides: [realPhotoGuide, scenarioGuideCards[0], c2paGuide, formatsGuide],
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/guides/", label: "Guides" },
      { href: "/pinterest-ai-label/", label: "Pinterest Gen AI Labels" },
    ],
    indexable: true,
  },
  "tiktok-photo-ai-label": {
    slug: "tiktok-photo-ai-label",
    path: "/tiktok-photo-ai-label",
    title: "TikTok Photo AI Label: Check Each Image",
    description:
      "Check AI label metadata in TikTok Photo Mode images before posting. Review every JPG or PNG and understand the limits for auto labels and video files.",
    h1: "TikTok Photo AI Labels: Check Every Image",
    heroDescription:
      "Preparing a photo post or slideshow? Check each still image you plan to select. This guide and tool handle photos, not the video file of a TikTok clip.",
    quickAnswer:
      "For a TikTok photo post, inspect each final JPG or PNG before uploading. TikTok says attached Content Credentials can contribute to automatic AI labeling, and an auto label cannot be removed from a published post. Local cleanup only addresses supported file records, not disclosure or platform detection.",
    evidenceLabel:
      "Reviewed September 6, 2026\nSource: TikTok's AI-generated content guidance\nScope: still-image inputs; MP4, MOV and other video files are unsupported.",
    editorialSections: [
      {
        title: "Photo Mode, a Video Slideshow and a Cover Are Different",
        paragraphs: [
          "When you select still photos for a photo post, each selected image is a file you can inspect. If an editor turns those images into an MP4 slideshow, you now have a video. This image tool cannot clean or verify that MP4, even if it looks like the same sequence of photos.",
          "A separately exported cover image is only a cover. Checking its JPG does not inspect the video behind it, and choosing an automatically extracted video frame does not give this tool access to the video container.",
        ],
        bullets: [
          "Photo post: check every selected JPG or PNG.",
          "Slideshow exported as MP4: outside this tool's supported formats.",
          "Separate cover JPG: a file-level check of that image only.",
        ],
      },
      {
        title: "Automatic Labels and Creator Disclosure",
        paragraphs: [
          "TikTok's guidance describes both creator labeling and automatic labels. It names AI effects and uploaded content with attached Content Credentials as possible automatic-label paths. It also asks creators to label realistic AI-generated content.",
          "A cleaner cannot replace that disclosure. Use the file report to understand what you are uploading, not to decide that generated or significantly edited content no longer needs context. This tool does not inspect TikTok's account, effect, or post information.",
        ],
      },
      {
        title: "If the Photo Post Already Has an Auto Label",
        paragraphs: [
          "TikTok says an automatic AI-generated label cannot be removed from a published post. A cleaned download here does not rewrite the media stored by TikTok.",
          "Keep your source files while you review the situation. If you later create a new post, prepare its final photos and check them before upload. A new upload can still be labeled; deleting the existing post is not a guaranteed fix.",
        ],
      },
    ],
    canTitle: "What We Can Inspect in a Photo Set",
    canCheck: [
      "Supported C2PA and confirmed AI-related metadata in each JPG or PNG",
      "Separate outcomes for ready, already clean, unsupported, or failed files",
      "Verified copies for successful files; mobile batches allow 10 files and 100 MB total",
    ],
    cannotTitle: "What This Photo Tool Cannot Handle",
    cannotChange: [
      "MP4 or MOV slideshows, video tracks, audio, or video-container credentials",
      "An automatic label already attached to a TikTok post",
      "Creator disclosure, AI-effect records, or pixel-level signals",
    ],
    workflowTitle: "Check a TikTok Photo Set Before Posting",
    workflow: [
      "Finish all edits and collect the still-image exports for the photo post. Keep the originals.",
      "Add every final JPG or PNG, not just the first slide. Each file must be 25 MB or smaller.",
      "Review each result. Download verified copies and keep track of any file that needs a different workflow.",
      "Select the reviewed images for your photo post, confirm their order, and follow TikTok's disclosure guidance.",
    ],
    verifyTitle: "Check the Whole Set, Not Just the ZIP",
    verifySteps: [
      "A download bundle includes verified successes, not every input. Match its files against the set you intended to post.",
      "An already-clean image remains unchanged. A failed or unsupported image is not silently cleaned by the success of its neighbors.",
      "If you turn the set into a video afterward, the photo reports no longer describe that new video file.",
    ],
    sources: [
      {
        label: "TikTok: AI-generated content and automatic labels",
        href: "https://support.tiktok.com/en/using-tiktok/creating-videos/ai-generated-content",
        kind: "Official source",
        note: "Explains creator disclosure, attached Content Credentials, and why an automatic label cannot be removed after posting.",
      },
    ],
    faqs: [
      {
        question: "Can I remove an AI label from a TikTok photo post?",
        answer: "You can inspect supported metadata in the photos before uploading. This tool cannot change a published post, and TikTok says an automatic AI-generated label cannot be removed from that post.",
      },
      {
        question: "Should I check every Photo Mode image?",
        answer: "Yes. Different images can carry different records. Review the outcome for each selected file, rather than treating a report for the first image as a report for the whole set.",
      },
      {
        question: "Can I upload a CapCut slideshow or MP4 here?",
        answer: "No. An MP4 slideshow is a video even if it was assembled from photos. This tool supports JPG and PNG cleanup, with WebP inspection only. It cannot inspect or clean a video container.",
      },
      {
        question: "Does a clean report mean I can turn off AI disclosure?",
        answer: "No. The report only concerns supported fields in your local file. Whether disclosure is needed depends on the content and TikTok's rules, not on whether those fields remain.",
      },
    ],
    relatedGuides: [scenarioGuideCards[1], formatsGuide, c2paGuide, instagramGuide],
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/guides/", label: "Guides" },
      { href: "/tiktok-photo-ai-label/", label: "TikTok Photo AI Labels" },
    ],
    indexable: true,
  },
};
