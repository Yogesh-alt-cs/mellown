import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ArrowLeft, Heart, Timer, Check, X, Loader2 } from "lucide-react";
import { generateQuiz, saveQuizResult, type GeneratedQuestion } from "@/lib/quiz.functions";
import { categories } from "@/lib/categories";
import { toast } from "sonner";

const search = z.object({
  topic: z.string().optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
  count: z.coerce.number().int().min(3).max(50).optional(),
  category: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/play")({
  validateSearch: (s) => search.parse(s),
  component: PlayPage,
});

function PlayPage() {
  const { topic, difficulty, count, category } = Route.useSearch();
  const cat = category ? categories.find((c) => c.id === category) : undefined;
  const resolved = useMemo(
    () => ({
      topic: topic ?? cat?.topicSeed ?? "general knowledge",
      label: topic ?? cat?.name ?? "Quiz",
      difficulty: difficulty ?? cat?.difficulty ?? "Medium",
      count: count ?? 10,
      category: cat?.name,
    }),
    [topic, difficulty, count, cat],
  );

  const gen = useServerFn(generateQuiz);
  const save = useServerFn(saveQuizResult);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<GeneratedQuestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    gen({ data: { topic: resolved.topic, difficulty: resolved.difficulty, count: resolved.count } })
      .then((r) => { if (!cancelled) setQuestions(r.questions); })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : "Failed to generate"); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <p className="font-display text-2xl">Couldn't generate quiz</p>
          <p className="mt-2 text-sm text-black/60">{error}</p>
          <Link to="/home" className="brutal-press mt-6 inline-flex h-12 items-center rounded-2xl border-2 border-black bg-primary px-5 font-display shadow-brutal-sm">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  if (!questions) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <Loader2 className="mx-auto h-10 w-10 animate-spin" />
          <p className="mt-4 font-display text-xl">Crafting your quiz…</p>
          <p className="mt-1 text-sm text-black/60">{resolved.label} · {resolved.difficulty}</p>
        </div>
      </div>
    );
  }

  return (
    <QuizRunner
      questions={questions}
      label={resolved.label}
      category={resolved.category}
      onFinish={async (score, correct) => {
        try {
          await save({ data: { topic: resolved.label, category: resolved.category, score, correct, total: questions.length } });
        } catch (e) {
          toast.error(e instanceof Error ? e.message : "Couldn't save result");
        }
        navigate({
          to: "/results",
          search: { score, correct, total: questions.length, topic: resolved.label },
        });
      }}
    />
  );
}

function QuizRunner({
  questions,
  label,
  onFinish,
}: {
  questions: GeneratedQuestion[];
  label: string;
  category?: string;
  onFinish: (score: number, correct: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [seconds, setSeconds] = useState(30);

  const q = questions[index];
  const progress = ((index + (reveal ? 1 : 0)) / questions.length) * 100;
  const timerLabel = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  useEffect(() => {
    if (reveal) return;
    if (seconds <= 0) { handle(null); return; }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds, reveal]);

  function handle(p: number | null) {
    setPicked(p);
    setReveal(true);
    if (p === q.correct) {
      setScore((s) => s + 100);
      setCorrect((c) => c + 1);
    } else {
      setLives((l) => Math.max(0, l - 1));
    }
  }

  function next() {
    if (index === questions.length - 1 || lives === 0) {
      onFinish(score, correct);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
    setReveal(false);
    setSeconds(30);
  }

  return (
    <div className="flex min-h-screen flex-col pb-4">
      <header className="flex items-center justify-between px-5 pt-12">
        <Link to="/home" className="brutal-press grid h-11 w-11 place-items-center rounded-2xl border-2 border-black bg-white shadow-brutal-sm">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex h-11 items-center gap-1 rounded-2xl border-2 border-black bg-white px-3 shadow-brutal-sm">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart key={i} className={`h-4 w-4 ${i < lives ? "fill-red-500 text-red-500" : "text-black/20"}`} />
            ))}
          </div>
          <div className="flex h-11 items-center gap-1 rounded-2xl border-2 border-black bg-primary px-3 shadow-brutal-sm">
            <Timer className="h-4 w-4" />
            <span className="font-display tabular-nums">{timerLabel}</span>
          </div>
        </div>
      </header>

      <div className="mt-4 px-5">
        <div className="h-2 overflow-hidden rounded-full border-2 border-black bg-white">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-bold text-black/60">Q{index + 1}/{questions.length} · {label}</span>
          <span className="font-display">Score {score}</span>
        </div>
      </div>

      <main className="flex-1 px-5 pt-6">
        <h2 className="font-display text-2xl leading-tight">{q.q}</h2>
        <div className="mt-6 space-y-3">
          {q.options.map((o, i) => {
            let cls = "bg-white border-black";
            if (picked === i && !reveal) cls = "bg-primary border-black shadow-brutal-sm";
            if (reveal && i === q.correct) cls = "bg-[oklch(0.85_0.18_150)] border-black shadow-brutal-sm";
            if (reveal && picked === i && i !== q.correct) cls = "bg-[oklch(0.7_0.22_25)] border-black shadow-brutal-sm text-white";
            return (
              <button
                key={i}
                disabled={reveal}
                onClick={() => handle(i)}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all ${cls}`}
              >
                <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl border-2 border-black bg-white font-display text-sm">
                  {["A", "B", "C", "D"][i]}
                </div>
                <span className="flex-1 font-bold">{o}</span>
                {reveal && i === q.correct && <Check className="h-5 w-5" />}
                {reveal && picked === i && i !== q.correct && <X className="h-5 w-5" />}
              </button>
            );
          })}
        </div>

        {reveal && (
          <div className="mt-5 rounded-2xl border-2 border-black bg-white p-4 shadow-brutal-sm">
            <div className="text-[10px] font-bold uppercase tracking-wider text-black/60">Why?</div>
            <p className="mt-1 text-sm font-bold">{q.explanation}</p>
          </div>
        )}
      </main>

      <footer className="px-5 pt-6">
        <button
          onClick={next}
          disabled={!reveal}
          className="brutal-press flex h-14 w-full items-center justify-center rounded-2xl border-2 border-black bg-primary font-display text-lg shadow-brutal disabled:opacity-50"
        >
          {index === questions.length - 1 || lives === 0 ? "See results" : "Next question"}
        </button>
      </footer>
    </div>
  );
}
