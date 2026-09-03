# P1 Content and Trust Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing indexable pages answer real user questions with traceable evidence, clear preserve-versus-remove decisions, natural English, and a privacy policy that matches the current local-only implementation.

**Architecture:** Keep the existing static Next.js App Router pages and shared content renderer. Extend the page content model with optional page-specific headings, evidence links, and editorial sections; render these as Server Components around the existing client-side tool. Preserve current routes, TDH, canonicals, indexability, tool behavior, and legal boundaries.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Vitest, Testing Library, Playwright, static export.

**Spec:** `RemoveAILabel_PRD_v3_Codex.md` sections 0-3, 12-15, and 17; approved P1 review in the current task.

## Global Constraints

- Preserve the PRD's `Original First`, `Remove Only Confirmed Targets`, `Preserve by Default`, `No False Promise`, and `Local by Design` rules.
- Treat official documentation as factual support; use forum and social posts only to identify questions and reported experiences.
- Do not promise that cleaning a file removes an existing platform label or guarantees future platform treatment.
- Do not state that one Photoshop operation always triggers a label; product versions and export paths vary.
- Do not replace or remove current routes, TDH, canonical URLs, tool behavior, or indexability in this P1 pass.
- Keep the unrelated untracked `DungeonQuestReborn_前端设计走查报告_2026-09-03.md` untouched.
- Do not commit, push, deploy, or publish.

---

### Task 1: Lock the approved content contract with failing tests

**Files:**
- Modify: `tests/ui/route-metadata.test.tsx`
- Modify: `tests/ui/home.test.tsx`

**Interfaces:**
- Consumes: existing route components and `PageContent` records.
- Produces: consumer-visible assertions for intent-specific headings, source links, preserve/remove guidance, and privacy wording.

- [ ] Add a route-content test that expects the following visible sections: `Check the Export, Not Just the Tool Name`, `What Instagram AI Info Does—and Does Not—Mean`, `Why Facebook May Show AI Info`, `Where an AI Info Signal Can Come From`, `Before You Remove Content Credentials`, and `Keep or Remove Workflow Metadata?`.
- [ ] Add assertions that official sources are linked from the relevant pages and user discussions are labelled `User discussion`, not presented as official facts.
- [ ] Add assertions that the Photoshop and Instagram FAQs answer existing-post and uncertain-trigger questions without guarantees.
- [ ] Add a privacy-page test expecting definitive local-processing language, current no-op analytics status, and the absence of `should not upload`.
- [ ] Run `npm.cmd test -- tests/ui/route-metadata.test.tsx tests/ui/home.test.tsx` and confirm failures are caused by the missing P1 content.

### Task 2: Add evidence and page-specific section support

**Files:**
- Create: `components/content/SourceList.tsx`
- Create: `components/content/EditorialSection.tsx`
- Modify: `content/pages.ts`
- Modify: `app/shared.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `PageContent.sources`, `PageContent.editorialSections`, and optional section-title overrides.
- Produces: static, crawlable source links and page-specific prose without moving the existing embedded tool.

- [ ] Add `SourceLink` with `label`, `href`, `kind`, and `note` fields.
- [ ] Add `EditorialSection` content with a title, one or more paragraphs, and optional bullets.
- [ ] Add optional `heroDescription`, `canTitle`, `cannotTitle`, `workflowTitle`, `verifyTitle`, and `misunderstandingsTitle` fields to `PageContent`.
- [ ] Render page-specific hero copy, editorial sections, and a `Sources and evidence` block while retaining breadcrumb, H1, Quick Answer, tool, FAQ, and related guides.
- [ ] Style source kinds and editorial sections using existing tokens and responsive layout conventions.
- [ ] Run the targeted tests and confirm the new rendering contract passes before changing page copy.

### Task 3: Rewrite the high-demand platform and Photoshop pages

**Files:**
- Modify: `content/pages.ts`
- Modify: `content/faqs.ts`

**Interfaces:**
- Consumes: official Meta and Adobe sources plus user-question patterns from Adobe Community and Reddit.
- Produces: unique, source-bounded answers for `/photoshop-ai-label`, `/instagram-ai-info`, `/facebook-ai-info`, and `/why-does-my-photo-say-ai-info`.

- [ ] Rewrite Photoshop sections around checking the exported file, minor retouching versus full generation, uncertain trigger behavior, and retaining the original export.
- [ ] Rewrite Instagram sections around what AI Info proves, existing-post limits, per-file checking for multi-image posts, and non-file platform signals.
- [ ] Rewrite Facebook sections around pre-publish file checks, post-level limits, batch brand/product images, and platform-controlled decisions.
- [ ] Rewrite the pillar page around embedded metadata, self-disclosure, and platform classifiers.
- [ ] Replace generic FAQs with real user questions while keeping qualified answers.
- [ ] Run the targeted tests and re-read changed claims against their linked sources.

### Task 4: Make removal trade-offs and privacy behavior explicit

**Files:**
- Modify: `content/pages.ts`
- Modify: `content/faqs.ts`
- Modify: `app/privacy/page.tsx`

**Interfaces:**
- Consumes: current cleanup behavior, no-op analytics adapter, PRD preservation rules, and user reports about reusing or protecting ComfyUI workflow data.
- Produces: clear decision guidance on C2PA/workflow removal and a privacy page that matches current code.

- [ ] Add `Before You Remove Content Credentials` to `/c2pa-ai-label`, distinguishing the embedded credential in the cleaned copy from provenance retained in the original or separately stored elsewhere.
- [ ] Add `Keep or Remove Workflow Metadata?` to `/supported-formats`, covering workflow reuse, client delivery, and sensitive prompt or node data without claiming all workflows contain secrets.
- [ ] Expand the privacy page with local processing, data that is not transmitted, current analytics behavior, browser memory/download behavior, and policy update boundaries.
- [ ] Run targeted tests and verify the privacy claims against `lib/analytics/adapter.ts` and the browser network E2E test.

### Task 5: Humanize, verify, and hand off local review

**Files:**
- Modify only the P1 files above if the integrity pass finds mechanical wording.

**Interfaces:**
- Consumes: the completed P1 pages.
- Produces: a verified static build and persistent local review URLs.

- [ ] Replace repeated abstract phrases with concrete nouns and verbs while preserving terms such as C2PA, Content Credentials, XMP, EXIF, ICC, and SynthID.
- [ ] Check that no user report became a factual platform claim and that no guarantee was introduced.
- [ ] Run `npm.cmd test`, `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`, and `npm.cmd run test:e2e`.
- [ ] Inspect affected routes at desktop and 375px for one H1, visible sources, no overflow, and no console errors.
- [ ] Start a hidden static server on an available localhost port and verify each review URL returns HTTP 200.
