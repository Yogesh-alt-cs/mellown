import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMyStats, getLeaderboard } from "@/lib/quiz.functions";
import { Trophy, Zap, Flame, Target, Calendar, BarChart3, ArrowRight, Medal, Crown } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

type TopTab = "dashboard" | "leaderboard";
type LbTab = "global" | "weekly" | "friends";

function DashboardPage() {
  const [tab, setTab] = useState<TopTab>("dashboard");

  return (
    <div className="px-5 pt-12 pb-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6" />
        <h1 className="font-display text-3xl">{tab === "dashboard" ? "Dashboard" : "Leaderboard"}</h1>
      </div>
      <p className="mt-1 text-sm text-black/60">
        {tab === "dashboard" ? "Your stats at a glance" : "See how you rank against others"}
      </p>

      {/* Segmented toggle */}
      <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl border-2 border-black bg-white p-1 shadow-brutal-sm">
        {(["dashboard", "leaderboard"] as TopTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`h-11 rounded-xl font-display text-sm capitalize transition-all ${
              tab === t ? "bg-primary border-2 border-black shadow-brutal-sm" : "text-black/60"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "dashboard" ? <DashboardView /> : <LeaderboardView />}
      </div>
    </div>
  );
}

function DashboardView() {
  const fetchStats = useServerFn(getMyStats);
  const { data: stats } = useQuery({ queryKey: ["my-stats"], queryFn: () => fetchStats() });

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

  // streak: consecutive days played counting back from today
  const streak = (() => {
    if (recent.length === 0) return 0;
    const days = new Set(recent.map((r) => new Date(r.created_at).toDateString()));
    let s = 0;
    const d = new Date();
    while (days.has(d.toDateString())) { s++; d.setDate(d.getDate() - 1); }
    return s;
  })();

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Card label="Total XP" value={stats?.totalScore ?? 0} icon={<Trophy className="h-4 w-4" />} bg="bg-primary" />
        <Card label="Quizzes" value={stats?.totalQuizzes ?? 0} icon={<Zap className="h-4 w-4" />} bg="bg-white" />
        <Card label="Accuracy" value={`${stats?.accuracy ?? 0}%`} icon={<Flame className="h-4 w-4" />} bg="bg-[#A6F0C6]" />
        <Card label="Streak" value={`${streak}d`} icon={<Target className="h-4 w-4" />} bg="bg-[#FFD1DC]" />
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
    </>
  );
}

function LeaderboardView() {
  const [lbTab, setLbTab] = useState<LbTab>("global");
  const fetchLb = useServerFn(getLeaderboard);
  const fetchStats = useServerFn(getMyStats);
  const { data: lb, isLoading } = useQuery({ queryKey: ["leaderboard"], queryFn: () => fetchLb() });
  const { data: stats } = useQuery({ queryKey: ["my-stats"], queryFn: () => fetchStats() });

  const myName = stats?.profile?.display_name;

  return (
    <>
      <div className="grid grid-cols-3 gap-1 rounded-2xl border-2 border-black bg-white p-1 shadow-brutal-sm">
        {(["global", "weekly", "friends"] as LbTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setLbTab(t)}
            className={`h-10 rounded-xl text-xs font-display capitalize transition-all ${
              lbTab === t ? "bg-primary border-2 border-black" : "text-black/60"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {lbTab === "friends" ? (
        <div className="mt-10 rounded-3xl border-2 border-dashed border-black/40 bg-white p-8 text-center">
          <div className="text-5xl">🤝</div>
          <p className="mt-3 font-display text-lg">Friends leaderboard coming soon</p>
          <p className="mt-1 text-sm text-black/60">Invite friends and race head-to-head.</p>
        </div>
      ) : isLoading ? (
        <div className="mt-10 grid place-items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
        </div>
      ) : !lb || lb.length === 0 ? (
        <div className="mt-10 rounded-3xl border-2 border-dashed border-black/40 bg-white p-8 text-center">
          <p className="font-display text-lg">No scores yet</p>
          <p className="mt-1 text-sm text-black/60">Play a quiz to land on the board.</p>
        </div>
      ) : (
        <>
          {/* Podium top 3 */}
          <div className="mt-5 grid grid-cols-3 items-end gap-2">
            {[1, 0, 2].map((rank) => {
              const p = lb[rank];
              if (!p) return <div key={rank} />;
              const heights = ["h-24", "h-28", "h-20"];
              const colors = ["bg-[#E5E5E5]", "bg-primary", "bg-[#FCD9A8]"];
              const medals = ["🥈", "🥇", "🥉"];
              const order = rank === 0 ? 1 : rank === 1 ? 0 : 2;
              return (
                <div key={p.user_id} className="flex flex-col items-center">
                  <div className="text-3xl">{medals[order]}</div>
                  <div className="text-3xl">{p.avatar_emoji}</div>
                  <div className="mt-1 max-w-full truncate text-center text-xs font-bold">{p.display_name}</div>
                  <div className={`mt-1 w-full ${heights[order]} ${colors[order]} flex items-center justify-center rounded-t-2xl border-2 border-black shadow-brutal-sm`}>
                    <div className="text-center">
                      <div className="font-display text-lg leading-none">#{rank + 1}</div>
                      <div className="text-[10px] font-bold">{p.score.toLocaleString()} XP</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rest of rankings */}
          <div className="mt-5 space-y-2">
            {lb.slice(3).map((p, i) => {
              const rank = i + 4;
              const me = myName && p.display_name === myName;
              return (
                <div
                  key={p.user_id}
                  className={`flex items-center gap-3 rounded-2xl border-2 border-black p-3 shadow-brutal-sm ${me ? "bg-primary" : "bg-white"}`}
                >
                  <div className="grid h-9 w-9 place-items-center rounded-xl border-2 border-black bg-background font-display text-sm">
                    {rank}
                  </div>
                  <div className="text-2xl">{p.avatar_emoji}</div>
                  <div className="min-w-0 flex-1 truncate font-display">
                    {p.display_name} {me && <span className="text-[10px] font-bold uppercase">· you</span>}
                  </div>
                  <div className="font-display tabular-nums">{p.score.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
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

// silence unused
void Medal; void Crown;
