import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "@/lib/quiz.functions";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/ranks")({
  component: RanksPage,
});

function RanksPage() {
  const fetchLb = useServerFn(getLeaderboard);
  const { data, isLoading } = useQuery({ queryKey: ["leaderboard"], queryFn: () => fetchLb() });

  return (
    <div className="px-5 pt-12 pb-6">
      <div className="flex items-center gap-2">
        <Trophy className="h-6 w-6" />
        <h1 className="font-display text-3xl">Ranks</h1>
      </div>
      <p className="mt-1 text-sm text-black/60">Top players · last 30 days</p>

      {isLoading ? (
        <div className="mt-10 grid place-items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="mt-10 rounded-2xl border-2 border-dashed border-black/40 bg-white p-8 text-center">
          <p className="font-display text-lg">No scores yet</p>
          <p className="mt-1 text-sm text-black/60">Play a quiz to land on the board.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {data.map((p, i) => (
            <div
              key={p.user_id}
              className={`flex items-center gap-3 rounded-2xl border-2 border-black p-3 shadow-brutal-sm ${
                i === 0 ? "bg-primary" : "bg-white"
              }`}
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl border-2 border-black bg-white font-display">
                {i + 1}
              </div>
              <div className="text-2xl">{p.avatar_emoji}</div>
              <div className="flex-1 truncate font-display">{p.display_name}</div>
              <div className="font-display tabular-nums">{p.score.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
