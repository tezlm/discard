import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { execSync } from "child_process";
import pkgjson from "./package.json" assert { type: "json" };

// https://vitejs.dev/config/
export default defineConfig({
  root: "src",
  plugins: [svelte()],
  build: {
    target: "esnext",
    outDir: "../dist",
    emptyOutDir: true,
  },
  define: {
    build: {
      package: pkgjson,
      time: new Date(),
      commit: execSync("git log -n 1 --oneline HEAD").toString().match(/[a-z0-9]+/)[0],
    }
  },
});
