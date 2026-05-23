import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/create")({
  component: CreatePage,
});

const suggestions = ["World capitals", "Greek mythology", "Star Wars trivia", "Python basics", "90s pop music", "Football World Cup"];
const COUNTS = [10, 20, 30, 50] as const;

function CreatePage() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [count, setCount] = useState<number>(10);

  function start() {
    const t = topic.trim();
    if (!t) return;
    navigate({ to: "/play", search: { topic: t, difficulty, count } });
  }

  return (
    <div className="px-5 pt-12 pb-6">
      <div className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-black bg-primary shadow-brutal-sm">
        <Sparkles className="h-5 w-5" />
      </div>
      <h1 className="mt-4 font-display text-3xl">Custom AI Quiz</h1>
      <p className="mt-1 text-sm text-black/60">Type any topic. We'll generate questions instantly.</p>

      <label className="mt-6 block">
        <span className="text-xs font-bold uppercase text-black/60">Topic</span>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. The Solar System"
          className="mt-1 h-14 w-full rounded-2xl border-2 border-black bg-white px-4 font-bold shadow-brutal-sm outline-none placeholder:text-black/40"
        />
      </label>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setTopic(s)}
            className="rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-bold shadow-brutal-sm active:translate-y-0.5"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <span className="text-xs font-bold uppercase text-black/60">Difficulty</span>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(["Easy", "Medium", "Hard"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`h-12 rounded-2xl border-2 border-black font-display shadow-brutal-sm transition-all ${
                difficulty === d ? "bg-primary" : "bg-white"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <span className="text-xs font-bold uppercase text-black/60">Questions</span>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {COUNTS.map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`h-14 rounded-2xl border-2 border-black font-display text-lg shadow-brutal-sm transition-all ${
                count === n ? "bg-primary" : "bg-white"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={start}
        disabled={!topic.trim()}
        className="brutal-press mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-black bg-primary font-display text-lg shadow-brutal disabled:opacity-50"
      >
        Generate quiz <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}
