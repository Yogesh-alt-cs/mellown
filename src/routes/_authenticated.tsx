import { createFileRoute, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/_authenticated")({
  component: AuthLayout,
});

// Routes that should be fullscreen (no bottom nav)
const FULLSCREEN_ROUTES = ["/play", "/results", "/quiz"];

function AuthLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate({ to: "/login", replace: true });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: "/login", replace: true });
      } else {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!ready) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-black border-t-transparent" />
      </div>
    );
  }

  const fullscreen = FULLSCREEN_ROUTES.some((r) => pathname.startsWith(r));

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <Outlet />
      </div>
      {!fullscreen && <BottomNav />}
    </div>
  );
}
