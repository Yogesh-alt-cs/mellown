import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getMyStats } from "@/lib/quiz.functions";
import { LogOut, Trophy, Zap, Flame } from "lucide-react";

export const Route = createFileRoute("/_authenticated/me")({
  component: MePage,
});

function MePage() {
  const navigate = useNavigate();
  const fetchStats = useServerFn(getMyStats);
  const { data: stats } = useQuery({ queryKey: ["my-stats"], queryFn: () => fetchStats() });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <div className="px-5 pt-12 pb-6">
      <h1 className="font-display text-3xl">Profile</h1>

      <div className="mt-6 rounded-3xl border-2 border-black bg-white p-6 shadow-brutal">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-black bg-primary text-3xl shadow-brutal-sm">
            {stats?.profile?.avatar_emoji ?? "🎯"}
          </div>
          <div>
            <div className="font-display text-xl">{stats?.profile?.display_name ?? "Player"}</div>
            <div className="text-xs text-black/60">{stats?.totalQuizzes ?? 0} quizzes played</div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat icon={<Trophy className="h-4 w-4" />} label="Score" value={stats?.totalScore ?? 0} />
          <Stat icon={<Zap className="h-4 w-4" />} label="Played" value={stats?.totalQuizzes ?? 0} />
          <Stat icon={<Flame className="h-4 w-4" />} label="Acc." value={`${stats?.accuracy ?? 0}%`} />
        </div>
      </div>

      <h2 className="mt-8 font-display text-lg">Recent quizzes</h2>
      <div className="mt-3 space-y-2">
        {(stats?.recent ?? []).length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-black/40 p-6 text-center text-sm text-black/60">
            No quizzes yet — go play one!
          </div>
        ) : (
          stats!.recent.map((r, i) => (
            <div key={i} className="flex items-center justify-between rounded-2xl border-2 border-black bg-white p-3 shadow-brutal-sm">
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold">{r.topic}</div>
                <div className="text-[11px] text-black/60">{r.correct}/{r.total} correct</div>
              </div>
              <div className="rounded-lg border-2 border-black bg-primary px-2 py-1 font-display text-sm">+{r.score}</div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={signOut}
        className="brutal-press mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-black bg-white font-display shadow-brutal-sm"
      >
        <LogOut className="h-5 w-5" /> Sign out
      </button>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-black bg-background p-3">
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-black/60">
        {icon} {label}
      </div>
      <div className="mt-1 font-display text-lg">{value}</div>
    </div>
  );
}
