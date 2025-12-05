import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/index.ts",
  external: (id) => {
    // Externalize all non-relative imports
    if (id.startsWith(".") || id.startsWith("/")) return false;
    return true;
  },
  output: [
    { file: "dist/index.cjs", format: "cjs" },
    { file: "dist/index.js", format: "es" },
  ],
  jsx: {
    mode: "automatic",
  },
});
