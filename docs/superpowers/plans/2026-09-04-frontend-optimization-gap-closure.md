# Frontend Optimization Gap Closure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the remaining P0-1, P1-5, and P2-7 implementation gaps and synchronize the P2-5 heading-alignment decision with the frontend design specification.

**Architecture:** Keep the existing result-card and configured Site B flow. Make the visual-review trigger conditional on a configured Site B URL and render it as a ghost action; continue rendering the existing navy referral card after the result only after the user opens it or downloads a verified copy. Update the written design rule to match the intentionally left-aligned implementation.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS design tokens, Vitest, Testing Library, Playwright, static export.

**Spec:** `RemoveAILabel_前端优化方案_2026-09-03.md` items P0-1, P1-5, P2-5, and P2-7.

## Global Constraints

- PRD v3 remains the source of truth for product behavior, copy, SEO, and compliance.
- `tokens.css` remains the only source of design colors and shared spacing tokens.
- Do not render any Site B entry point when `NEXT_PUBLIC_SITE_B_URL` is absent.
- Do not invent a Site B brand name; the Footer brand link requires an explicit `NEXT_PUBLIC_SITE_B_BRAND` value.
- A configured Site B action must remain less prominent than the primary download action and its referral card must follow the result card.
- Preserve unrelated untracked review documents and do not commit, push, deploy, or publish.

---

### Task 1: Gate and visually demote the Site B result action

**Files:**
- Modify: `tests/ui/tool-states.test.tsx`
- Modify: `components/tool/DownloadActions.tsx`
- Modify: `components/tool/FileResultCard.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `siteBUrl?: string` already passed to `FileResultCard` and `onToggleVisual: () => void` already passed to `DownloadActions`.
- Produces: `showVisualReview?: boolean` on `DownloadActions`; when false the trigger is absent, and when true it is a `.button-ghost` action.

- [ ] **Step 1: Write the failing behavior assertions**

  Extend the existing Site B tests so an unconfigured result has no `Still seeing visible artifacts?` button, while a configured result exposes that control with `button-ghost` and without `button-secondary`.

- [ ] **Step 2: Run the focused test and verify RED**

  Run: `npm.cmd test -- tests/ui/tool-states.test.tsx`

  Expected: FAIL because the unconfigured trigger is currently visible and the configured trigger uses `button-secondary`.

- [ ] **Step 3: Implement the minimal conditional ghost action**

  Add `showVisualReview?: boolean` to `DownloadActions`, render the trigger only when true, pass `Boolean(siteBUrl)` from `FileResultCard`, and style `.button-ghost` with transparent border/background and accent text using existing tokens.

- [ ] **Step 4: Run the focused test and verify GREEN**

  Run: `npm.cmd test -- tests/ui/tool-states.test.tsx`

  Expected: PASS with the configured and unconfigured Site B flows both covered.

### Task 2: Require an explicit Site B brand in the Footer

**Files:**
- Modify: `tests/ui/footer.test.tsx`
- Modify: `components/layout/Footer.tsx`
- Modify: `app/page.tsx`
- Modify: `content/pages.ts`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_SITE_B_URL` and `NEXT_PUBLIC_SITE_B_BRAND` build-time environment variables.
- Produces: a conditional Footer companion column whose anchor text is the configured brand name; the column is absent unless both values are non-empty.

- [ ] **Step 1: Write the failing behavior assertions**

  Add tests proving that a URL without a brand still hides the companion column and that URL plus brand renders the configured brand as an external link.

- [ ] **Step 2: Run the focused test and verify RED**

  Run: `npm.cmd test -- tests/ui/footer.test.tsx`

  Expected: FAIL because the Footer currently renders a generic action label whenever only the URL exists.

- [ ] **Step 3: Implement explicit Footer brand configuration**

  Read and trim both environment values inside `Footer`, render only when both are present, remove the generic Footer label prop and its home-content field, and keep the external-link safety attributes.

- [ ] **Step 4: Run the focused test and verify GREEN**

  Run: `npm.cmd test -- tests/ui/footer.test.tsx`

  Expected: PASS for absent, partial, and complete configuration states.

### Task 3: Tighten the content-page breadcrumb offset

**Files:**
- Modify: `tests/e2e/tool-flow.spec.ts`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: the existing `.main-shell`, `.route-stack`, and `.breadcrumbs` layout.
- Produces: a desktop and mobile Header-to-breadcrumb visual gap no greater than 72 pixels without changing homepage Hero spacing.

- [ ] **Step 1: Write the failing browser assertion**

  On `/instagram-ai-info/`, measure the rendered bottom edge of `.site-header` and top edge of `.breadcrumbs` in both Playwright projects; require a gap from 40 through 72 pixels.

- [ ] **Step 2: Run the focused Playwright test and verify RED**

  Run: `npx.cmd playwright test tests/e2e/tool-flow.spec.ts --grep "content route keeps the breadcrumb close to the header"`

  Expected: FAIL because `.main-shell` and `.route-stack` currently combine to more than 100 pixels above the breadcrumb.

- [ ] **Step 3: Override only content-route top padding**

  Set `.route-stack` top padding to 24 pixels on desktop and 16 pixels below 768px, leaving its bottom padding and the homepage Hero unchanged.

- [ ] **Step 4: Run the focused Playwright test and verify GREEN**

  Run the same Playwright command and expect both desktop and mobile projects to pass.

### Task 4: Synchronize the H2 alignment rule

**Files:**
- Modify: `RemoveAILabel_前端设计规范_v1_Codex.md`

**Interfaces:**
- Consumes: the P2-5 decision that the tool-oriented left alignment is preferable.
- Produces: an explicit global rule that section title blocks are left aligned, while the hero and final CTA retain their intentionally centered layouts.

- [ ] **Step 1: Update the global-layout wording**

  Replace the conflicting centered-H2 rule with the approved left-aligned rule and name the hero/final-CTA exceptions.

- [ ] **Step 2: Re-read the affected design section**

  Confirm the heading rule no longer contradicts the current implementation or P2-5.

### Task 5: Verify and prepare local review

**Files:**
- No production file changes expected.

**Interfaces:**
- Consumes: the completed gap fixes and all launch routes.
- Produces: fresh test/build evidence, visual desktop/mobile evidence, and a persistent local static server.

- [ ] **Step 1: Run automated checks**

  Run `npm.cmd test`, `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build`.

- [ ] **Step 2: Run browser verification**

  Run the Playwright suite against the built static export and inspect `/` plus a representative content route at desktop and 375px for overflow, console errors, responsive verification rows, the compact completed queue, and Site B absence without configuration.

- [ ] **Step 3: Start the persistent review server**

  Serve `out` on an available localhost port, verify every launch route returns HTTP 200, and hand off complete clickable URLs.
