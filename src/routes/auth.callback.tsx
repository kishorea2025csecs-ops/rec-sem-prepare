import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (data.session) {
          const user = data.session.user;
          
          // Double check domain server-side/client-side during hydration
          if (!user.email?.endsWith("@rajalakshmi.edu.in")) {
            await supabase.auth.signOut();
            throw new Error("Access restricted to @rajalakshmi.edu.in accounts.");
          }

          toast.success("Welcome back!", {
            description: `Signed in as ${user.email}`,
          });
          
          navigate({ to: "/" });
        } else {
          // No session found, user might have just landed here
          navigate({ to: "/auth/login" });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Authentication failed";
        setError(msg);
        toast.error("Authentication error", { description: msg });
        
        // Wait a bit so user can see the error before redirecting back
        setTimeout(() => {
          navigate({ 
            to: "/auth/login", 
            search: { error: msg } 
          } as any);
        }, 3000);
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center px-6">
      <div className="space-y-6">
        {error ? (
          <div className="animate-in fade-in zoom-in duration-300">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
              <Loader2 className="size-8 animate-spin" />
            </div>
            <h1 className="mt-6 text-xl font-bold text-foreground">Access Restricted</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
              {error}
            </p>
            <p className="mt-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              Redirecting to login...
            </p>
          </div>
        ) : (
          <div className="animate-pulse">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-accent/10 text-accent border border-accent/20">
              <Loader2 className="size-8 animate-spin" />
            </div>
            <h1 className="mt-6 text-xl font-bold text-foreground">Verifying Identity</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Please wait while we secure your REC session...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
