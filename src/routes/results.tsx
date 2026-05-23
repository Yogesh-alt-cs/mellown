import { createFileRoute, Link } from "@tanstack/react-router";
import { NavBar } from "@/components/NavBar";
import { Trophy, Repeat, Share2, Home } from "lucide-react";

type Search = {
  score?: string;
  correct?: string;
  total?: string;
  lives?: string;
  category?: string;
};

export const Route = createFileRoute("/results")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    score: s.score as string,
    correct: s.correct as string,
    total: s.total as string,
    lives: s.lives as string,
    category: s.category as string,
  }),
  head: () => ({ meta: [{ title: "Your results · Delton Quiz" }] }),
  component: ResultsPage,
});

function ResultsPage() {
  const { score = "0", correct = "0", total = "0", lives = "0", category = "Quiz" } =
    Route.useSearch();
  const correctN = Number(correct);
  const totalN = Number(total) || 1;
  const pct = Math.round((correctN / totalN) * 100);

  return (
    <div className="min-h-screen">
      <NavBar />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-[32px] border-2 border-black bg-white p-8 shadow-brutal-lg sm:p-12">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-black bg-primary shadow-brutal-sm">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-black/60">{category}</div>
              <h1 className="font-display text-3xl">Quiz complete!</h1>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat label="Score" value={score} accent />
            <Stat label="Accuracy" value={`${pct}%`} />
            <Stat label="Lives left" value={`${lives} / 3`} />
          </div>

          <div className="mt-8 rounded-2xl border-2 border-black bg-background p-5">
            <div className="font-display text-sm uppercase tracking-wider">Breakdown</div>
            <div className="mt-3 flex h-3 overflow-hidden rounded-full border-2 border-black bg-white">
              <div
                className="h-full border-r-2 border-black bg-primary"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-black/70">
              You got <span className="font-display">{correctN}</span> out of {totalN} correct.
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/categories"
              className="brutal-press inline-flex h-14 items-center gap-2 rounded-2xl border-2 border-black bg-primary px-5 font-display text-lg shadow-brutal-sm"
            >
              <Repeat className="h-5 w-5" /> Play another
            </Link>
            <button className="brutal-press inline-flex h-14 items-center gap-2 rounded-2xl border-2 border-black bg-white px-5 font-display text-lg shadow-brutal-sm">
              <Share2 className="h-5 w-5" /> Share
            </button>
            <Link
              to="/"
              className="brutal-press inline-flex h-14 items-center gap-2 rounded-2xl border-2 border-black bg-white px-5 font-display text-lg shadow-brutal-sm"
            >
              <Home className="h-5 w-5" /> Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-2xl border-2 border-black p-5 shadow-brutal-sm ${
        accent ? "bg-primary" : "bg-background"
      }`}
    >
      <div className="text-xs font-bold uppercase tracking-wider text-black/60">{label}</div>
      <div className="mt-1 font-display text-3xl">{value}</div>
    </div>
  );
}
