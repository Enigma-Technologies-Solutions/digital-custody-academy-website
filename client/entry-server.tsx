// Build-time render of the landing page. scripts/prerender.mjs writes this markup into
// dist/index.html, so the page's text is in the HTML for crawlers and link previewers
// that do not run JavaScript; client/App.tsx then hydrates it.
import { renderToString } from "react-dom/server";
import Index from "./pages/Index";

export const render = () => renderToString(<Index />);
