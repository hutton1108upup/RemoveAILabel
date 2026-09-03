# Remove AI Label MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for behavior changes. Do not spawn subagents.

**Goal:** Build a reviewable, static-export Next.js MVP that locally inspects and safely cleans confirmed AI-label metadata from JPG and PNG files while keeping WebP cleaning gated.

**Architecture:** Static server-rendered content pages embed one client tool. A module Web Worker owns magic-byte validation, parsing, cleanup, hashing, post-clean rescanning, and large ZIP work; format modules copy non-target byte ranges and fail closed on ambiguity. UI state is driven only by worker results and never claims a downloadable clean copy before verification succeeds.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4, Lucide, fflate, @contentauth/c2pa-web, Vitest, Playwright.

**Spec:** `RemoveAILabel_PRD_v3_Codex.md`, `RemoveAILabel_前端设计规范_v1_Codex.md`, and root `tokens.css`.

## Global Constraints

- Preserve the three source specifications and visual assets unchanged.
- Use the exact root `tokens.css` variables; PRD v3 controls behavior/copy/SEO, frontend spec v1 controls visuals.
- No Canvas re-encoding, upload API, account, paywall, tracking of file data, or unsupported platform guarantees.
- JPEG/PNG clean only confirmed targets; preserve payload, EXIF/ICC/orientation by default; re-scan output and fail closed.
- WebP remains inspect-only unless the complete fixture gate passes and `NEXT_PUBLIC_ENABLE_WEBP_CLEAN=true`.
- Static export must include every launch route, canonical, robots, sitemap, and visible-FAQ-consistent schema.

## Tasks

### Task 1: Project and test foundation

- [ ] Install pinned runtime and test dependencies.
- [ ] Establish fixture builders and shared strict types.
- [ ] Confirm tests fail before parser implementations exist.

### Task 2: Binary engine and worker

- [ ] Implement bounded magic-byte and JPEG/PNG/WebP container parsing.
- [ ] Implement confirmed-target cleanup, payload hashing, post-clean verification, privacy mode, and safe filename rules.
- [ ] Integrate lazy official C2PA inspection and Worker message contracts.
- [ ] Cover preservation/removal, ambiguity, corruption, partial batches, and download eligibility.

### Task 3: Tool experience and downloads

- [ ] Implement keyboard/paste/drop file entry, constraints, queue/progress, real result cards, Advanced Options, and C2PA reminder.
- [ ] Implement verified single downloads and verified-success-only ZIP downloads.
- [ ] Gate Site B guidance to allowed result/user actions.

### Task 4: Public pages and design system

- [ ] Build the 12-section homepage and all required launch routes.
- [ ] Reuse root design tokens for all colors/type/radii/spacing/statuses and meet 375px/keyboard requirements.
- [ ] Add per-page metadata, canonical, OG/Twitter, Organization/WebApplication/Breadcrumb/FAQ schema, robots, and sitemap.

### Task 5: Verification and local review

- [ ] Run and repair typecheck, lint, unit, Playwright E2E, and static export build.
- [ ] Inspect 375px and desktop UI, console/network privacy, keyboard behavior, and all launch URLs.
- [ ] Run a hidden persistent local static server and record its exact port.
