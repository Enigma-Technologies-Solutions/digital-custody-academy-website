import "./site.css";

import { createRoot, hydrateRoot } from "react-dom/client";
import Index from "./pages/Index";

// In a production build #root already holds the prerendered page (scripts/prerender.mjs);
// in dev it is empty.
const root = document.getElementById("root")!;
if (root.hasChildNodes()) hydrateRoot(root, <Index />);
else createRoot(root).render(<Index />);
