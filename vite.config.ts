import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// base "./" makes the built site work from any folder (e.g. GitHub Pages under /portfolio/).
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  // Three.js (~190 kB gzipped) is loaded on demand after the page shows, so its size is expected.
  build: { chunkSizeWarningLimit: 800 },
});
