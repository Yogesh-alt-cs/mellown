import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/lib/categories";
import { getMyStats } from "@/lib/quiz.functions";
import { Flame, Trophy, Zap, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/home")({
  component: HomePage,
});

function HomePage() {
  const [name, setName] = useState("there");
  const fetchStats = useServerFn(getMyStats);
  const { data: stats } = useQuery({ queryKey: ["my-stats"], queryFn: () => fetchStats() });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const meta = data.user?.user_metadata as { display_name?: string } | undefined;
      setName(meta?.display_name ?? data.user?.email?.split("@")[0] ?? "there");
    });
  }, []);

  return (
    <div className="px-5 pt-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-black/60">Hi 👋</p>
          <h1 className="font-display text-3xl">{name}</h1>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-black bg-primary text-2xl shadow-brutal-sm">
          {stats?.profile?.avatar_emoji ?? "🎯"}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat icon={<Trophy className="h-4 w-4" />} label="Score" value={stats?.totalScore ?? 0} />
        <Stat icon={<Zap className="h-4 w-4" />} label="Played" value={stats?.totalQuizzes ?? 0} />
        <Stat icon={<Flame className="h-4 w-4" />} label="Acc." value={`${stats?.accuracy ?? 0}%`} />
      </div>

      <Link
        to="/create"
        className="brutal-press mt-6 flex items-center gap-4 rounded-3xl border-2 border-black bg-primary p-5 shadow-brutal"
      >
        <div className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-black bg-white shadow-brutal-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="font-display text-lg">AI Quiz</div>
          <div className="text-xs text-black/70">Generate a quiz on any topic</div>
        </div>
        <ArrowRight className="h-5 w-5" />
      </Link>

      <h2 className="mt-8 font-display text-xl">Quick play</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 pb-6">
        {categories.slice(0, 6).map((c) => (
          <Link
            key={c.id}
            to="/play"
            search={{ category: c.id }}
            className="brutal-press rounded-2xl border-2 border-black p-4 shadow-brutal-sm"
            style={{ backgroundColor: c.color }}
          >
            <div className="text-3xl">{c.emoji}</div>
            <div className="mt-2 font-display">{c.name}</div>
            <div className="text-[11px] text-black/60">{c.difficulty}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-black bg-white p-3 shadow-brutal-sm">
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-black/60">
        {icon} {label}
      </div>
      <div className="mt-1 font-display text-xl">{value}</div>
    </div>
  );
}
