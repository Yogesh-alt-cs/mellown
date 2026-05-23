import { Check, X } from "lucide-react";

type Props = {
  label: string;
  index: number;
  selected?: boolean;
  revealed?: boolean;
  correct?: boolean;
  onClick?: () => void;
};

const letters = ["A", "B", "C", "D", "E"];

export function AnswerOption({ label, index, selected, revealed, correct, onClick }: Props) {
  let state =
    "bg-white border-black hover:-translate-y-0.5 hover:shadow-brutal-sm";
  if (selected && !revealed) state = "bg-primary border-black shadow-brutal-sm";
  if (revealed && correct) state = "bg-[oklch(0.85_0.18_150)] border-black shadow-brutal-sm";
  if (revealed && selected && !correct) state = "bg-[oklch(0.78_0.2_25)] border-black shadow-brutal-sm text-white";

  return (
    <button
      onClick={onClick}
      disabled={revealed}
      className={`flex w-full items-center gap-4 rounded-3xl border-2 p-4 text-left transition-all ${state}`}
    >
      <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl border-2 border-black bg-white font-display">
        {letters[index]}
      </div>
      <span className="flex-1 text-base font-bold sm:text-lg">{label}</span>
      {revealed && correct && <Check className="h-5 w-5" />}
      {revealed && selected && !correct && <X className="h-5 w-5" />}
    </button>
  );
}
