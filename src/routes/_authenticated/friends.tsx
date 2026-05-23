import { createFileRoute } from "@tanstack/react-router";
import { Users, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/friends")({
  component: FriendsPage,
});

function FriendsPage() {
  return (
    <div className="px-5 pt-12 pb-6">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <h1 className="font-display text-3xl">Friends</h1>
      </div>
      <p className="mt-1 text-sm text-black/60">Play together. Climb together.</p>

      <div className="mt-10 grid place-items-center">
        <div className="relative">
          <div className="animate-float-slow grid h-32 w-32 place-items-center rounded-[2rem] border-2 border-black bg-[#FFD1DC] text-6xl shadow-brutal">
            🤝
          </div>
          <div className="absolute -right-3 -top-3 grid h-12 w-12 place-items-center rounded-2xl border-2 border-black bg-primary shadow-brutal-sm">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        <h2 className="mt-8 text-center font-display text-2xl">Multiplayer & Friends</h2>
        <p className="mt-2 max-w-xs text-center text-sm text-black/60">
          Invite friends, race head-to-head, and share your scores. Coming very soon!
        </p>

        <div className="mt-6 inline-flex items-center rounded-full border-2 border-black bg-[#EAFF00] px-4 py-1.5 font-display text-xs shadow-brutal-sm">
          COMING SOON
        </div>
      </div>
    </div>
  );
}
