import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig as defineLovableConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";
import { defineConfig as defineViteConfig, type ConfigEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
const tanstackStartConfig = {
  server: { entry: "server" },
} as const;

// Map Vercel env vars → both VITE_* (client) and bare names (server fallback)
// so the auto-generated supabase client works on Vercel without code edits.
const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const SUPABASE_ANON =
  process.env.VITE_SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  process.env.SUPABASE_PUBLISHABLE_KEY ??
  "";
const SUPABASE_PROJECT_ID =
  process.env.VITE_SUPABASE_PROJECT_ID ?? process.env.SUPABASE_PROJECT_ID ?? "";

const vercelPublicEnvDefine = {
  "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(SUPABASE_URL),
  "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(SUPABASE_ANON),
  "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(SUPABASE_ANON),
  "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify(SUPABASE_PROJECT_ID),
};

export default async function config(env: ConfigEnv) {
  if (process.env.VERCEL === "1") {
    // Surface missing env at build time so deploys don't ship a broken auth shell.
    if (!SUPABASE_URL || !SUPABASE_ANON) {
      console.warn(
        "[vercel-build] Missing Supabase env. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY) in Vercel → Project Settings → Environment Variables.",
      );
    }
    return defineViteConfig({
      define: vercelPublicEnvDefine,
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
