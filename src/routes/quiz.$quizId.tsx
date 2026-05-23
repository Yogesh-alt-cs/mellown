import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { QuizHeader } from "@/components/QuizHeader";
import { QuizFooter } from "@/components/QuizFooter";
import { AnswerOption } from "@/components/AnswerOption";
import { sampleQuiz, categories } from "@/lib/quiz-data";

export const Route = createFileRoute("/quiz/$quizId")({
  head: ({ params }) => ({
    meta: [
      { title: `Play · ${params.quizId} · Delton Quiz` },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const { quizId } = Route.useParams();
  const navigate = useNavigate();
  const category = categories.find((c) => c.id === quizId) ?? categories[0];

  const questions = sampleQuiz.questions;
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [picks, setPicks] = useState<number[]>([]);
  const [seconds, setSeconds] = useState(30);

  const q = questions[index];
  const progress = ((index + (reveal ? 1 : 0)) / questions.length) * 100;

  useEffect(() => {
    if (reveal) return;
    if (seconds <= 0) {
      handleReveal(null);
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, reveal]);

  const timerLabel = useMemo(() => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [seconds]);

  function handleReveal(pickedNow: number | null) {
    setReveal(true);
    const isCorrect = pickedNow === q.correct;
    if (isCorrect) setScore((s) => s + 100);
    else setLives((l) => Math.max(0, l - 1));
    setPicks((p) => [...p, pickedNow ?? -1]);
  }

  function pick(i: number) {
    if (reveal) return;
    setPicked(i);
    handleReveal(i);
  }

  function next() {
    if (index === questions.length - 1) {
      const correctCount = picks.filter((p, i) => p === questions[i].correct).length;
      const params = new URLSearchParams({
        score: String(score),
        correct: String(correctCount),
        total: String(questions.length),
        lives: String(lives),
        category: category.name,
      });
      navigate({ to: "/results", search: Object.fromEntries(params) as never });
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
    setReveal(false);
    setSeconds(30);
  }

  function prev() {
    if (index === 0) return;
    setIndex((i) => i - 1);
    setPicked(null);
    setReveal(false);
    setSeconds(30);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <QuizHeader
        timerValue={timerLabel}
        lives={lives}
        questionIndex={index}
        total={questions.length}
      />

      <div className="border-b-2 border-black bg-white">
        <div className="mx-auto h-2 max-w-3xl bg-background">
          <div
            className="h-full border-r-2 border-black bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="flex items-center gap-2">
          <span
            className="rounded-full border-2 border-black px-3 py-1 text-xs font-bold"
            style={{ backgroundColor: category.color }}
          >
            {category.emoji} {category.name}
          </span>
          <span className="rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-bold">
            +100 pts
          </span>
          <span className="ml-auto font-display text-sm">
            Score <span className="rounded-md border-2 border-black bg-primary px-2">{score}</span>
          </span>
        </div>

        <h1 className="mt-6 font-display text-3xl leading-tight sm:text-4xl">{q.q}</h1>

        <div className="mt-8 space-y-3">
          {q.options.map((o, i) => (
            <AnswerOption
              key={i}
              index={i}
              label={o}
              selected={picked === i}
              revealed={reveal}
              correct={i === q.correct}
              onClick={() => pick(i)}
            />
          ))}
        </div>

        {reveal && (
          <div className="mt-6 rounded-2xl border-2 border-black bg-white p-5 shadow-brutal-sm">
            <div className="font-display text-sm uppercase tracking-wider text-black/60">
              Why?
            </div>
            <p className="mt-1 font-bold">{q.explanation}</p>
          </div>
        )}
      </main>

      <QuizFooter
        showPrevious={index > 0}
        onPrevious={prev}
        onNext={next}
        nextLabel={index === questions.length - 1 ? "See results" : "Next Question"}
        disableNext={!reveal}
      />
    </div>
  );
}
