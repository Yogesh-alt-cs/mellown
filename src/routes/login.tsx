import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/home", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/home", replace: true });
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Could not sign in with Google");
        setLoading(false);
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/home", replace: true });
    } catch {
      toast.error("Google sign-in failed");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background p-6">
      <div className="mx-auto mt-6 grid h-14 w-14 place-items-center rounded-2xl border-2 border-black bg-primary shadow-brutal">
        <Sparkles className="h-6 w-6" />
      </div>
      <h1 className="mt-8 text-center font-display text-4xl leading-tight">
        {mode === "signin" ? "Welcome back" : "Create account"}
      </h1>
      <p className="mt-2 text-center text-black/60">
        {mode === "signin" ? "Sign in to keep your streak alive." : "Start playing in seconds."}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        {mode === "signup" && (
          <label className="flex h-14 items-center gap-3 rounded-2xl border-2 border-black bg-white px-4 shadow-brutal-sm">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Display name"
              className="h-full flex-1 bg-transparent font-bold outline-none placeholder:text-black/40"
            />
          </label>
        )}
        <label className="flex h-14 items-center gap-3 rounded-2xl border-2 border-black bg-white px-4 shadow-brutal-sm">
          <Mail className="h-5 w-5" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className="h-full flex-1 bg-transparent font-bold outline-none placeholder:text-black/40"
          />
        </label>
        <label className="flex h-14 items-center gap-3 rounded-2xl border-2 border-black bg-white px-4 shadow-brutal-sm">
          <Lock className="h-5 w-5" />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="h-full flex-1 bg-transparent font-bold outline-none placeholder:text-black/40"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="brutal-press flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-black bg-primary font-display text-lg shadow-brutal disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
            <>
              {mode === "signin" ? "Sign in" : "Create account"} <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-black/40">
        <div className="h-px flex-1 bg-black/20" />
        OR
        <div className="h-px flex-1 bg-black/20" />
      </div>

      <button
        onClick={onGoogle}
        disabled={loading}
        className="brutal-press flex h-14 w-full items-center justify-center gap-3 rounded-2xl border-2 border-black bg-white font-display shadow-brutal-sm disabled:opacity-60"
      >
        <GoogleMark />
        Continue with Google
      </button>

      <button
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-auto pt-8 text-center text-sm font-bold text-black/70 underline underline-offset-4"
      >
        {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.1l6.6 4.8C14.7 15 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.1z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2C29.3 35.4 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.5 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.2 5.2C41 35.5 44 30.2 44 24c0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}
