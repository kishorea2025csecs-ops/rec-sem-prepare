import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { getPreparationStats } from "@/lib/prep.functions";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Sidebar, MobileNav } from "@/components/Sidebar";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Preparation Analytics | SemPrep AI" },
      { name: "description", content: "Detailed preparation analytics and readiness metrics." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState<any>(null);
  const fetchStats = useServerFn(getPreparationStats);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchStats().then(setStats).catch(console.error);
      }
      setChecking(false);
    });
  }, [fetchStats]);

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#020205]">
        <Loader2 className="size-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 text-white bg-[#020205]">
      <Header
        isAuthenticated={!!session}
        isVerifiedRec={!!session?.user?.email?.endsWith("@rajalakshmi.edu.in")}
        userEmail={session?.user?.email}
        activeLink="analytics"
      />

      <Sidebar activeLink="/analytics" />
      <MobileNav activeLink="/analytics" />

      <main className="relative z-10 mx-auto max-w-7xl px-5 lg:pl-80 pt-28 pb-20">
        <h1 className="font-display text-3xl font-black uppercase tracking-tight mb-8">
          Preparation Analytics
        </h1>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
          <p className="text-muted-foreground">Preparation analytics and readiness metrics coming soon.</p>
        </div>
      </main>
    </div>
  );
}
