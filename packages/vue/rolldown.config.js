import { defineConfig } from "rolldown";
import vue from "unplugin-vue/rolldown";

export default defineConfig({
  input: "src/index.ts",
  external: (id) => {
    // Externalize all non-relative imports
    if (id.startsWith(".") || id.startsWith("/")) return false;
    return true;
  },
  plugins: [vue()],
  output: [
    { file: "dist/index.cjs", format: "cjs" },
    { file: "dist/index.js", format: "es" },
  ],
});
