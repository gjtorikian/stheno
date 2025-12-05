import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["packages/core/src/**/*.test.ts"],
    globals: true,
    setupFiles: ["./packages/core/src/test-setup.ts"],
  },
});
