import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import logoAsset from "@/assets/logo-clean.png.asset.json";
import logoV2Asset from "@/assets/logo-v2.png.asset.json";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ChevronDown,
  BookOpen,
  Layout,
  FileText,
  ArrowRight,
  ChevronRight,
  Star,
  Calendar,
  Clock,
  Sparkles,
  Zap,
  Target,
  Brain
} from "lucide-react";

export const Route = createFileRoute("/study-planner")({
  head: () => ({
    meta: [
      { title: "AI Study Planner | SemPrep AI" },
      { name: "description", content: "Personalized exam revision schedule for REC students." },
    ],
  }),
  component: StudyPlanner,
});

function StudyPlanner() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/auth/login" });
        return;
      }
      setUser(session.user);
    };
    getSession();
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card md:block">
        <div className="flex h-full flex-col">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10 p-1 border border-accent/20">
                <img src={logoAsset.url} alt="REC Logo" className="size-full object-contain" />
              </div>
              <span className="font-display font-bold tracking-tight text-lg">SemPrep AI</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            <Link to="/dashboard" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              <Layout className="size-4" /> Dashboard
            </Link>
            <Link to="/topics" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              <Star className="size-4" /> Important Topics
            </Link>
            <Link to="/question-bank" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              <FileText className="size-4" /> Question Bank
            </Link>
            <button className="flex w-full items-center gap-3 rounded-xl bg-primary/10 px-3 py-2 text-sm font-semibold text-primary transition-colors">
              <Calendar className="size-4" /> Study Planner
            </button>
          </nav>
        </div>
      </aside>

      <main className="flex-1 md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-xl">
          <div className="hidden items-center gap-2 text-xs font-medium text-muted-foreground md:flex">
             <span>AI Tools</span>
             <ChevronRight className="size-3" />
             <span className="text-foreground">Study Planner</span>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="size-6 rounded-full bg-gradient-to-tr from-accent to-primary" />
             <span className="text-sm font-medium">My Account</span>
          </div>
        </header>

        <div className="mx-auto max-w-5xl p-6 lg:p-10">
          <div className="flex flex-col gap-8">
            <div className="max-w-2xl">
              <h1 className="font-display text-3xl font-bold tracking-tight">AI Study Planner</h1>
              <p className="mt-2 text-muted-foreground">Generate a personalized revision schedule based on your exam date and current preparation level.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card p-8 space-y-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Target className="size-5 text-accent" />
                  Your Exam Goals
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Next Exam Date</label>
                    <input type="date" className="mt-1.5 w-full rounded-xl border border-border bg-surface p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Units to Cover</label>
                      <select className="mt-1.5 w-full rounded-xl border border-border bg-surface p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option>1 Unit</option>
                        <option>2 Units</option>
                        <option>3 Units</option>
                        <option>4 Units</option>
                        <option>5 Units</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Study Hours/Day</label>
                      <input type="number" placeholder="4" className="mt-1.5 w-full rounded-xl border border-border bg-surface p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Preparation Level</label>
                    <div className="mt-3 flex gap-2">
                      {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                        <button key={lvl} className="flex-1 rounded-xl border border-border bg-surface py-2 text-xs font-bold hover:bg-card transition-colors">
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground shadow-lg hover:-translate-y-0.5 transition-all">
                  <Sparkles className="size-4" /> Generate Revision Plan
                </button>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-border bg-accent/5 p-8 border-accent/20">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <Brain className="size-4 text-accent" />
                    AI Recommendation
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    Fill in your details to get a custom schedule that prioritizes high-weightage topics and maps out your revision blocks.
                  </p>
                </div>

                <div className="rounded-3xl border border-border bg-card p-6 overflow-hidden relative">
                   <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Preview of Schedule</p>
                   </div>
                   <div className="space-y-4 blur-[1px]">
                     {[1, 2, 3].map((i) => (
                       <div key={i} className="flex gap-4 items-center rounded-xl bg-surface p-3 opacity-40">
                         <div className="size-10 rounded-lg bg-border/20" />
                         <div className="space-y-2 flex-1">
                           <div className="h-2 w-24 bg-border/20 rounded-full" />
                           <div className="h-1.5 w-full bg-border/10 rounded-full" />
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
