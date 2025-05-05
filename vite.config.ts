import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const siteUrl = process.env.VITE_SITE_URL || "/";
const allowedHosts = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "1262c9f7-a689-49d7-8f3e-1ae2dd8ad808.lovableproject.com", // Añadido para Lovable
];

export default defineConfig(({ mode }) => ({
  base: siteUrl,
  server: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts, // <-- Aquí se permite explícitamente el host
  },
  plugins: [
    react(),
    mode === "development" && process.env.USE_LOVABLE && require("lovable-tagger").componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
