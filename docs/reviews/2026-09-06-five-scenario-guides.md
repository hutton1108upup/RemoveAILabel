# Five scenario guides: local review

Review date: 2026-09-06. This record captures local verification before GitHub submission. No deployment was performed as part of the review.

## Review links and rendered TDH

Directory: http://127.0.0.1:4173/guides/

### lightroom-ai-label

- Preview: http://127.0.0.1:4173/lightroom-ai-label/
- Title (including inherited brand suffix): Lightroom AI Label: Check Your Export | Remove AI Label
- Description: Seeing AI Info after a Lightroom edit? Check the final JPG for supported AI label metadata, understand export credentials, and keep your original intact.
- H1: Lightroom AI Labels: Check the Final Export
- Canonical: https://removeailabel.app/lightroom-ai-label/
- Robots: index, follow
- Content structure: breadcrumb, route H1, short answer, local tool, review note, scenario sections, capability boundaries, four-step workflow, official sources, four FAQs, four related guides.

### remove-ai-label-iphone

- Preview: http://127.0.0.1:4173/remove-ai-label-iphone/
- Title (including inherited brand suffix): Remove AI Label on iPhone: Photo Guide | Remove AI Label
- Description: Check AI label metadata on iPhone in Safari. Find a full JPG or PNG, handle HEIC limits, and save a verified local copy before posting to social apps.
- H1: How to Remove AI Label Metadata on iPhone
- Canonical: https://removeailabel.app/remove-ai-label-iphone/
- Robots: index, follow
- Content structure: breadcrumb, route H1, short answer, local tool, review note, scenario sections, capability boundaries, four-step workflow, official sources, four FAQs, four related guides.

### threads-ai-info

- Preview: http://127.0.0.1:4173/threads-ai-info/
- Title (including inherited brand suffix): Threads AI Info: Photo Labels Explained | Remove AI Label
- Description: Understand the Threads AI Info label on photos. Check supported file signals before posting and learn what a local cleaner cannot change on a live post.
- H1: Threads AI Info: Check Photos Before Posting
- Canonical: https://removeailabel.app/threads-ai-info/
- Robots: index, follow
- Content structure: breadcrumb, route H1, short answer, local tool, review note, scenario sections, capability boundaries, four-step workflow, official sources, four FAQs, four related guides.

### pinterest-ai-label

- Preview: http://127.0.0.1:4173/pinterest-ai-label/
- Title (including inherited brand suffix): Pinterest Gen AI Label: Check or Appeal | Remove AI Label
- Description: A Pinterest Pin labeled Gen AI? Inspect supported metadata before uploading a photo, or find Pinterest's official appeal path for an existing label.
- H1: Pinterest Gen AI Labels: Check a Photo or Appeal
- Canonical: https://removeailabel.app/pinterest-ai-label/
- Robots: index, follow
- Content structure: breadcrumb, route H1, short answer, local tool, review note, scenario sections, capability boundaries, four-step workflow, official sources, four FAQs, four related guides.

### tiktok-photo-ai-label

- Preview: http://127.0.0.1:4173/tiktok-photo-ai-label/
- Title (including inherited brand suffix): TikTok Photo AI Label: Check Each Image | Remove AI Label
- Description: Check AI label metadata in TikTok Photo Mode images before posting. Review every JPG or PNG and understand the limits for auto labels and video files.
- H1: TikTok Photo AI Labels: Check Every Image
- Canonical: https://removeailabel.app/tiktok-photo-ai-label/
- Robots: index, follow
- Content structure: breadcrumb, route H1, short answer, local tool, review note, scenario sections, capability boundaries, four-step workflow, official sources, four FAQs, four related guides.

## Changes and SEO decisions

- Added only the five approved routes; reused the existing content renderer, tool and design tokens.
- Added all five routes to the guide directory and sitemap, plus contextual links from existing Instagram, Facebook and Photoshop guides.
- Kept the homepage TDH, tool behavior, header/footer navigation and Site A / Site B keyword split intact.
- FAQ and breadcrumb JSON-LD match the rendered content. Each new route has a unique title, description, H1 and self-canonical.
- Sitemap dates use 2026-09-06 for new/updated routes; unchanged routes retain 2026-09-03.
- Sources are linked on each page. No competitor marketing claim, unperformed device test or fabricated export sample is presented as evidence.

## Verification

- Fresh npm.cmd run build: PASS, static exports include all five routes.
- npm.cmd run typecheck: PASS.
- Targeted ESLint on every changed TypeScript/TSX file: PASS.
- UI tests: 22/22 passed across scenario guides, route metadata, homepage and footer.
- Scenario Playwright tests: 12/12 passed (five guides and directory on desktop Chromium and 375px mobile emulation).
- Existing route/static-endpoint and no-image-upload regression checks: 4/4 passed.
- Verified real downloads on all five routes in both viewport configurations using a synthetic PNG fixture; checked filename, PNG signature and removal of the fixture metadata. These are tool tests, not real Lightroom/iPhone export samples.
- Browser checks cover canonical, index/follow, rendered TDH, Open Graph description, FAQ expansion and JSON-LD agreement, breadcrumbs, directory navigation and console/runtime errors.
- Additional 375px/768px screenshot and overflow checks on the five guides and directory: PASS. Screenshot review included every new page mobile hero, desktop Lightroom full page, mobile iPhone body/full page and desktop/tablet directory.
- No runtime or console errors observed on the new routes.
- iPhone guidance is based on Apple documentation; browser QA used Chromium mobile emulation, not a physical iPhone or Safari.

## Local artifacts

- tmp/review-five-guides/tdh-review.json: rendered TDH and heading inventory.
- tmp/review-five-guides/: mobile/tablet viewport screenshots.
- test-results/scenario-guides-*/: full-page desktop/mobile screenshots.
- tmp/legacy-route-checks/: existing-route check output.
- Preview serves this repository's out directory on port 4173 (node PID 35092 when verified).
