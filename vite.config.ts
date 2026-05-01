import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react-oxc";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ mode }) => ({
  server: {
    port: 3000,
    host: true,
    watch: {
      ignored: ["**/.pnpm-store/**", "**/node_modules/**"],
    },
    proxy: {
      "/socket.io": {
        target: "http://localhost:3001",
        ws: true,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({
      srcDirectory: "src",
    }),
    nitro({
      routeRules: {
        "/socket.io/**": { proxy: "http://localhost:3001/socket.io/**" },
      },
    }),
    viteReact(),
    tailwindcss(),
  ],
  ssr: {
    external: ["isomorphic-dompurify"],
  },
  // Forward NEXT_PUBLIC_* env vars to client bundle for backward compatibility
  define: {
    "process.env.NEXT_PUBLIC_ENABLE_FILE_SYNC": JSON.stringify(
      process.env.NEXT_PUBLIC_ENABLE_FILE_SYNC ?? "",
    ),
    "process.env.NEXT_PUBLIC_TITLE_PREFIX": JSON.stringify(
      process.env.NEXT_PUBLIC_TITLE_PREFIX ?? "",
    ),
  },
}));
