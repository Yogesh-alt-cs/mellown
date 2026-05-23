import { Link } from "@tanstack/react-router";
import { ArrowLeft, Timer, Heart } from "lucide-react";

type Props = {
  backHref?: string;
  timerValue?: string;
  lives?: number;
  questionIndex?: number;
  total?: number;
};

export function QuizHeader({
  backHref = "/categories",
  timerValue = "14:30",
  lives = 3,
  questionIndex,
  total,
}: Props) {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-black bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4">
        <Link
          to={backHref}
          className="brutal-press grid h-11 w-11 place-items-center rounded-2xl border-2 border-black bg-white shadow-brutal-sm"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        {questionIndex !== undefined && total !== undefined && (
          <div className="font-display text-sm">
            Q{questionIndex + 1}
            <span className="text-black/50">/{total}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex h-11 items-center gap-1 rounded-2xl border-2 border-black bg-white px-3 shadow-brutal-sm">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`h-4 w-4 ${i < lives ? "fill-red-500 text-red-500" : "text-black/20"}`}
              />
            ))}
          </div>
          <div className="flex h-11 items-center gap-2 rounded-2xl border-2 border-black bg-primary px-3 shadow-brutal-sm">
            <Timer className="h-4 w-4" />
            <span className="font-display tabular-nums">{timerValue}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
