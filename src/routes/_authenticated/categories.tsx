import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { categories, categoryGroups, type Category } from "@/lib/categories";
import { Search, X, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/categories")({
  component: BrowsePage,
});

const COUNTS = [10, 20, 30, 50] as const;

function BrowsePage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string>("All");
  const [picked, setPicked] = useState<Category | null>(null);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [count, setCount] = useState<number>(10);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return categories.filter((c) =>
      (active === "All" || c.group === active) &&
      (!term || c.name.toLowerCase().includes(term) || c.description.toLowerCase().includes(term)),
    );
  }, [q, active]);

  function open(c: Category) {
    setPicked(c);
    setDifficulty(c.difficulty);
    setCount(10);
  }

  function start() {
    if (!picked) return;
    navigate({ to: "/play", search: { category: picked.id, difficulty, count } });
  }

  return (
    <div className="px-5 pt-12 pb-6">
      <h1 className="font-display text-3xl">Categories</h1>
      <p className="mt-1 text-sm text-black/60">Tap a topic. AI builds the quiz.</p>

      <label className="mt-5 flex h-12 items-center gap-2 rounded-2xl border-2 border-black bg-white px-3 shadow-brutal-sm">
        <Search className="h-4 w-4" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search categories…"
          className="h-full flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-black/40"
        />
      </label>

      <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1" style={{ scrollbarWidth: "none" }}>
        {["All", ...categoryGroups].map((g) => (
          <button
            key={g}
            onClick={() => setActive(g)}
            className={`shrink-0 rounded-full border-2 border-black px-4 py-1.5 text-xs font-bold shadow-brutal-sm transition-all ${
              active === g ? "bg-primary" : "bg-white"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => open(c)}
            className="brutal-press relative flex flex-col overflow-hidden rounded-2xl border-2 border-black p-4 text-left shadow-brutal-sm"
            style={{ backgroundColor: c.color }}
          >
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/40" />
            <div className="relative text-3xl">{c.emoji}</div>
            <div className="relative mt-2 font-display leading-tight">{c.name}</div>
            <div className="relative text-[11px] text-black/60">{c.description}</div>
            <div className="relative mt-3 flex items-center justify-between text-[11px] font-bold">
              <span>{c.difficulty}</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-2xl border-2 border-dashed border-black/40 p-8 text-center text-sm text-black/60">
          No categories match.
        </div>
      )}

      {picked && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 animate-in fade-in" onClick={() => setPicked(null)}>
          <div
            className="w-full max-w-md rounded-3xl border-2 border-black bg-background p-5 shadow-brutal animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-black text-2xl shadow-brutal-sm" style={{ backgroundColor: picked.color }}>
                  {picked.emoji}
                </div>
                <div>
                  <div className="font-display text-xl">{picked.name}</div>
                  <div className="text-xs text-black/60">{picked.description}</div>
                </div>
              </div>
              <button onClick={() => setPicked(null)} className="grid h-9 w-9 place-items-center rounded-xl border-2 border-black bg-white shadow-brutal-sm">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5">
              <span className="text-[10px] font-bold uppercase text-black/60">Difficulty</span>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(["Easy", "Medium", "Hard"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`h-11 rounded-2xl border-2 border-black font-display text-sm shadow-brutal-sm ${
                      difficulty === d ? "bg-primary" : "bg-white"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <span className="text-[10px] font-bold uppercase text-black/60">Questions</span>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={`h-11 rounded-2xl border-2 border-black font-display shadow-brutal-sm ${
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
              className="brutal-press mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-black bg-primary font-display text-lg shadow-brutal"
            >
              Start quiz <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
