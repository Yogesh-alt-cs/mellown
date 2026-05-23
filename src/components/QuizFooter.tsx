type Props = {
  showPrevious?: boolean;
  showNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  disableNext?: boolean;
};

export function QuizFooter({
  showPrevious = true,
  showNext = true,
  onPrevious,
  onNext,
  nextLabel = "Next Question",
  disableNext,
}: Props) {
  return (
    <footer className="sticky bottom-0 z-30 border-t-2 border-black bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl gap-3 px-4 py-4">
        {showPrevious && (
          <button
            onClick={onPrevious}
            className="brutal-press h-14 flex-1 rounded-2xl border-2 border-black bg-white font-display text-lg shadow-brutal-sm"
          >
            Previous
          </button>
        )}
        {showNext && (
          <button
            onClick={onNext}
            disabled={disableNext}
            className="brutal-press h-14 flex-[1.4] rounded-2xl border-2 border-black bg-primary font-display text-lg shadow-brutal-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {nextLabel}
          </button>
        )}
      </div>
    </footer>
  );
}
