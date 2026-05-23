import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Trophy, Repeat, Home } from "lucide-react";

const search = z.object({
  score: z.coerce.number().int().min(0),
  correct: z.coerce.number().int().min(0),
  total: z.coerce.number().int().min(1),
  topic: z.string(),
});

export const Route = createFileRoute("/_authenticated/results")({
  validateSearch: (s) => search.parse(s),
  component: ResultsPage,
});

function ResultsPage() {
  const { score, correct, total, topic } = Route.useSearch();
  const pct = Math.round((correct / total) * 100);

  return (
    <div className="px-5 pt-12 pb-6">
      <div className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-black bg-primary shadow-brutal">
        <Trophy className="h-6 w-6" />
      </div>
      <h1 className="mt-4 font-display text-3xl">Quiz complete!</h1>
      <p className="mt-1 text-sm text-black/60">{topic}</p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat label="Score" value={score} accent />
        <Stat label="Accuracy" value={`${pct}%`} />
        <Stat label="Correct" value={`${correct}/${total}`} />
      </div>

      <div className="mt-6 rounded-2xl border-2 border-black bg-white p-4 shadow-brutal-sm">
        <div className="text-[10px] font-bold uppercase tracking-wider text-black/60">Result</div>
        <div className="mt-2 h-3 overflow-hidden rounded-full border-2 border-black bg-background">
          <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Link
          to="/create"
          className="brutal-press flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-black bg-primary font-display text-lg shadow-brutal"
        >
          <Repeat className="h-5 w-5" /> New quiz
        </Link>
        <Link
          to="/home"
          className="brutal-press flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-black bg-white font-display text-lg shadow-brutal-sm"
        >
          <Home className="h-5 w-5" /> Home
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border-2 border-black p-4 shadow-brutal-sm ${accent ? "bg-primary" : "bg-white"}`}>
      <div className="text-[10px] font-bold uppercase text-black/60">{label}</div>
      <div className="mt-1 font-display text-xl">{value}</div>
    </div>
  );
}
