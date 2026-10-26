# Writing a blog post

How a post goes from a Markdown file in `blog-src/` to a page at
`https://digitalcustody.academy/blog/<slug>/`. The landing page is React; the blog is plain
static HTML generated next to it, styled with the same `client/site.css`. Run everything from
the repo root.

```
blog-src/2026-10-25-introducing-dca.md          you write this (committed)
blog-src/blog.css                               blog-only styles (committed)
        │
        └── scripts/build-blog.mjs              runs first in `pnpm dev` and `pnpm build`
                → public/blog/index.html        post list
                → public/blog/<slug>/index.html one page per post
                → public/blog/blog.css          client/site.css + blog-src/blog.css
                        │
                        └── vite build copies public/ → dist/ → GitHub Pages
```

`public/blog/` is generated and git-ignored (only its `.gitkeep` is committed). You never
edit it and never commit it: CI rebuilds it from `blog-src/` on every deploy.

## 1. Prerequisites

| Tool | Why | Check |
|---|---|---|
| Node.js 20 or later | Runs `scripts/build-blog.mjs` (Node built-ins only) and Vite. CI uses Node 22. | `node --version` |
| pnpm | The repo's package manager. `pnpm install` once, for Vite. | `pnpm --version` |

There are no images to generate: posts are text only, and every page shares the site's
`og.png` social card.

## 2. Create the post file

Create `blog-src/YYYY-MM-DD-slug.md`. The file name must be exactly the `date` and `slug`
from the frontmatter joined by a hyphen, or the build fails.

```markdown
---
title: "What a qualified custodian actually holds"
date: "2026-11-02"
slug: "what-a-custodian-holds"
excerpt: "Keys, not coins: what custody means once the asset is a signature."
draft: "true"
---

First paragraph.

## A section

More text.
```

Start every post with `draft: "true"` and delete that line when it is ready (step 7).
`blog-src/2026-10-25-introducing-dca.md` is a starting template, still a draft.

## 3. Frontmatter fields

One `key: "value"` per line. Every value must be in double quotes; there is no YAML, so no
lists, multi-line values or comments. An unknown key is a build error.

| Field | Required | Format | What it does |
|---|---|---|---|
| `title` | Yes | Plain text, at most 90 characters | The post's `<h1>`, its heading on `/blog/`, the page `<title>` (followed by "\| Digital Custody Academy"), and `og:title` and `twitter:title` (on their own, since `og:site_name` carries the site name). |
| `date` | Yes | `YYYY-MM-DD` | Shown on the post and in the list; sorts the list, newest first. Must match the file name. Also written as `article:published_time`. |
| `slug` | Yes | Lower-case words joined by hyphens (`a-z`, `0-9`, `-`) | The URL, `/blog/<slug>/`, and the canonical link. Must match the file name and be unique. |
| `excerpt` | Yes | One or two sentences, at most 220 characters | The summary under the title on `/blog/`, the meta description and `og:description`. |
| `draft` | No | Exactly `"true"`, or absent | Keeps the post out of the built site. Any other value is a build error. |

### What the body may contain

A strict Markdown subset. Anything outside it fails the build with the line number, so what
you preview is what ships.

- Headings `##` to `####` (`#` is reserved for the title), paragraphs, `**strong**`,
  `*emphasis*`, `` `code` ``, fenced code blocks, bullet and numbered lists (one level), and
  `>` block quotes.
- Links: `[text](https://...)` for other sites, `[text](mailto:...)`, or `[text](/path)` for
  pages on this site (for example `[the modules](/#modules)` or `[another post](/blog/other-slug/)`).
- Not allowed: images, tables, nested lists, CRLF line endings, and any other link scheme.
  Raw HTML is shown as text, never rendered.

## 4. Build

You rarely run this by hand: `pnpm dev` and `pnpm build` both run it first. To check a post
for errors on its own:

```bash
pnpm blog:build
```

It empties `public/blog/` and writes it again from every published post, printing how many
drafts it skipped. A bad post stops it with the file name and the problem.

## 5. Style

Blog pages load `/blog/blog.css`, which is `client/site.css` (all the site's tokens, nav,
tile and footer) followed by `blog-src/blog.css` (the `.blog*` rules). Change blog styling in
`blog-src/blog.css`. The page template (head, nav, footer) is `shell()` in
`scripts/build-blog.mjs`; if the landing page's nav or footer changes in
`client/pages/Index.tsx`, change it there too.

## 6. Preview locally

Published posts only, exactly as the live site will show:

```bash
pnpm dev
# → http://localhost:5000/blog/
```

Drafts included, marked `draft` next to the date and `noindex`:

```bash
pnpm dev:drafts
# → http://localhost:5000/blog/<slug>/
```

Port 5000 is fixed in `vite.config.ts`. On macOS, AirPlay Receiver often holds it ("Port 5000
is already in use"); pass another port straight through, without `--`:
`pnpm dev --port 5001` or `pnpm dev:drafts --port 5001`. Or turn AirPlay Receiver off.

To check the production output, `pnpm build && pnpm preview`. Vite does not serve directory
indexes by itself; the `directoryIndex` plugin in `vite.config.ts` maps `/blog/` and
`/blog/<slug>/` to their `index.html` in dev and preview, as GitHub Pages does in production.

Draft output in `public/blog/` is harmless: it is git-ignored, and the next `pnpm dev`,
`pnpm build` or CI run rebuilds the folder without drafts.

## 7. Publish

1. Delete the `draft: "true"` line.
2. `pnpm build` to make sure it builds (the same command CI runs).
3. Commit `blog-src/<file>.md` (and `blog-src/blog.css` if you changed it). There is nothing
   generated to commit.
4. Push to `main`. `.github/workflows/pages.yml` runs `pnpm build` and deploys `dist/` to
   GitHub Pages; the post is live at `https://digitalcustody.academy/blog/<slug>/` a minute or
   two later. The landing page links to `/blog/` from its nav and footer.

To unpublish a post, add `draft: "true"` back and push.

## RSS feed and other pages

The build also writes `public/blog/feed.xml`, an RSS 2.0 feed of published posts (drafts
never appear in it, even with `--drafts`). Pages link to it with
`<link rel="alternate">`, and the footer links to it.

Pages that are not posts, such as `/privacy/`, are `pages-src/<name>.md` with three
frontmatter fields, all required: `title`, `description` and `updated` (`YYYY-MM-DD`,
shown as "Last updated"). The body uses the same Markdown subset. Each becomes
`public/<name>/index.html` (git-ignored, rebuilt every run) in the blog's page template.
When a page is added, add its folder to `.gitignore` as for `public/privacy/`.
