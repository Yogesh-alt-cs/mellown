import { createFileRoute, Link } from "@tanstack/react-router";
import { NavBar } from "@/components/NavBar";
import { categories } from "@/lib/quiz-data";
import { Search, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories · Delton Quiz" },
      { name: "description", content: "Pick a quiz category and start playing." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <section className="border-b-2 border-black">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h1 className="font-display text-5xl sm:text-6xl">Categories</h1>
          <p className="mt-3 max-w-xl text-black/70">
            Choose a topic. 5 lives. Climb the boards.
          </p>
          <div className="mt-8 flex h-14 items-center gap-3 rounded-2xl border-2 border-black bg-white px-4 shadow-brutal-sm">
            <Search className="h-5 w-5" />
            <input
              placeholder="Search categories…"
              className="h-full flex-1 bg-transparent font-bold outline-none placeholder:text-black/40"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/quiz/$quizId"
              params={{ quizId: c.id }}
              className="brutal-press group rounded-3xl border-2 border-black p-6 shadow-brutal"
              style={{ backgroundColor: c.color }}
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl">{c.emoji}</span>
                <span className="rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-bold">
                  {c.difficulty}
                </span>
              </div>
              <h2 className="mt-6 font-display text-2xl">{c.name}</h2>
              <p className="mt-1 text-sm text-black/70">{c.description}</p>
              <div className="mt-5 flex items-center justify-between text-sm font-bold">
                <span>{c.quizzes} quizzes</span>
                <span className="inline-flex items-center gap-1">
                  Play <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
