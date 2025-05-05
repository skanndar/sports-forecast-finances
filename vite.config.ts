import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Pull in the site URL so that Odoo can serve your built files from the right path
const siteUrl = process.env.VITE_SITE_URL || "/";

export default defineConfig(({ mode }) => ({
  base: siteUrl,         // e.g. "/pnl_forecaster_AAD/static/src/"
  server: {
    // Only relevant for `npm run dev`
    host: "0.0.0.0",
    port: 8080,
  },
  plugins: [
    react(),
    // If you still want lovable-tagger **locally**, guard it behind an env var:
    mode === "development" && process.env.USE_LOVABLE && require("lovable-tagger").componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
