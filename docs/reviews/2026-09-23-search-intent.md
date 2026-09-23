# Search intent and mobile content update

Base: `origin/main` at `5394cf99ed5b2da6cfdd59c001bf3e5af573fcd6`.
Working branch: `codex/seo-intent-content`.

## Delivered page scope

- Homepage: shorter subtitle, an AI tag remover FAQ and intent comparison, earlier workflow and report, public C2PA sample attribution, and a clear distinction between the real sample and the illustrative report.
- Instagram/Facebook: before-posting, published-post, profile-notice, and no-metadata decision tables with contextual links to the homepage tool.
- Photoshop: a reproducible export-record checklist and the existing public C2PA sample. No invented current Photoshop version or export result.
- C2PA: provenance is separate from an AI verdict, with a contextual tool link.
- Supported formats: inspect/clean capabilities in one table, including WebP inspection only and unsupported HEIC/video.
- iPhone: choose/check/download/share instructions and an expandable screenshot of this website's verified sample result at 375px viewport width. This is not a physical-iPhone or Safari-menu screenshot.
- Guides: a direct free-tool entry before scenario navigation.
- Sitemap: last-modified dates changed only for the eight pages edited in this update.

Existing titles, descriptions, H1s, canonicals, cleanup behavior, privacy boundaries and routes are preserved. The three general image-tool queries remain owned by the homepage. No duplicate generic keyword URLs, translation pages, Android pages, or unsupported cleanup claims were introduced.

## Evidence and verification

- `npm.cmd run build`: production static build passed (24 generated pages including framework/metadata endpoints).
- `npm.cmd run typecheck`: passed; final build also runs TypeScript validation.
- `npm.cmd run test`: 110 tests passed.
- `npm.cmd run lint -- --ignore-pattern "tmp/**"`: passed. Unfiltered lint encounters a pre-existing ignored file, `tmp/review-five-guides.cjs`, with three require-import errors. That historical file was preserved.
- `npm.cmd run test:e2e -- --workers=2`: 34 passed, 2 intentionally skipped according to existing device-specific test conditions. Desktop and 375px touch/mobile emulation covered routing, FAQ interaction, real file downloads, no-upload behavior and overflow.
- AST comparison against the base: all 42 existing title/description/H1 fields in the main page-content objects and scenario objects unchanged.
- Screenshots and test output are generated under ignored `test-results/`; the selected phone result illustration is included in `public/guides/phone-clean-copy.png`.
- After adding the expandable illustration, the four search-intent browser cases were rerun on the final build, including image loading, expanded-layout overflow, FAQ interaction and sample downloads.

The added browser test downloads the public sample through the actual tool on desktop and mobile emulation and compares decoded RGBA bytes and dimensions with Sharp. The original is a 1024 × 683 JPEG (178709 bytes), SHA-256 `cafc48c53e651f7ba4622d1f72783827074211e42b9634cc863ec3be3c7651b3`. It checks the C2PA-removal status, smaller output file, preserved dimensions and identical decoded pixels. Existing unit tests separately compare the encoded JPEG payload.

Sample source: https://github.com/c2pa-org/public-testfiles/blob/main/legacy/1.4/image/jpeg/adobe-20220124-CA.jpg
Source license: CC BY-SA 4.0, as documented in `tests/fixtures/official/README.md`.
This is a legacy interoperability sample, not a current Photoshop Generative Fill test or a social-platform classification test.

## P2 measurement gate

The provided GSC screenshot covers five queries with 48 combined impressions and zero clicks over the launch-period 28 days. The user identified Asia and mobile as the main segments; exact countries, per-query positions and landing URLs were not provided.

After a separately approved production release:

1. In GSC Search results, select Web, the last 28 days and Mobile; enable clicks, impressions, CTR and average position.
2. For each of `remove ai label`, `ai tag remover`, and `ai label remover`, select the query and inspect Pages and Countries. Keep typo/concatenated queries separate.
3. Record the leading country, displayed URL, impressions, clicks, CTR and position. Export this baseline before comparing changes.
4. Compare equivalent 28-day periods by the same query, page, country and device. Do not interpret low-sample CTR changes as proof of improvement.
5. Consider title/description changes only if relevant rankings and impressions become stable but clicks remain weak. Consider another device or language page only with a distinct demonstrated need.

No GSC data collection, scheduled monitoring, ranking improvement, merge or production deployment is implied by this code delivery.
