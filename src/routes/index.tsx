import { createFileRoute, Link } from "@tanstack/react-router";
import { NavBar } from "@/components/NavBar";
import { categories, leaderboard } from "@/lib/quiz-data";
import { ArrowRight, Sparkles, Trophy, Zap, FileUp, Heart } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Delton Quiz — Gamified learning that actually sticks" },
      {
        name: "description",
        content:
          "Lives, streaks and leaderboards. Play short, addictive quizzes across Engineering, Anime, General Knowledge and more. Turn any PDF into a quiz in seconds.",
      },
      { property: "og:title", content: "Delton Quiz" },
      {
        property: "og:description",
        content: "Gamified quizzes with lives, streaks and leaderboards.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <Hero />
      <Marquee />
      <Features />
      <CategoryStrip />
      <LeaderboardPreview />
      <PdfCta />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b-2 border-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-12 md:py-24">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-1 font-bold shadow-brutal-sm">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm">Now with PDF → Quiz</span>
          </div>
          <h1 className="mt-6 font-display text-5xl leading-[0.95] sm:text-7xl md:text-[88px]">
            Learn like
            <br />
            it's a <span className="rounded-2xl border-2 border-black bg-primary px-3 py-1 shadow-brutal">game</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-black/70">
            Delton turns dry study material into addictive, bite-sized quizzes with lives, streaks and global leaderboards. 5 lives. 1 mission. Climb the ranks.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/categories"
              className="brutal-press inline-flex h-14 items-center gap-2 rounded-2xl border-2 border-black bg-primary px-6 font-display text-lg shadow-brutal"
            >
              Start playing <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/convert"
              className="brutal-press inline-flex h-14 items-center gap-2 rounded-2xl border-2 border-black bg-white px-6 font-display text-lg shadow-brutal"
            >
              <FileUp className="h-5 w-5" /> Upload a PDF
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-6">
            {[
              { k: "240k+", v: "Quizzes played" },
              { k: "1,800+", v: "Questions available" },
              { k: "98%", v: "Come back daily" },
            ].map((s) => (
              <div key={s.v}>
                <div className="font-display text-3xl">{s.k}</div>
                <div className="text-sm text-black/60">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative md:col-span-5">
          <HeroCard />
        </div>
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -left-6 -top-6 h-20 w-20 rotate-12 rounded-2xl border-2 border-black bg-primary shadow-brutal animate-float-slow grid place-items-center text-3xl">
        🎯
      </div>
      <div className="absolute -bottom-8 -right-4 h-24 w-24 -rotate-6 rounded-2xl border-2 border-black bg-white shadow-brutal animate-float-slow grid place-items-center text-4xl" style={{ animationDelay: "1.5s" }}>
        🧠
      </div>

      <div className="rounded-[32px] border-2 border-black bg-white p-6 shadow-brutal-lg">
        <div className="flex items-center justify-between">
          <span className="rounded-full border-2 border-black bg-primary px-3 py-1 text-xs font-bold">QUESTION 3 / 5</span>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
          </div>
        </div>
        <h3 className="mt-5 font-display text-2xl leading-tight">
          Which planet is known as the Red Planet?
        </h3>
        <div className="mt-5 space-y-3">
          {[
            { l: "Venus", s: "" },
            { l: "Mars", s: "correct" },
            { l: "Jupiter", s: "" },
          ].map((o, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-2xl border-2 border-black p-3 ${
                o.s === "correct" ? "bg-primary shadow-brutal-sm" : "bg-white"
              }`}
            >
              <div className="grid h-8 w-8 place-items-center rounded-lg border-2 border-black bg-white font-display text-sm">
                {["A", "B", "C"][i]}
              </div>
              <span className="font-bold">{o.l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Marquee() {
  const items = ["⚡ STREAKS", "🏆 LEADERBOARDS", "❤️ LIVES", "🎯 LEVELS", "🔥 DAILY CHALLENGES", "📚 PDF → QUIZ"];
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-b-2 border-black bg-black py-4 text-white">
      <div className="flex w-max gap-12 animate-marquee whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="font-display text-xl">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Features() {
  const items = [
    { i: <Heart className="h-6 w-6" />, t: "Lives system", d: "3-5 lives per session keeps stakes high and sessions short." },
    { i: <Zap className="h-6 w-6" />, t: "Streaks & combos", d: "Chain correct answers for bonus points and badges." },
    { i: <Trophy className="h-6 w-6" />, t: "Global ranks", d: "Weekly resets, category boards and friend challenges." },
    { i: <FileUp className="h-6 w-6" />, t: "PDF → Quiz", d: "Upload a doc, get a polished quiz in under a minute." },
  ];
  return (
    <section className="border-b-2 border-black bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl sm:text-5xl">Built to be addictive (the good way).</h2>
          <p className="mt-3 text-black/70">Game mechanics that make learning feel like leveling up.</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((f) => (
            <div key={f.t} className="rounded-2xl border-2 border-black bg-background p-6 shadow-brutal-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl border-2 border-black bg-primary">{f.i}</div>
              <h3 className="mt-4 font-display text-xl">{f.t}</h3>
              <p className="mt-2 text-sm text-black/70">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryStrip() {
  return (
    <section className="border-b-2 border-black">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl sm:text-5xl">Pick your battlefield.</h2>
          <Link to="/categories" className="font-display underline underline-offset-4">
            See all categories →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 6).map((c, i) => (
            <Link
              key={c.id}
              to="/quiz/$quizId"
              params={{ quizId: c.id }}
              className={`brutal-press group rounded-3xl border-2 border-black p-6 shadow-brutal ${
                i % 2 === 0 ? "bg-white" : "bg-background"
              }`}
              style={{ backgroundColor: c.color }}
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl">{c.emoji}</span>
                <span className="rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-bold">{c.difficulty}</span>
              </div>
              <h3 className="mt-6 font-display text-2xl">{c.name}</h3>
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
      </div>
    </section>
  );
}

function LeaderboardPreview() {
  return (
    <section className="border-b-2 border-black bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
        <div>
          <h2 className="font-display text-4xl sm:text-5xl">Climb the ladder.</h2>
          <p className="mt-3 max-w-md text-black/70">
            Top performers earn weekly badges, exclusive avatar frames and bragging rights. Resets every Monday at 00:00 UTC.
          </p>
          <Link
            to="/leaderboards"
            className="brutal-press mt-6 inline-flex h-12 items-center gap-2 rounded-2xl border-2 border-black bg-primary px-5 font-display shadow-brutal-sm"
          >
            <Trophy className="h-5 w-5" /> View leaderboards
          </Link>
        </div>
        <div className="rounded-3xl border-2 border-black bg-background p-2 shadow-brutal">
          {leaderboard.slice(0, 5).map((p) => (
            <div
              key={p.rank}
              className="flex items-center gap-4 rounded-2xl border-2 border-transparent p-3 hover:border-black hover:bg-white"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl border-2 border-black bg-white font-display">
                {p.rank}
              </div>
              <div className="text-2xl">{p.emoji}</div>
              <div className="flex-1">
                <div className="font-display">{p.name}</div>
                <div className="text-xs text-black/60">🔥 {p.streak} day streak</div>
              </div>
              <div className="font-display tabular-nums">{p.score.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PdfCta() {
  return (
    <section className="border-b-2 border-black">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="rounded-[32px] border-2 border-black bg-primary p-10 shadow-brutal-lg sm:p-14">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl">Drop a PDF. Get a quiz.</h2>
              <p className="mt-3 max-w-md text-black/80">
                Lecture notes, textbooks, study guides — our AI turns them into ready-to-play quizzes you can share or save.
              </p>
              <Link
                to="/convert"
                className="brutal-press mt-6 inline-flex h-14 items-center gap-2 rounded-2xl border-2 border-black bg-white px-6 font-display text-lg shadow-brutal-sm"
              >
                <FileUp className="h-5 w-5" /> Try it free
              </Link>
            </div>
            <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-brutal-sm">
              <div className="rounded-xl border-2 border-dashed border-black/40 p-8 text-center">
                <FileUp className="mx-auto h-10 w-10" />
                <p className="mt-3 font-display text-lg">Drop your PDF here</p>
                <p className="text-sm text-black/60">or click to browse — up to 20MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl border-2 border-white bg-primary text-black font-display">
            D
          </div>
          <span className="font-display text-xl">Delton Quiz</span>
        </div>
        <p className="text-sm text-white/60">© {new Date().getFullYear()} Delton. Learn loudly.</p>
      </div>
    </footer>
  );
}
