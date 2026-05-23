import { Link } from "@tanstack/react-router";

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-black bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl border-2 border-black bg-primary shadow-brutal-sm">
            <span className="font-display text-lg">D</span>
          </div>
          <span className="font-display text-xl tracking-tight">Delton</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { to: "/categories", label: "Categories" },
            { to: "/leaderboards", label: "Leaderboards" },
            { to: "/convert", label: "PDF → Quiz" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-xl border-2 border-transparent px-3 py-2 font-bold hover:border-black hover:bg-white"
              activeProps={{ className: "border-black bg-white shadow-brutal-sm" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/categories"
            className="brutal-press hidden h-11 items-center rounded-2xl border-2 border-black bg-white px-4 font-display shadow-brutal-sm sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/categories"
            className="brutal-press inline-flex h-11 items-center rounded-2xl border-2 border-black bg-primary px-4 font-display shadow-brutal-sm"
          >
            Play now
          </Link>
        </div>
      </div>
    </header>
  );
}
