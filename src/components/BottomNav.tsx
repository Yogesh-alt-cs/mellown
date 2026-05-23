import { Link, useLocation } from "@tanstack/react-router";
import { Home, LayoutGrid, BarChart3, Users, User } from "lucide-react";

type Tab = { to: string; label: string; icon: typeof Home };
const tabs: Tab[] = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/browse", label: "Categories", icon: LayoutGrid },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/friends", label: "Friends", icon: Users },
  { to: "/me", label: "Profile", icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 px-3"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 10px)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between gap-1 rounded-3xl border-2 border-black bg-white/95 p-1.5 shadow-brutal backdrop-blur">
        {tabs.map((t) => {
          const active = pathname === t.to || pathname.startsWith(t.to + "/");
          const Icon = t.icon;
          return (
            <li key={t.to} className="flex-1">
              <Link
                to={t.to}
                aria-label={t.label}
                className={`flex h-14 flex-col items-center justify-center gap-0.5 rounded-2xl transition-all duration-200 ${
                  active ? "bg-primary border-2 border-black shadow-brutal-sm scale-[1.02]" : "border-2 border-transparent"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "" : "text-black/50"}`} strokeWidth={active ? 2.6 : 2} />
                <span className={`text-[10px] font-bold leading-none ${active ? "" : "text-black/50"}`}>
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
