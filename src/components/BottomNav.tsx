import { Link, useLocation } from "@tanstack/react-router";
import { Home, Grid3x3, Trophy, User, Sparkles } from "lucide-react";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/browse", label: "Browse", icon: Grid3x3 },
  { to: "/create", label: "Create", icon: Sparkles, primary: true },
  { to: "/ranks", label: "Ranks", icon: Trophy },
  { to: "/me", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-black bg-background pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {tabs.map((t) => {
          const active = pathname.startsWith(t.to);
          const Icon = t.icon;
          if (t.primary) {
            return (
              <li key={t.to} className="-mt-5 flex-1">
                <Link
                  to={t.to}
                  className="brutal-press mx-auto grid h-14 w-14 place-items-center rounded-2xl border-2 border-black bg-primary shadow-brutal-sm"
                  aria-label={t.label}
                >
                  <Icon className="h-6 w-6" />
                </Link>
              </li>
            );
          }
          return (
            <li key={t.to} className="flex-1">
              <Link
                to={t.to}
                className="flex h-16 flex-col items-center justify-center gap-1"
                aria-label={t.label}
              >
                <Icon
                  className={`h-5 w-5 ${active ? "" : "text-black/40"}`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className={`text-[10px] font-bold ${active ? "" : "text-black/40"}`}>
                  {t.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
