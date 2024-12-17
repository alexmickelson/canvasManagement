import nextEnv from "@next/env";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// hack from https://github.com/vercel/next.js/issues/68091
if (nextEnv && "loadEnvConfig" in nextEnv) {
  nextEnv.loadEnvConfig(process.cwd());
} else {
  // eslint-disable-next-line
  require("@next/env").loadEnvConfig(process.cwd());
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  test: {
    environment: "jsdom",
  },
});
