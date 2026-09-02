import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Mirrors the `@/*` → `./src/*` path alias from tsconfig.json, so a module
  // under test can import the way the app does instead of being restricted to
  // relative paths.
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    globals: true,
  },
});
