import "./site.css";

import { createRoot } from "react-dom/client";
import Index from "./pages/Index";

// Dev server only. `pnpm build` prerenders the page to static HTML and drops this bundle
// (scripts/prerender.mjs), so nothing here runs on the published site.
createRoot(document.getElementById("root")!).render(<Index />);
