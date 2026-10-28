#!/usr/bin/env node
// Prerenders the landing page into dist/index.html after `vite build`. Builds
// client/entry-server.tsx for Node into dist-ssr/ (removed afterwards), renders it, and
// fills <div id="root">. The page has no interactive React, so the client bundle is then
// dropped: the published page is static HTML and CSS, plus newsletter.js. Run by `pnpm build`.

import { readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ssrOut = join(repo, 'dist-ssr');
const page = join(repo, 'dist/index.html');
const EMPTY_ROOT = '<div id="root"></div>';
const BUNDLE = /<script type="module" crossorigin src="\/(assets\/index-[\w-]+\.js)"><\/script>\s*/g;

try {
  await build({
    root: repo,
    logLevel: 'warn',
    build: { ssr: 'client/entry-server.tsx', outDir: ssrOut, emptyOutDir: true, copyPublicDir: false },
  });
  const { render } = await import(pathToFileURL(join(ssrOut, 'entry-server.js')).href);
  const html = readFileSync(page, 'utf8');
  if (html.split(EMPTY_ROOT).length !== 2) throw new Error(`dist/index.html must contain ${EMPTY_ROOT} exactly once`);
  const bundles = [...html.matchAll(BUNDLE)].map((m) => m[1]);
  if (bundles.length !== 1) throw new Error(`dist/index.html must load exactly one client bundle, found ${bundles.length}`);
  const markup = render();
  writeFileSync(page, html.replace(BUNDLE, '').replace(EMPTY_ROOT, () => `<div id="root">${markup}</div>`));
  unlinkSync(join(repo, 'dist', bundles[0]));
  console.log(`Prerendered dist/index.html (${Math.round(markup.length / 1024)} kB of markup), dropped ${bundles[0]}.`);
} finally {
  rmSync(ssrOut, { recursive: true, force: true });
}
