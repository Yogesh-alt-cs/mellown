import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMyStats, updateProfile } from "@/lib/quiz.functions";
import { LogOut, Trophy, Zap, Flame, Pencil, Check, X, Calendar, Heart } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  component: MePage,
});

export const AVATARS = [
  "🦊", "🐻", "🐼", "🐯", "🦁", "🐸", "🐵", "🐧",
  "🦄", "🐲", "👾", "🤖", "👻", "🎮", "🧙", "🥷",
  "👑", "🍕", "🚀", "⚡",
];

function MePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchStats = useServerFn(getMyStats);
  const save = useServerFn(updateProfile);
  const { data: stats } = useQuery({ queryKey: ["my-stats"], queryFn: () => fetchStats() });

  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("");
  const [joined, setJoined] = useState<string | null>(null);

  useEffect(() => {
    if (stats?.profile?.display_name) setName(stats.profile.display_name);
  }, [stats?.profile?.display_name]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.created_at) {
        setJoined(new Date(data.user.created_at).toLocaleDateString(undefined, { month: "short", year: "numeric" }));
      }
    });
  }, []);

  const favorite = (() => {
    const counts = new Map<string, number>();
    (stats?.recent ?? []).forEach((r) => counts.set(r.category ?? r.topic, (counts.get(r.category ?? r.topic) ?? 0) + 1));
    let top: string | null = null; let max = 0;
    counts.forEach((v, k) => { if (v > max) { max = v; top = k; } });
    return top;
  })();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  async function pickAvatar(a: string) {
    setPickerOpen(false);
    try {
      await save({ data: { avatar_emoji: a } });
      qc.invalidateQueries({ queryKey: ["my-stats"] });
      toast.success("Avatar updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't save avatar");
    }
  }

  async function saveName() {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      await save({ data: { display_name: trimmed } });
      qc.invalidateQueries({ queryKey: ["my-stats"] });
      setEditingName(false);
      toast.success("Name updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't save name");
    }
  }

  return (
    <div className="px-5 pt-12 pb-6">
      <h1 className="font-display text-3xl">Profile</h1>

      <div className="mt-6 rounded-3xl border-2 border-black bg-white p-6 shadow-brutal">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPickerOpen(true)}
            className="brutal-press relative grid h-20 w-20 place-items-center rounded-2xl border-2 border-black bg-primary text-4xl shadow-brutal-sm"
            aria-label="Change avatar"
          >
            {stats?.profile?.avatar_emoji ?? "🎯"}
            <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-black bg-white">
              <Pencil className="h-3 w-3" />
            </span>
          </button>
          <div className="min-w-0 flex-1">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  autoFocus
                  className="min-w-0 flex-1 rounded-xl border-2 border-black bg-background px-3 py-2 font-display text-lg outline-none"
                />
                <button onClick={saveName} className="brutal-press grid h-10 w-10 place-items-center rounded-xl border-2 border-black bg-primary shadow-brutal-sm">
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={() => { setEditingName(false); setName(stats?.profile?.display_name ?? ""); }} className="brutal-press grid h-10 w-10 place-items-center rounded-xl border-2 border-black bg-white shadow-brutal-sm">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="truncate font-display text-xl">{stats?.profile?.display_name ?? "Player"}</div>
                <button onClick={() => setEditingName(true)} aria-label="Edit name" className="grid h-7 w-7 place-items-center rounded-lg border-2 border-black bg-white">
                  <Pencil className="h-3 w-3" />
                </button>
              </div>
            )}
            <div className="mt-1 flex items-center gap-1 text-xs text-black/60">
              <Calendar className="h-3 w-3" /> Joined {joined ?? "—"}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat icon={<Trophy className="h-4 w-4" />} label="XP" value={stats?.totalScore ?? 0} />
          <Stat icon={<Zap className="h-4 w-4" />} label="Played" value={stats?.totalQuizzes ?? 0} />
          <Stat icon={<Flame className="h-4 w-4" />} label="Acc." value={`${stats?.accuracy ?? 0}%`} />
        </div>

        {favorite && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border-2 border-black bg-[#FCD9A8] px-3 py-2">
            <Heart className="h-4 w-4" />
            <span className="text-xs font-bold uppercase text-black/60">Favorite</span>
            <span className="ml-auto truncate font-display">{favorite}</span>
          </div>
        )}
      </div>

      <h2 className="mt-8 font-display text-lg">Recent quizzes</h2>
      <div className="mt-3 space-y-2">
        {(stats?.recent ?? []).length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-black/40 p-6 text-center text-sm text-black/60">
            No quizzes yet — go play one!
          </div>
        ) : (
          stats!.recent.map((r, i) => (
            <div key={i} className="flex items-center justify-between rounded-2xl border-2 border-black bg-white p-3 shadow-brutal-sm">
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold">{r.topic}</div>
                <div className="text-[11px] text-black/60">{r.correct}/{r.total} correct</div>
              </div>
              <div className="rounded-lg border-2 border-black bg-primary px-2 py-1 font-display text-sm">+{r.score}</div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={signOut}
        className="brutal-press mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-black bg-white font-display shadow-brutal-sm"
      >
        <LogOut className="h-5 w-5" /> Sign out
      </button>

      {pickerOpen && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/50 sm:place-items-center" onClick={() => setPickerOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-t-3xl border-2 border-black bg-white p-5 shadow-brutal sm:rounded-3xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl">Pick an avatar</h3>
              <button onClick={() => setPickerOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl border-2 border-black bg-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {AVATARS.map((a) => {
                const selected = a === stats?.profile?.avatar_emoji;
                return (
                  <button
                    key={a}
                    onClick={() => pickAvatar(a)}
                    className={`brutal-press grid aspect-square place-items-center rounded-2xl border-2 border-black text-3xl shadow-brutal-sm ${selected ? "bg-primary" : "bg-background"}`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-black bg-background p-3">
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-black/60">
        {icon} {label}
      </div>
      <div className="mt-1 font-display text-lg">{value}</div>
    </div>
  );
}
