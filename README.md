# Digital Custody Academy website

Landing page for [digitalcustody.academy](https://digitalcustody.academy). A static Vite + React build styled with plain CSS (`client/site.css`), deployed to GitHub Pages on every push to `main` (see `.github/workflows/pages.yml`).

Course modules are distributed separately as a Sanctum registry and do not live in this repo.

```sh
pnpm install
pnpm dev          # http://localhost:5000
pnpm build        # outputs dist/
```

## Blog

Static pages at `/blog/`, built from `blog-src/*.md` by `scripts/build-blog.mjs`, which `pnpm dev` and `pnpm build` run first. Preview drafts with `pnpm dev:drafts`. How to write, preview and publish a post: [`docs/blog.md`](docs/blog.md).

The same script writes the RSS feed (`/blog/feed.xml`) and the site's other static pages from `pages-src/*.md` (for now `/privacy/`).

## Newsletter

Sign-up forms (`#updates` on the landing page, and a box at the end of the blog pages) post to the newsletter Worker at `newsletter.enigmahq.sh` (private repo `enigma-newsletter-worker`), which emails a confirmation link before adding anyone. `public/newsletter.js` handles every `<form data-newsletter="dca">` and loads Cloudflare Turnstile only when someone focuses a form. On `localhost` it uses the Worker's dev server (`http://localhost:8795`) and Turnstile's test key instead.

## Brand

`styles/DCA_styleguide.html` is the source of truth (v2.0: the ETS product system with DCA colours). `client/site.css` uses its tokens.

The tile icons in `public/` come from `public/dca-tile.svg`, which `scripts/gen-tile.py` draws from Poppins 700 outlines:

```sh
pip install fonttools brotli
python3 scripts/gen-tile.py path/to/Poppins-700.woff2
```

Then render `dca-logo.png` (512), `icon-192.png`, `apple-touch-icon.png` (180), `favicon-32.png` and `favicon.ico` from the SVG.
