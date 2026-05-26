import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { loadLeaderboard } from "@/lib/leaderboard.server";

async function runHealthCheck() {
  const checks: Record<string, { ok: boolean; error?: string; ms?: number }> = {
    ssr: { ok: true },
    auth_middleware: { ok: false },
    supabase: { ok: false },
    leaderboard: { ok: false },
  };

  // Auth middleware module loads
  try {
    const mod = await import("@/integrations/supabase/auth-middleware");
    checks.auth_middleware.ok = typeof mod.requireSupabaseAuth !== "undefined";
  } catch (e) {
    checks.auth_middleware.error = e instanceof Error ? e.message : String(e);
  }

  // Supabase reachable
  try {
    const t0 = Date.now();
    const { error } = await supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }).limit(1);
    checks.supabase.ms = Date.now() - t0;
    if (error) throw new Error(error.message);
    checks.supabase.ok = true;
  } catch (e) {
    checks.supabase.error = e instanceof Error ? e.message : String(e);
  }

  // Leaderboard server API
  try {
    const t0 = Date.now();
    await loadLeaderboard("global");
    checks.leaderboard.ms = Date.now() - t0;
    checks.leaderboard.ok = true;
  } catch (e) {
    checks.leaderboard.error = e instanceof Error ? e.message : String(e);
  }

  const ok = Object.values(checks).every((c) => c.ok);
  return { ok, checks, timestamp: new Date().toISOString() };
}

const handler = async () => {
  const result = await runHealthCheck();
  return new Response(JSON.stringify(result, null, 2), {
    status: result.ok ? 200 : 503,
    headers: { "content-type": "application/json" },
  });
};

export const Route = createFileRoute("/api/health")({
  server: { handlers: { GET: handler } },
});
