import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"

// https://vitejs.dev/config/
export default defineConfig({
  root: "src",
  plugins: [svelte()],
  build: {
    target: "esnext",
    outDir: "../dist",
    emptyOutDir: true,
  },
});
