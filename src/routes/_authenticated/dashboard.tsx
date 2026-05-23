import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getMyStats, getLeaderboard } from "@/lib/quiz.functions";
import { Trophy, Zap, Flame, Target, Calendar, BarChart3, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const fetchStats = useServerFn(getMyStats);
  const fetchLb = useServerFn(getLeaderboard);
  const { data: stats } = useQuery({ queryKey: ["my-stats"], queryFn: () => fetchStats() });
  const { data: lb } = useQuery({ queryKey: ["leaderboard"], queryFn: () => fetchLb() });

  const recent = stats?.recent ?? [];
  const favorite = (() => {
    const counts = new Map<string, number>();
    recent.forEach((r) => counts.set(r.category ?? r.topic, (counts.get(r.category ?? r.topic) ?? 0) + 1));
    let top: string | null = null; let max = 0;
    counts.forEach((v, k) => { if (v > max) { max = v; top = k; } });
    return top;
  })();

  const dailyGoal = 3;
  const today = new Date().toDateString();
  const todayCount = recent.filter((r) => new Date(r.created_at).toDateString() === today).length;
  const goalPct = Math.min(100, Math.round((todayCount / dailyGoal) * 100));

  const myRank = lb?.findIndex((p) => p.user_id && stats?.profile && p.display_name === stats.profile.display_name) ?? -1;

  return (
    <div className="px-5 pt-12 pb-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6" />
        <h1 className="font-display text-3xl">Dashboard</h1>
      </div>
      <p className="mt-1 text-sm text-black/60">Your stats at a glance</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Card label="Total XP" value={stats?.totalScore ?? 0} icon={<Trophy className="h-4 w-4" />} bg="bg-primary" />
        <Card label="Quizzes" value={stats?.totalQuizzes ?? 0} icon={<Zap className="h-4 w-4" />} bg="bg-white" />
        <Card label="Accuracy" value={`${stats?.accuracy ?? 0}%`} icon={<Flame className="h-4 w-4" />} bg="bg-[#A6F0C6]" />
        <Card label="Rank" value={myRank >= 0 ? `#${myRank + 1}` : "—"} icon={<Target className="h-4 w-4" />} bg="bg-[#FFD1DC]" />
      </div>

      <div className="mt-5 rounded-3xl border-2 border-black bg-white p-5 shadow-brutal-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase text-black/60">Daily goal</div>
            <div className="mt-1 font-display text-xl">{todayCount} / {dailyGoal} quizzes</div>
          </div>
          <Calendar className="h-6 w-6" />
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full border-2 border-black bg-background">
          <div className="h-full bg-primary transition-all" style={{ width: `${goalPct}%` }} />
        </div>
      </div>

      <div className="mt-5 rounded-3xl border-2 border-black bg-[#FCD9A8] p-5 shadow-brutal-sm">
        <div className="text-[10px] font-bold uppercase text-black/60">Favorite topic</div>
        <div className="mt-1 font-display text-xl">{favorite ?? "Play more to discover!"}</div>
      </div>

      <h2 className="mt-8 font-display text-lg">Recent quizzes</h2>
      <div className="mt-3 space-y-2">
        {recent.length === 0 ? (
          <Link to="/browse" className="brutal-press flex items-center justify-between rounded-2xl border-2 border-dashed border-black/40 bg-white p-5 text-left">
            <div>
              <div className="font-display">No quizzes yet</div>
              <div className="text-sm text-black/60">Play one to see stats!</div>
            </div>
            <ArrowRight className="h-5 w-5" />
          </Link>
        ) : (
          recent.slice(0, 6).map((r, i) => (
            <div key={i} className="flex items-center justify-between rounded-2xl border-2 border-black bg-white p-3 shadow-brutal-sm">
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold">{r.topic}</div>
                <div className="text-[11px] text-black/60">{r.correct}/{r.total} correct · {new Date(r.created_at).toLocaleDateString()}</div>
              </div>
              <div className="rounded-lg border-2 border-black bg-primary px-2 py-1 font-display text-sm">+{r.score}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Card({ label, value, icon, bg }: { label: string; value: React.ReactNode; icon: React.ReactNode; bg: string }) {
  return (
    <div className={`rounded-2xl border-2 border-black p-4 shadow-brutal-sm ${bg}`}>
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-black/70">{icon}{label}</div>
      <div className="mt-1 font-display text-2xl">{value}</div>
    </div>
  );
}
