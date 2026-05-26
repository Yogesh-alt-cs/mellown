import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ title: "Signing you in…" }] }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    // Supabase JS auto-parses the URL hash (#access_token=...) on first call.
    // We just wait for the resulting session and route accordingly.
    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (cancelled) return;
        if (error) {
          console.error("[auth/callback] getSession error", error);
          toast.error(error.message || "Sign-in failed");
          navigate({ to: "/login", replace: true });
          return;
        }
        if (data.session) {
          navigate({ to: "/home", replace: true });
        } else {
          // Listen briefly in case the SDK is still processing the hash.
          const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
            if (session) {
              sub.subscription.unsubscribe();
              navigate({ to: "/home", replace: true });
            }
          });
          setTimeout(() => {
            sub.subscription.unsubscribe();
            navigate({ to: "/login", replace: true });
          }, 4000);
        }
      } catch (e) {
        console.error("[auth/callback] unexpected", e);
        navigate({ to: "/login", replace: true });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="grid min-h-[100dvh] place-items-center bg-background">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-black border-t-transparent" />
    </div>
  );
}
