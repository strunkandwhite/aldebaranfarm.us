import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["lib/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
      // lib/data imports "server-only", which throws outside a React Server
      // bundle. Stub it for unit tests.
      "server-only": path.resolve(__dirname, "test/server-only-stub.ts"),
    },
  },
});
