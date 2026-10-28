#!/usr/bin/env node
// Prerenders the landing page into dist/index.html after `vite build`, so its text is in
// the HTML rather than only in the JavaScript bundle. Builds client/entry-server.tsx for
// Node into dist-ssr/ (removed afterwards), renders it, and fills <div id="root">.
// client/App.tsx hydrates the result in the browser. Run by `pnpm build`.

import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ssrOut = join(repo, 'dist-ssr');
const page = join(repo, 'dist/index.html');
const EMPTY_ROOT = '<div id="root"></div>';

try {
  await build({
    root: repo,
    logLevel: 'warn',
    build: { ssr: 'client/entry-server.tsx', outDir: ssrOut, emptyOutDir: true, copyPublicDir: false },
  });
  const { render } = await import(pathToFileURL(join(ssrOut, 'entry-server.js')).href);
  const html = readFileSync(page, 'utf8');
  if (html.split(EMPTY_ROOT).length !== 2) throw new Error(`dist/index.html must contain ${EMPTY_ROOT} exactly once`);
  const markup = render();
  writeFileSync(page, html.replace(EMPTY_ROOT, () => `<div id="root">${markup}</div>`));
  console.log(`Prerendered dist/index.html (${Math.round(markup.length / 1024)} kB of markup).`);
} finally {
  rmSync(ssrOut, { recursive: true, force: true });
}
