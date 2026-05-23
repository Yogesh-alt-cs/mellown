import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "@/lib/categories";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/browse")({
  component: BrowsePage,
});

function BrowsePage() {
  return (
    <div className="px-5 pt-12 pb-6">
      <h1 className="font-display text-3xl">Browse</h1>
      <p className="mt-1 text-sm text-black/60">Pick a topic. AI builds the quiz.</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {categories.map((c) => (
          <Link
            key={c.id}
            to="/play"
            search={{ category: c.id }}
            className="brutal-press flex flex-col rounded-2xl border-2 border-black p-4 shadow-brutal-sm"
            style={{ backgroundColor: c.color }}
          >
            <div className="text-3xl">{c.emoji}</div>
            <div className="mt-2 font-display">{c.name}</div>
            <div className="text-[11px] text-black/60">{c.description}</div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-bold">
              <span>{c.difficulty}</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
