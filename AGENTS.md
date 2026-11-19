<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent instructions for the Next.js tutorial

This repository contains the **Next.js tutorial** for Enonic (Next.XP): a fully working Next.js app in `src/` that represents
the end result of the tutorial and doubles as the demo app, and the tutorial text in `docs/`, written in AsciiDoc and
published to https://developer.enonic.com/learn/nextjs.

Shared conventions for Enonic documentation (language and tone, navigation, tutorials, publishing, and AsciiDoc) are in the
`enonic-docs` skill from the `enonic-contrib` plugin of https://github.com/enonic/agent-toolkit. Install it and follow it for
every change under `docs/`. The rules below are the ones specific to this repository, plus the few shared rules that must hold
even without the skill.

## Scope and audience

- This is a tutorial, not reference documentation. It covers **Next.XP**: the opinionated integration between **Next.js** and
  **Enonic XP** through `@enonic/nextjs-adapter`.
- It is written for front-end/Next.js developers who want a structured CMS back-end, and should also make sense to Enonic
  developers adding a Next.js front-end.
- The tutorial is a step-by-step story: an Introduction and 15 numbered chapters (see `docs/menu.json`) from Enonic setup
  through rendering, preview, components, static generation, localization and deployment. `docs/demo.adoc` is the shortcut:
  deploying this app on Vercel against an Enonic Cloud back-end without going through the chapters.
- Release and upgrade notes for the Next.XP product live in the separate `doc-nextxp` repository, not here.
- Reference separately documented products (Guillotine, Enonic XP, Content Studio, the CLI) with a short summary and a link;
  do not re-document them. For Next.js concepts (app router, SSG/ISR), link to https://nextjs.org/docs and explain only what
  is Next.XP-specific.

## Versioning

- Versions are named after the Next.XP major they document, which follows the `@enonic/nextjs-adapter` major. They are listed
  in `docs/versions.json` on `master`.
- `master` holds the 6.x tutorial (Enonic XP 8.1, Guillotine 9, Next.js 16), published as `stable`. The `5.x`, `4.x` and `3.x`
  branches hold the earlier tutorials, published under their own labels.
- When a new major is started: cut a branch for the outgoing major from `master`, list it under its own label, and add it to
  the docgen workflow.
- The stack the tutorial was written and tested with is declared in `docs/.variables.adoc` and shown on the introduction page.
  Update it whenever a major of Enonic XP, Guillotine, the adapter, `@enonic/page-editor`, Next.js or React changes, and keep
  `package.json` in step.

## Code and text belong together

- Chapters include source files directly from the repository (`include::{sourcedir}/components/...[]`), so a change to `src/`
  changes the published tutorial. Check the chapter that includes or explains a file before editing it, and update the
  `.adoc` when the code changes, and vice versa.
- Other chapters show hand-written excerpts of `src/components/_mappings.ts`, the layouts and `.env`. These are not included
  from the source, so keep them in step manually.
- The focus is the integration between Next.js and Enonic content. Keep the code clean and simple, but aligned with best
  practices.

## The Next.js app

- **Structure:** `src/app` holds the Next.js app router entry points (`[locale]`, `api`). `src/components` holds the Enonic
  component implementations (`pages`, `parts`, `layouts`, `macros`, `queries`, `views`), wired up in
  `src/components/_mappings.ts`. `src/proxy.ts` handles locale routing and Content Studio preview requests.
- **Configuration:** the app is configured through environment variables (`.env`, `.env.development`): `ENONIC_APP_NAME`,
  `ENONIC_API`, `ENONIC_API_TOKEN` and `ENONIC_MAPPINGS`, with the optional `GUILLOTINE_API`, `ENONIC_MEDIA_CDN` and
  `ENONIC_ADMIN`.
- **Back-end:** the app needs a running Enonic back-end: a local sandbox or an Enonic Cloud solution, with the Next.XP app
  installed. See `README.md`.
- **Commands:** `npm run dev` starts the front-end on http://localhost:3000, `npm run prod` builds and starts it in
  production mode, and `npm run lint` runs ESLint (it also runs before every build).
- **CI:** `.github/workflows/build.yml` runs `npm ci` and the build on every push. The documentation is published by
  `.github/workflows/enonic-docgen.yml`.

## Key conventions specific to this repository

- **Images:** screenshots are in `docs/media/` and pages set `:imagesdir: media/`. Retake screenshots when the sample content
  or UI they show has changed.
- **XP version:** do not pin the Enonic XP release in sandbox commands (no `-v`). The tutorial is kept up to date and should work with
  the latest version; the versions it was tested with are listed on the introduction page.
- **Naming:** the tutorial slug is `nextjs`. The sandbox is `tutorial_nextjs` (the CLI does not accept hyphens in sandbox
  names), the Enonic source folder is `tutorial-nextjs-enonic`, the frontend folder is `tutorial-nextjs-frontend`, and the
  application the reader creates is `com.example.tutorial.nextjs`.
- **Sample content:** the tutorial uses the `intro` project from the Intro starter, with a site at `/hmdb`. The committed
  `.env` instead targets the demo back-end: the Headless Movie DB solution (`com.enonic.app.hmdb`, project `hmdb`). Use the
  names and IDs the relevant project actually returns in examples and links.

## Must-know rules even without the skill

- Every page in `docs/menu.json` has real content; add new pages to the menu.
- Wrap identifiers containing `_` in `+...+` outside source blocks.
- Use relative `<<path#,Label>>` links and never a `^` suffix.
- Only `.adoc` and `.json` files under `docs/` stay out of the published site; everything else becomes a page or a media item.
  A dot prefix does not exclude a file.
