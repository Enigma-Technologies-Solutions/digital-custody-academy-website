#!/usr/bin/env node
// Builds the blog: blog-src/<date>-<slug>.md becomes public/blog/index.html,
// public/blog/<slug>/index.html and the RSS feed public/blog/feed.xml. Also builds the
// site's other static pages from pages-src/<name>.md (public/<name>/index.html, for now
// only /privacy/), plus public/404.html and public/sitemap.xml. Static HTML next to the
// React landing page; Vite copies public/ into
// dist/ unchanged, so they deploy with the rest of the site. Authoring guide: docs/blog.md.
//
//   node scripts/build-blog.mjs            published posts only (what `pnpm build` runs)
//   node scripts/build-blog.mjs --drafts   drafts too, marked as drafts, for local preview
//
// public/blog/ is generated and git-ignored: every run empties it (except .gitkeep) and
// writes it again, and CI rebuilds it from blog-src/ on every deploy, so a draft written
// by --drafts never ships. Styles: client/site.css plus blog-src/blog.css, written to
// public/blog/blog.css.

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(repo, 'blog-src');
const OUT = join(repo, 'public/blog');
const PAGES_SRC = join(repo, 'pages-src');
const SITE = 'https://digitalcustody.academy';
const OG_IMAGE_ALT = 'Digital Custody Academy: standards-aligned modules, online and on your own machine.';

export class PostError extends Error {}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// ── Frontmatter ─────────────────────────────────────────────────────────────

const KNOWN = new Set(['title', 'date', 'slug', 'excerpt', 'draft']);

/** `key: "value"` lines between two `---` fences. No YAML. */
export function frontmatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!m) throw new PostError('post has no frontmatter (it must start with ---)');
  const data = {};
  for (const line of m[1].split('\n')) {
    if (!line.trim()) continue;
    const kv = /^([a-z_]+):\s*"(.*)"\s*$/.exec(line);
    if (!kv) throw new PostError(`frontmatter line is not key: "value": ${line.slice(0, 40)}`);
    data[kv[1]] = kv[2];
  }
  return { data, body: m[2] };
}

/** Validate one post file. Returns { title, date, slug, excerpt, draft: boolean, html }. */
export function parsePost(file, text) {
  const where = `blog-src/${file}:`;
  if (/\r/.test(text)) throw new PostError(`${where} use LF line endings`);
  let parsed;
  try {
    parsed = frontmatter(text);
  } catch (e) {
    throw new PostError(`${where} ${e.message}`);
  }
  const { data, body } = parsed;
  for (const k of Object.keys(data)) if (!KNOWN.has(k)) throw new PostError(`${where} unknown key ${k}`);
  for (const k of ['title', 'date', 'slug', 'excerpt']) if (!data[k]) throw new PostError(`${where} missing ${k}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(`${data.date}T00:00:00Z`))) throw new PostError(`${where} date must be YYYY-MM-DD`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(data.slug)) throw new PostError(`${where} slug must be lower-case words joined by hyphens`);
  if (file !== `${data.date}-${data.slug}.md`) throw new PostError(`${where} file name must be ${data.date}-${data.slug}.md`);
  if (data.title.length > 90) throw new PostError(`${where} title is over 90 characters`);
  if (data.excerpt.length > 220) throw new PostError(`${where} excerpt is over 220 characters`);
  if (data.draft !== undefined && data.draft !== 'true') throw new PostError(`${where} draft must be "true" or absent`);
  let html;
  try {
    html = markdown(body);
  } catch (e) {
    throw new PostError(`${where} ${e.message}`);
  }
  return { title: data.title, date: data.date, slug: data.slug, excerpt: data.excerpt, draft: data.draft === 'true', html };
}

// ── Markdown (strict subset) ────────────────────────────────────────────────
// Allowed: ## to #### headings, paragraphs, **strong**, *emphasis*, `code`, fenced code,
// one-level bullet and numbered lists, > block quotes, [text](https://... or /path) links.
// Anything that looks like raw HTML is escaped, not rendered. Images and tables are errors.

const INLINE = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\*[^*\s][^*\n]*\*)|(\[[^\]\n]+\]\([^)\s]+\))/g;

function inline(text, n) {
  if (text.replace(/`[^`\n]*`/g, '').includes('![')) throw new Error(`line ${n}: images are not allowed`);
  let out = '';
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    out += esc(text.slice(last, m.index));
    const tok = m[0];
    if (m[1]) out += `<code>${esc(tok.slice(1, -1))}</code>`;
    else if (m[2]) out += `<strong>${inline(tok.slice(2, -2), n)}</strong>`;
    else if (m[3]) out += `<em>${inline(tok.slice(1, -1), n)}</em>`;
    else {
      const [, label, href] = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok);
      if (!/^(https:\/\/|mailto:|\/(?!\/))/.test(href)) throw new Error(`line ${n}: link must be https://..., mailto:... or a site path starting with /: ${href}`);
      const ext = href.startsWith('https://');
      out += `<a href="${esc(href)}"${ext ? ' rel="noopener"' : ''}>${inline(label, n)}</a>`;
    }
    last = m.index + tok.length;
  }
  return out + esc(text.slice(last));
}

