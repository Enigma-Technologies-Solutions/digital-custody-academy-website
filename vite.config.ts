import { defineConfig, type Connect, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";

// The blog is static HTML in public/blog/ (scripts/build-blog.mjs, docs/blog.md). GitHub
// Pages serves /blog/ and /blog/<slug>/ as directory indexes; Vite's dev and preview
// servers do not, and would answer with the React app. This maps a path ending in / to
// its index.html when that file exists in public/ (dev) or dist/ (preview).
function directoryIndex(): Plugin {
  const rewrite = (root: string): Connect.NextHandleFunction => (req, _res, next) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      const file = path.join(root, decodeURIComponent(url.pathname), "index.html");
      if (file.startsWith(root + path.sep) && fs.existsSync(file)) req.url = `${url.pathname}index.html${url.search}`;
    }
    next();
  };
  return {
    name: "directory-index",
    configureServer(server) {
      server.middlewares.use(rewrite(path.resolve(server.config.publicDir)));
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite(path.resolve(server.config.root, server.config.build.outDir)));
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
  },
  build: {
    outDir: "dist",
  },
  plugins: [react(), directoryIndex()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
    },
  },
});
