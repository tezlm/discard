import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import autoPreprocess from 'svelte-preprocess';
import { execSync } from "child_process";
import pkgjson from "./package.json" assert { type: "json" };

// https://vitejs.dev/config/
export default defineConfig({
  root: "src",
  plugins: [svelte({ preprocess: autoPreprocess() })],
  build: {
    sourcemap: true,
    target: "esnext",
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "emojibase-data": [
            "emojibase-data/en/compact.json",
            "emojibase-data/en/shortcodes/joypixels.json",
            "emojibase-data/en/shortcodes/emojibase.json",
          ],
          "sanitize-html": ["sanitize-html"],
          "highlight.js": ["highlight.js"],
          "lexical": ["lexical", "@lexical/selection", "@lexical/history", "@lexical/utils"],
        }
      }
    }
  },
  define: {
    DISCARD: {
      package: pkgjson,
      time: new Date(),
      commit: execSync("git log -n 1 --oneline HEAD").toString().match(/[a-z0-9]+/)[0],
    }
  },
});
