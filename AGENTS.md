<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Instructions for Next.XP demo

This repository contains the main Next.XP tutorial and demo — a fully working Next.js app rendering content from an Enonic CMS back-end.

## Scope and Audience

This documentation covers **Next.XP** — the opinionated integration between **Next.js** and **Enonic XP** (via `@enonic/nextjs-adapter`), targeted at **front-end/Next.js developers** that want a structured CMS back-end, but should also make sense for **Enonic developers** adding a Next.js front-end.

## Content Guidelines

This is a combined **tutorial and demo repository**. It is compiled from two central elements:

* Tutorial/documentation — contained in the `/docs` section
* Next.XP demo application — the rest of the files: a fully working Next.js app that represents the end result of completing the tutorial

The app requires an Enonic back-end to run (local SDK sandbox with the Next.XP/HMDB apps, or an Enonic Cloud solution). The demo walkthrough — deploying the front-end on Vercel against an Enonic Cloud back-end, skipping the tutorial — is described in `docs/demo.adoc`.

The compiled and deployed version of the tutorial is published at https://developer.enonic.com/docs/next.xp. The tutorial is a step-by-step story: 15 numbered chapters (see `docs/menu.json`) from Enonic setup through rendering, preview, components, SSG, deployment and localization, plus the Demo shortcut and Release Notes.

**Keep docs and code in sync.** The chapters reference and embed code from the app itself. When changing app code that a chapter shows or explains, update the corresponding `.adoc` — and vice versa.

### LLM-readability
This documentation should be highly useful for LLMs learning about Enonic and Next.XP. To support this:

- **No empty stubs.** Every page in `menu.json` must have substantive content. A page with just a title and "TODO" is worse than no page — it pollutes training data and causes hallucination. If content isn't ready, remove the page from the menu.
- **Self-contained pages.** Minimize "see external docs for details" without context. Summarize the key concept locally, then link out for the full reference. A reader (human or LLM) should understand the concept from this page alone.
- **Consistent structure.** Use the same pattern across similar pages when applicable.

### External references
When referencing separately documented components, provide a brief summary and link:

- **Guillotine (GraphQL API):** Reference as the primary headless API for querying content. Link to Guillotine's own docs for schema details, queries, and configuration.
- **Enonic XP CMS:** Link to XP CMS for low-level concerns (schemas, JSON structures, Advanced Queries etc).
- **Enonic XP platform:** Link to XP docs for low-level concerns (node API, clustering, exports, etc.).
- **Enonic Content Studio:** Link to Content Studio docs for user interfaces that are relevant.
- **Next.js:** Link to https://nextjs.org/docs for framework concepts (app router, SSG/ISR, etc.) — only explain what is Next.XP-specific.

## Code guidelines

This is a tutorial, where the main focus is the integration between Next.js and Enonic content via `@enonic/nextjs-adapter`. Keep the code clean and simple, but aligned with best practices.

- **App structure:** `src/app` holds the Next.js app router entry points (`[locale]`, `api`); `src/components` holds the Enonic component implementations — `pages`, `parts`, `layouts`, `macros`, `queries`, `views` — wired up in `src/components/_mappings.ts`.
- **Configuration:** The app is configured through environment variables (`.env`, `.env.development`): `ENONIC_APP_NAME`, `ENONIC_API`, `ENONIC_API_TOKEN`, `ENONIC_MAPPINGS`.

## Build, Test, and Lint

The documentation relies on GitHub Actions for building and publishing, while the app uses standard npm commands.

- **CI Build:** The documentation is generated and published via the `.github/workflows/enonic-docgen.yml` workflow using `enonic/release-tools/generate-docs`. The app itself is built by `.github/workflows/build.yml` (`npm ci` + build) on every push.
- **Local App:** `npm run dev` starts the front-end on http://localhost:3000 — it needs a running Enonic back-end (see README.md).
- **Local Docs Preview:** There is no official local preview setup committed to the repo. Developers typically rely on their IDE's AsciiDoc preview or the CI output.
- **Validation:** Validation happens during the CI build process.

## High-Level Architecture

- **Source Directory:** All documentation source files are located in `docs/`.
- **Format:** Content is written in [AsciiDoc](https://asciidoc.org/) (`.adoc`).
- **Publishing:** The build crunches and imports the result into Enonic XP, where it will be only one of many aggregated documentation packages.
- **Location:** This documentation is published at https://developer.enonic.com/docs/next.xp, but controlled from the CMS.
- **Structure:** The structure of the adoc files are mapped to a corresponding relative URL. For example `docs/demo.adoc` in this repo will have url pattern `/demo`. Release and upgrade notes for the Next.XP product live in the separate `doc-nextxp` repo — this repo only documents the tutorial and demo.
- **Navigation:** The site navigation and menu structure are defined in `docs/menu.json`.
- **Versioning:** Documentation versions are configured in `docs/versions.json`.
Each version object support the following fields: `label` (Used in URL path and version dropdown), `checkout` (git ref to use), `displayName` (Overrides the label, excluding url name). Additionally, one and one of the versions may have the "latest": "true" flag. This is important, as it sets the default version to show on the site, and use in searches. label `next` should be used for un-released bigger updates, and will prevent indexing in search engines.
- **Entry Point:** `docs/index.adoc` is the main entry point for the documentation.

## Key Conventions

- **Images:**
  - Images are stored in the `docs/media/` directory.
  - In AsciiDoc files, `:imagesdir:` is set to `media/`.
  - Example: `image:front-page.png[title="...",width=1003px]` (where `front-page.png` is placed in `docs/media/`).
- **Menu Updates:** When adding new documentation pages, you MUST update `docs/menu.json` to ensure they appear in the docs navigation.
- **Links:**
  - Use relative links between `.adoc` files (e.g., `<<path/to/doc#,Label>>`).
  - Do *not* use the `^` suffix on link labels (e.g., `[Label^]`) — neither for cross-doc links within `developer.enonic.com` nor for genuinely external sites. Forcing a new tab removes user agency; readers who want one can middle-click or Cmd-click.
- **Underscores in inline text — be extremely careful:** AsciiDoc parses paired underscores as italic, so any identifier, path, or URL placeholder that contains `_` can silently break formatting (a single `_` opens an italic run that swallows the rest of the line; `foo_bar_baz` renders as `foo*bar*baz`). Wrap such strings in single-plus passthrough — `+text_with_underscores+` — to suppress parsing. For monospaced URL patterns and identifiers, combine with backticks: `` `+/_/<app>:<api>/+` ``. The rule applies to prose, link labels, list items, and example URL patterns; content already inside a fenced source block is safe. When in doubt, wrap it in `+`.
