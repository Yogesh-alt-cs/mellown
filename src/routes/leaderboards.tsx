import { createFileRoute } from "@tanstack/react-router";
import { NavBar } from "@/components/NavBar";
import { leaderboard } from "@/lib/quiz-data";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/leaderboards")({
  head: () => ({
    meta: [
      { title: "Leaderboards · Delton Quiz" },
      { name: "description", content: "See the top players this week." },
    ],
  }),
  component: Leaderboards,
});

function Leaderboards() {
  const [first, second, third, ...rest] = leaderboard;
  return (
    <div className="min-h-screen">
      <NavBar />
      <section className="border-b-2 border-black">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex items-center gap-3">
            <Trophy className="h-7 w-7" />
            <h1 className="font-display text-5xl sm:text-6xl">Leaderboards</h1>
          </div>
          <p className="mt-3 text-black/70">Weekly rankings · resets every Monday</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid items-end gap-4 sm:grid-cols-3">
          <Podium player={second} place={2} height="h-44" bg="bg-white" />
          <Podium player={first} place={1} height="h-56" bg="bg-primary" crown />
          <Podium player={third} place={3} height="h-36" bg="bg-white" />
        </div>

        <div className="mt-10 rounded-3xl border-2 border-black bg-white p-2 shadow-brutal">
          {rest.map((p) => (
            <div
              key={p.rank}
              className="flex items-center gap-4 rounded-2xl border-2 border-transparent p-3 hover:border-black hover:bg-background"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl border-2 border-black bg-background font-display">
                {p.rank}
              </div>
              <div className="text-2xl">{p.emoji}</div>
              <div className="flex-1">
                <div className="font-display">{p.name}</div>
                <div className="text-xs text-black/60">🔥 {p.streak} day streak</div>
              </div>
              <div className="font-display tabular-nums">{p.score.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Podium({
  player,
  place,
  height,
  bg,
  crown,
}: {
  player: (typeof leaderboard)[number];
  place: number;
  height: string;
  bg: string;
  crown?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {crown && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl">👑</div>}
        <div className="grid h-20 w-20 place-items-center rounded-3xl border-2 border-black bg-white text-4xl shadow-brutal-sm">
          {player.emoji}
        </div>
      </div>
      <div className="mt-3 font-display text-lg">{player.name}</div>
      <div className="text-sm text-black/60">{player.score.toLocaleString()} pts</div>
      <div
        className={`mt-3 grid w-full place-items-center rounded-t-2xl border-2 border-black font-display text-4xl shadow-brutal ${bg} ${height}`}
      >
        #{place}
      </div>
    </div>
  );
}