export function markdown(src) {
  const lines = src.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const n = i + 1;
    if (!raw.trim()) { i++; continue; }
    if (/^```/.test(raw)) {
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      if (i >= lines.length) throw new Error(`line ${n}: code fence is not closed`);
      i++;
      out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }
    if (/^# /.test(raw)) throw new Error(`line ${n}: # is the post title; start body headings at ##`);
    const h = /^(#{2,4}) (.+)$/.exec(raw);
    if (h) { out.push(`<h${h[1].length}>${inline(h[2].trim(), n)}</h${h[1].length}>`); i++; continue; }
    if (/^\|/.test(raw)) throw new Error(`line ${n}: tables are not allowed`);
    if (/^\s+([-*]|\d+\.)\s/.test(raw)) throw new Error(`line ${n}: nested lists are not allowed`);
    const list = /^([-*]|\d+\.) /.exec(raw);
    if (list) {
      const ordered = /\d/.test(list[1]);
      const re = ordered ? /^\d+\. (.*)$/ : /^[-*] (.*)$/;
      const items = [];
      while (i < lines.length && re.test(lines[i])) {
        items.push(`<li>${inline(re.exec(lines[i])[1], i + 1)}</li>`);
        i++;
      }
      out.push(`<${ordered ? 'ol' : 'ul'}>${items.join('')}</${ordered ? 'ol' : 'ul'}>`);
      continue;
    }
    if (/^> ?/.test(raw)) {
      const buf = [];
      while (i < lines.length && /^> ?/.test(lines[i])) buf.push(lines[i++].replace(/^> ?/, ''));
      out.push(`<blockquote><p>${inline(buf.join(' '), n)}</p></blockquote>`);
      continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(```|#{1,4} |> ?|[-*] |\d+\. |\|)/.test(lines[i])) buf.push(lines[i++].trim());
    out.push(`<p>${inline(buf.join(' '), n)}</p>`);
  }
  return out.join('\n');
}

// ── Pages ───────────────────────────────────────────────────────────────────

const longDate = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

// The sign-up form, as in client/pages/Index.tsx; public/newsletter.js posts it.
const NEWSLETTER = `<section class="card nl-box" aria-labelledby="nl-h">
      <h2 class="nl-box__h" id="nl-h">Get new posts and modules by email</h2>
      <form class="nl" data-newsletter="dca" novalidate>
        <label class="nl__label" for="nl-email">Email address</label>
        <div class="nl__row">
          <input id="nl-email" class="nl__input" type="email" name="email" required autocomplete="email" placeholder="you@company.com">
          <button class="btn btn--accent" type="submit">Subscribe</button>
        </div>
        <label class="nl__hp" aria-hidden="true">Website <input name="website" tabindex="-1" autocomplete="off"></label>
        <div class="nl__challenge"></div>
        <p class="nl__status" role="status" aria-live="polite"></p>
        <p class="nl__fine">We email you a link to confirm. Every issue has an unsubscribe link. <a href="/privacy/">Privacy</a></p>
      </form>
    </section>`;

const TILE = (cls) => `<span class="tile${cls}" aria-hidden="true"><span>DCA<i></i></span></span>`;

// `title` is the page <title>; `shareTitle` is the title on link previews, without the
// site name, which og:site_name already carries. `published` (YYYY-MM-DD) adds
// article:published_time. `current` is the nav link to mark as the current page.
// `path` null (the 404 page) leaves out the canonical and og:url; `noindex` keeps the
// page out of search results.
function shell({ title, shareTitle = title, description, path, body, draft = false, noindex = draft, ogType = 'website', published, current = 'blog' }) {
  const url = path === null ? null : `${SITE}${path}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- Generated by scripts/build-blog.mjs from blog-src/. Do not edit; see docs/blog.md. -->
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${url ? `<link rel="canonical" href="${esc(url)}">\n` : ''}<meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow'}">
<meta name="theme-color" content="#ffffff">
<link rel="icon" type="image/svg+xml" href="/dca-tile.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&family=Space+Mono:wght@400;700&display=swap">
<link rel="stylesheet" href="/blog/blog.css">
<link rel="alternate" type="application/rss+xml" title="Digital Custody Academy blog" href="/blog/feed.xml">
<script src="/newsletter.js" defer></script>
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="Digital Custody Academy">
<meta property="og:locale" content="en_US">
${url ? `<meta property="og:url" content="${esc(url)}">\n` : ''}<meta property="og:title" content="${esc(shareTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${SITE}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(OG_IMAGE_ALT)}">
${published ? `<meta property="article:published_time" content="${esc(published)}">\n` : ''}<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(shareTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE}/og.png">
<meta name="twitter:image:alt" content="${esc(OG_IMAGE_ALT)}">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>

<nav class="nav" aria-label="Primary">
  <div class="wrap nav__inner">
    <a class="wordmark" href="/" aria-label="Digital Custody Academy home">${TILE(' tile--sm')}<span class="wordmark__full">Digital Custody Academy</span></a>
    <div class="nav__links">
      <a href="/#about">About</a>
      <a href="/#modules">Modules</a>
      <a href="/#how">How it works</a>
      <a href="/#instructors">Instructors</a>
      <a href="/blog/"${current === 'blog' ? ' aria-current="page"' : ''}>Blog</a>
    </div>
    <div class="nav__cta">
      <a class="btn btn--ghost btn--sm" href="/#updates">Get updates</a>
      <a class="btn btn--accent btn--sm" href="/#contact">Contact</a>
    </div>
  </div>
</nav>

<main id="main" class="section blog">
  <div class="wrap">
${body}
  </div>
</main>

<footer class="foot">
  <div class="wrap">
    <div class="foot__grid">
      <div>
        <a class="wordmark" href="/">${TILE('')}<span>Digital Custody Academy</span></a>
        <p class="foot__blurb">Professional education in digital asset security. Secure. Verified. Professional.</p>
        <nav class="foot__links" aria-label="Footer">
          <a href="/blog/">Blog</a>
          <a href="/blog/feed.xml">RSS</a>
          <a href="/#updates">Newsletter</a>
          <a href="/privacy/">Privacy</a>
        </nav>
      </div>
      <a class="foot__by" href="https://enigma.sh">An initiative of <span class="ets">ETS</span> Enigma Technologies Solutions</a>
    </div>
    <div class="foot__bar">
      <span>© 2026 Enigma Technologies Solutions Limited · Ras Al Khaimah, UAE</span>
      <span>digitalcustody.academy</span>
    </div>
  </div>
</footer>
</body>
</html>
`;
}

export function indexPage(posts) {
  const items = posts
    .map(
      (p) => `      <article class="blog__item">
        <p class="blog__date">${esc(longDate(p.date))}${p.draft ? ' · <span class="blog__draft">draft</span>' : ''}</p>
        <h2 class="blog__title"><a href="/blog/${esc(p.slug)}/">${esc(p.title)}</a></h2>
        <p class="blog__excerpt">${esc(p.excerpt)}</p>
        <a class="blog__more" href="/blog/${esc(p.slug)}/">Read more</a>
      </article>`,
    )
    .join('\n');
  const body = `    <p class="eyebrow">Blog</p>
    <h1 class="h2 blog__h1">Notes on digital custody<span class="pd" aria-hidden="true"></span></h1>
${posts.length ? `    <div class="blog__list">\n${items}\n    </div>` : '    <p class="lede blog__empty">No posts yet.</p>'}
    ${NEWSLETTER}`;
  return shell({
    title: 'Blog | Digital Custody Academy',
    shareTitle: 'Notes on digital custody',
    description: 'Articles on digital asset custody, key management and the standards behind them, from Digital Custody Academy.',
    path: '/blog/',
    draft: posts.some((p) => p.draft),
    body,
  });
}

export function postPage(post) {
  const body = `    <article class="blog__post">
    <p class="eyebrow"><a href="/blog/">Blog</a>${post.draft ? ' · <span class="blog__draft">draft</span>' : ''}</p>
    <p class="blog__date">${esc(longDate(post.date))}</p>
    <h1 class="h2 blog__h1">${esc(post.title)}</h1>
    <div class="blog__body">
${post.html}
    </div>
    ${NEWSLETTER}
    <p class="blog__back"><a href="/blog/">Back to the blog</a></p>
    </article>`;
  return shell({
    title: `${post.title} | Digital Custody Academy`,
    shareTitle: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}/`,
    draft: post.draft,
    ogType: 'article',
    published: post.date,
    body,
  });
}

const rfc822 = (iso) => new Date(`${iso}T00:00:00Z`).toUTCString();

/** RSS 2.0, newest first. Published posts only, whatever the build includes. */
export function feed(posts) {
  const items = posts
    .filter((p) => !p.draft)
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE}/blog/${esc(p.slug)}/</link>
      <guid isPermaLink="true">${SITE}/blog/${esc(p.slug)}/</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <description>${esc(p.excerpt)}</description>
    </item>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Digital Custody Academy blog</title>
    <link>${SITE}/blog/</link>
    <atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Articles on digital asset custody, key management and the standards behind them.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
}

// ── Other pages (pages-src/<name>.md → public/<name>/index.html) ────────────
// Frontmatter: title, description and updated (YYYY-MM-DD), all required. Same Markdown
// subset as posts.

export function parsePage(file, text) {
  const where = `pages-src/${file}:`;
  if (/\r/.test(text)) throw new PostError(`${where} use LF line endings`);
  let parsed;
  try {
    parsed = frontmatter(text);
  } catch (e) {
    throw new PostError(`${where} ${e.message}`);
  }
  const { data, body } = parsed;
  for (const k of Object.keys(data)) if (!['title', 'description', 'updated'].includes(k)) throw new PostError(`${where} unknown key ${k}`);
  for (const k of ['title', 'description', 'updated']) if (!data[k]) throw new PostError(`${where} missing ${k}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.updated)) throw new PostError(`${where} updated must be YYYY-MM-DD`);
  let html;
  try {
    html = markdown(body);
  } catch (e) {
    throw new PostError(`${where} ${e.message}`);
  }
  const name = file.replace(/\.md$/, '');
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) throw new PostError(`${where} file name must be lower-case words joined by hyphens`);
  return { name, ...data, html };
}

export function pagePage(page) {
  const body = `    <article class="blog__post">
    <p class="blog__date">Last updated ${esc(longDate(page.updated))}</p>
    <h1 class="h2 blog__h1">${esc(page.title)}</h1>
    <div class="blog__body">
${page.html}
    </div>
    </article>`;
  return shell({
    title: `${page.title} | Digital Custody Academy`,
    shareTitle: page.title,
    description: page.description,
    path: `/${page.name}/`,
    current: page.name,
    body,
  });
}

export function loadPages(dir = PAGES_SRC) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => parsePage(f, readFileSync(join(dir, f), 'utf8')));
}

// ── 404 and sitemap ─────────────────────────────────────────────────────────

// GitHub Pages serves public/404.html (copied to dist/404.html) for any missing path, at
// that path, so every link and asset in it is absolute.
export function notFoundPage() {
  const body = `    <article class="blog__post">
    <p class="eyebrow">404</p>
    <h1 class="h2 blog__h1">Page not found</h1>
    <div class="blog__body">
    <p>There is nothing at this address. It may have moved, or the link may be mistyped.</p>
    <ul>
    <li><a href="/">Digital Custody Academy home</a></li>
    <li><a href="/#modules">The modules</a></li>
    <li><a href="/blog/">Blog</a></li>
    </ul>
    <p>Looking for something specific? Write to <a href="mailto:jjpa@digitalcustody.academy">jjpa@digitalcustody.academy</a>.</p>
    </div>
    </article>`;
  return shell({
    title: 'Page not found | Digital Custody Academy',
    description: 'This page does not exist on digitalcustody.academy.',
    path: null,
    noindex: true,
    current: '404',
    body,
  });
}

/** The landing page, the blog index, published posts and static pages. Never drafts. */
export function sitemap(posts, pages) {
  const url = (path, lastmod) => `  <url><loc>${esc(SITE + path)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
  const published = posts.filter((p) => !p.draft);
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated by scripts/build-blog.mjs. Do not edit. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[
  url('/'),
  url('/blog/', published[0]?.date),
  ...published.map((p) => url(`/blog/${p.slug}/`, p.date)),
  ...pages.map((p) => url(`/${p.name}/`, p.updated)),
].join('\n')}
</urlset>
`;
}

/** Every file the blog produces, keyed by path under public/blog/. Posts newest first. */
export function renderBlog(all, { includeDrafts = false } = {}) {
  const posts = all.filter((p) => includeDrafts || !p.draft).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  const seen = new Set();
  for (const p of posts) {
    if (seen.has(p.slug)) throw new PostError(`duplicate slug ${p.slug}`);
    seen.add(p.slug);
  }
  const css = `/* Generated by scripts/build-blog.mjs: client/site.css + blog-src/blog.css. Do not edit. */\n\n${readFileSync(join(repo, 'client/site.css'), 'utf8')}\n\n${readFileSync(join(SRC, 'blog.css'), 'utf8')}`;
  const files = new Map([
    ['blog.css', css],
    ['index.html', indexPage(posts)],
    ['feed.xml', feed(posts)],
  ]);
  for (const p of posts) files.set(`${p.slug}/index.html`, postPage(p));
  return { files, posts };
}

export function loadPosts(dir = SRC) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => parsePost(f, readFileSync(join(dir, f), 'utf8')));
}

function main(argv) {
  const includeDrafts = argv.includes('--drafts');
  const all = loadPosts();
  const { files, posts } = renderBlog(all, { includeDrafts });
  for (const e of existsSync(OUT) ? readdirSync(OUT) : []) if (e !== '.gitkeep') rmSync(join(OUT, e), { recursive: true });
  for (const [rel, text] of files) {
    const f = join(OUT, rel);
    mkdirSync(dirname(f), { recursive: true });
    writeFileSync(f, text);
  }
  const pages = loadPages();
  for (const page of pages) {
    const f = join(repo, 'public', page.name, 'index.html');
    mkdirSync(dirname(f), { recursive: true });
    writeFileSync(f, pagePage(page));
  }
  writeFileSync(join(repo, 'public/404.html'), notFoundPage());
  writeFileSync(join(repo, 'public/sitemap.xml'), sitemap(posts, pages));
  const drafts = all.filter((p) => p.draft).length;
  const note = includeDrafts ? ' (drafts included: preview only, never commit or deploy this)' : drafts ? ` (${drafts} draft${drafts === 1 ? '' : 's'} skipped)` : '';
  console.log(`Blog: ${posts.length} post${posts.length === 1 ? '' : 's'} in public/blog/${note}.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv.slice(2));
  } catch (e) {
    if (!(e instanceof PostError)) throw e;
    console.error(e.message);
    process.exit(1);
  }
}
