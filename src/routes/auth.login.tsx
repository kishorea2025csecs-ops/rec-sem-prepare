import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/logo-clean.png.asset.json";
import { Chrome, ShieldAlert, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Login | SemPrep AI" },
      { name: "description", content: "Sign in with your REC Google account to continue." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        navigate({ to: "/" });
      }
    };
    checkSession();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/auth/callback`,
        extraParams: {
          hd: "rajalakshmi.edu.in",
          prompt: "select_account",
        },
      });

      if (result.error) {
        setError(result.error.message);
        toast.error("Login failed", { description: result.error.message });
      }

      // If result.redirected is true, the browser will navigate away
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(msg);
      toast.error("Login failed", { description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="absolute top-8 left-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to home
        </Link>
      </div>

      <div className="w-full max-w-[400px] space-y-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="flex size-20 items-center justify-center rounded-2xl bg-accent/10 p-3 border border-accent/20 shadow-2xl shadow-accent/5">
            <img src={logoAsset.url} alt="REC Logo" className="size-full object-contain" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Rajalakshmi Engineering College
            </h1>
            <p className="mt-1 font-display text-lg font-medium text-accent">
              AI Exam Preparation Platform
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-elevated)]">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sign in using your Rajalakshmi Engineering College account to continue.
          </p>

          <div className="mt-8">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-foreground px-6 py-4 text-sm font-bold text-background transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Chrome className="size-5 transition-transform group-hover:rotate-12" />
              )}
              Continue with Google
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-surface/50 py-3 text-[11px] font-medium text-muted-foreground">
            <ShieldAlert className="size-3.5 text-accent" />
            Only @rajalakshmi.edu.in accounts are allowed
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
              <p className="font-bold uppercase tracking-wider">Access Restricted</p>
              <p className="mt-1">{error}</p>
            </div>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground">
          By continuing, you agree to our Study Guidelines and Academic Integrity Policy.
        </p>
      </div>
    </div>
  );
}
