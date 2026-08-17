import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { getPreparationStats } from "@/lib/prep.functions";
import { 
  Loader2, 
  TrendingUp, 
  Target, 
  Award, 
  Activity, 
  Zap, 
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Flame
} from "lucide-react";
import { Header } from "@/components/Header";
import { Sidebar, MobileNav } from "@/components/Sidebar";
import { motion } from "framer-motion";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchStats().then(setStats).catch(console.error).finally(() => setLoading(false));
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

  const kpis = [
    { label: "Exam Readiness", value: `${stats?.readiness || 0}%`, icon: Target, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { label: "Topic Coverage", value: `${stats?.topicCoverage || 0}%`, icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Priority Mastery", value: `${stats?.priorityCoverage || 0}%`, icon: Zap, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
    { label: "Question Accuracy", value: `${stats?.questionAccuracy || 0}%`, icon: Award, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  ];

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="font-display text-4xl font-black uppercase tracking-tight">
              Preparation Analytics
            </h1>
            <p className="text-muted-foreground mt-2">
              Deep dive into your study metrics and performance trends.
            </p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest">
            <Activity className="size-4 text-emerald-400" />
            Live Sync: <span className="text-emerald-400 ml-1">Active</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="size-10 animate-spin text-cyan-400" />
            <p className="text-muted-foreground animate-pulse">Calculating real-time analytics...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((kpi, idx) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-6 rounded-3xl border ${kpi.border} ${kpi.bg} backdrop-blur-xl relative overflow-hidden group`}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <kpi.icon className="size-20" />
                  </div>
                  <kpi.icon className={`size-6 ${kpi.color} mb-4`} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{kpi.label}</p>
                  <p className="text-3xl font-black mt-1">{kpi.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Performance Summary */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Flame className="size-5 text-orange-400" /> AI Insights
                </h3>
                
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-lg font-medium leading-relaxed italic">
                      "{stats?.recommendation}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Revision Status</p>
                      <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest w-fit ${
                        stats?.revisionKpi === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {stats?.revisionKpi}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Revision Consistency</p>
                      <p className="text-xl font-bold">{stats?.revisionConsistency}%</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Progress Chart Placeholder */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl flex flex-col items-center justify-center text-center"
              >
                <div className="size-20 rounded-[2rem] bg-white/5 flex items-center justify-center mb-6">
                  <BarChart3 className="size-10 text-muted-foreground opacity-20" />
                </div>
                <h3 className="text-xl font-bold mb-2">Detailed Trend Map</h3>
                <p className="text-muted-foreground max-w-sm">
                  Complete at least 3 practice sessions to unlock historical performance tracking and time-series analysis.
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function BookOpen({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4h6z" />
    </svg>
  );
}
