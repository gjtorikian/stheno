import { defineConfig } from "rolldown";
import svelte from "rollup-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";

export default defineConfig({
  input: "src/index.ts",
  external: (id) => {
    // Externalize all non-relative imports
    if (id.startsWith(".") || id.startsWith("/")) return false;
    return true;
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        dev: false,
      },
      emitCss: false,
    }),
  ],
  output: [
    { file: "dist/index.js", format: "es" },
  ],
});
