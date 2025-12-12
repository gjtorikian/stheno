import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: "https://gjtorikian.github.io",
  base: "/stheno",
  integrations: [react(), mdx()],
  image: {
    service: {
      entrypoint: "astro/assets/services/noop",
    },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // Point to source files to avoid bundler issues
        "@yettoapp/stheno": path.resolve(__dirname, "../packages/core/src/index.ts"),
        "@yettoapp/stheno-react": path.resolve(__dirname, "../packages/react/src/index.ts"),
      },
    },
  },
});
