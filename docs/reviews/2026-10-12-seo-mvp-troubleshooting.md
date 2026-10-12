# Fast SEO MVP: user decisions and post-cleanup troubleshooting

Base: `origin/main` at `f2922ac3f567ae927733a1250c13dc9ad0af5ef0`.
Branch: `codex/seo-mvp-troubleshooting`.

## Scope delivered

- Homepage: moves the existing intent section directly after the tool, simplifies its decision table, adds working links to the tool/platform guidance/image-content limits, and adds two AI Info/detection FAQs before the unchanged final typo FAQ.
- Instagram: a complete final-export/download/recheck/attach workflow and a table distinguishing Feed, Story, separate Reel cover and unsupported video/platform notices.
- First-time cause guide: scan-status decisions and links to format limits and post-cleanup investigation.
- Supported formats: WebP inspection, genuine HEIC conversion, already-clean interpretation, default preservation and optional privacy cleanup examples.
- New `/ai-label-after-metadata-removal/`: investigates the exact shared copy, second scan, subsequent exports, where the notice is stored and when further metadata cleanup is unhelpful. It includes its own metadata, breadcrumbs, FAQ schema, official sources and links back to first-time guidance.
- The new page is discoverable through Guides and contextual links in the Instagram and first-time cause pages. Sitemap contains 17 content URLs; only edited pages receive the October 12 update date.

The new page's primary task is troubleshooting after cleanup, distinct from explaining an initial AI Info notice. It does not target a generic detection-bypass tool or change Site A/Site B keyword ownership. No processing engine, file support, account, analytics, deployment or existing Title/Description/H1 was changed.

## Verification

- Production build passed: 25 generated static pages, including framework and metadata endpoints.
- Typecheck passed.
- Vitest: all 110 tests passed after updating the sitemap expectations for the new route and content date.
- ESLint passed with the existing `tmp/**` exclusion; unrelated historical temporary scripts were preserved.
- Focused Playwright suite: 4 tests passed across desktop and 375px mobile emulation. It covers ten routes, FAQ interaction, the new breadcrumb/FAQ schema, loaded illustration, horizontal overflow, homepage section order and sample cleanup/download.
- The public sample's downloaded copy retained identical dimensions and decoded pixels.
- Static output audit passed: one H1 and expected canonical on all six modified/new/directory pages; internal destinations and fragment IDs resolve; final typo FAQ unchanged and last.
- AST comparison with the base passed for all 42 existing Title/Description/H1 fields.
- Phone-width first-screen and table screenshots were inspected. These are browser emulation checks, not physical Android/iPhone tests.

GitHub account/resource confirmation: the user explicitly confirmed `hutton1108upup` → `hutton1108upup/RemoveAILabel` → `codex/seo-mvp-troubleshooting` for pushing after local checks. This does not authorize merging or deployment.

Ranking, click improvement and new-page search demand remain unverified. Assess equivalent query/page/country/device segments after an independently authorized production release and sufficient GSC observations.
