import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig as defineLovableConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";
import { defineConfig as defineViteConfig, type ConfigEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
const tanstackStartConfig = {
  server: { entry: "server" },
} as const;

export default async function config(env: ConfigEnv) {
  if (process.env.VERCEL === "1") {
    return defineViteConfig({
      plugins: [
        tailwindcss(),
        tsConfigPaths({ projects: ["./tsconfig.json"] }),
        tanstackStart(tanstackStartConfig),
        nitro({ preset: "vercel", compatibilityDate: "2025-09-24" }),
        viteReact(),
      ],
      resolve: {
        alias: { "@": `${process.cwd()}/src` },
        dedupe: [
          "react",
          "react-dom",
          "react/jsx-runtime",
          "react/jsx-dev-runtime",
          "@tanstack/react-query",
          "@tanstack/query-core",
        ],
      },
    });
  }

  return defineLovableConfig({
    tanstackStart: tanstackStartConfig,
  })(env);
}
