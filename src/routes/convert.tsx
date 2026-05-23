import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { FileUp, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/convert")({
  head: () => ({
    meta: [
      { title: "PDF → Quiz · Delton Quiz" },
      { name: "description", content: "Turn any PDF into a playable quiz in seconds." },
    ],
  }),
  component: ConvertPage,
});

function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);

  return (
    <div className="min-h-screen">
      <NavBar />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-1 font-bold shadow-brutal-sm">
          <Sparkles className="h-4 w-4" /> <span className="text-sm">AI-powered</span>
        </div>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">PDF → Quiz</h1>
        <p className="mt-3 max-w-xl text-black/70">
          Upload your notes, slides or textbooks. We extract the key concepts and turn them into a polished quiz you can play, share or save.
        </p>

        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const f = e.dataTransfer.files?.[0];
            if (f) setFile(f);
          }}
          className={`brutal-press mt-10 block cursor-pointer rounded-[32px] border-2 border-dashed border-black bg-white p-12 text-center shadow-brutal ${
            drag ? "bg-primary" : ""
          }`}
        >
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border-2 border-black bg-primary shadow-brutal-sm">
            <FileUp className="h-7 w-7" />
          </div>
          <p className="mt-5 font-display text-2xl">
            {file ? file.name : "Drop your PDF here"}
          </p>
          <p className="text-sm text-black/60">or click to browse — up to 20MB</p>
        </label>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { n: "1", t: "Upload", d: "Drop a PDF up to 20MB." },
            { n: "2", t: "AI extract", d: "We pull key concepts & questions." },
            { n: "3", t: "Play & share", d: "Save to library or send to friends." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border-2 border-black bg-background p-5 shadow-brutal-sm">
              <div className="grid h-10 w-10 place-items-center rounded-xl border-2 border-black bg-white font-display">
                {s.n}
              </div>
              <div className="mt-3 font-display text-lg">{s.t}</div>
              <div className="text-sm text-black/70">{s.d}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <button
            disabled={!file}
            className="brutal-press inline-flex h-14 items-center gap-2 rounded-2xl border-2 border-black bg-primary px-6 font-display text-lg shadow-brutal disabled:opacity-50"
          >
            Generate quiz <ArrowRight className="h-5 w-5" />
          </button>
          <Link
            to="/categories"
            className="brutal-press inline-flex h-14 items-center rounded-2xl border-2 border-black bg-white px-6 font-display text-lg shadow-brutal-sm"
          >
            Browse categories
          </Link>
        </div>
      </section>
    </div>
  );
}
