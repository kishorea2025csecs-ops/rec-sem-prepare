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
  Search,
  ChevronRight,
  Star,
  Calendar,
  Filter,
  BarChart3,
  History,
  Target,
  Youtube
} from "lucide-react";

export const Route = createFileRoute("/question-bank")({
  head: () => ({
    meta: [
      { title: "Question Bank | SemPrep AI" },
      { name: "description", content: "Organized bank of previous year questions for REC students." },
    ],
  }),
  component: QuestionBank,
});

const questions = [
  {
    id: "q1",
    text: "Explain the working principle of Bayesian Networks with a detailed diagram and inference example.",
    topic: "Bayesian Networks",
    marks: 15,
    year: "Nov/Dec 2025",
    difficulty: "Hard",
    frequency: "5/6 sems",
    type: "Part-C"
  },
  {
    id: "q2",
    text: "Discuss the architecture of Hidden Markov Models and how state transitions are calculated.",
    topic: "Hidden Markov Models",
    marks: 13,
    year: "Nov/Dec 2025",
    difficulty: "Medium",
    frequency: "4/6 sems",
    type: "Part-B"
  },
  {
    id: "q3",
    text: "Compare Naive Bayes with K-Nearest Neighbors in terms of classification accuracy and efficiency.",
    topic: "Naive Bayes Classifier",
    marks: 13,
    year: "Apr/May 2024",
    difficulty: "Easy",
    frequency: "3/6 sems",
    type: "Part-B"
  }
];

function QuestionBank() {
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
            <button className="flex w-full items-center gap-3 rounded-xl bg-primary/10 px-3 py-2 text-sm font-semibold text-primary transition-colors">
              <FileText className="size-4" /> Question Bank
            </button>
            <Link to="/study-planner" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              <Calendar className="size-4" /> Study Planner
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-xl">
          <div className="hidden items-center gap-2 text-xs font-medium text-muted-foreground md:flex">
             <span>Resources</span>
             <ChevronRight className="size-3" />
             <span className="text-foreground">Question Bank</span>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="size-6 rounded-full bg-gradient-to-tr from-accent to-primary" />
             <span className="text-sm font-medium">My Account</span>
          </div>
        </header>

        <div className="mx-auto max-w-5xl p-6 lg:p-10">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight">Question Bank</h1>
                <p className="mt-2 text-muted-foreground">Search and filter through historical exam questions.</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search questions..." 
                    className="h-10 pl-10 pr-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
                  />
                </div>
                <button className="grid size-10 place-items-center rounded-xl border border-border bg-card hover:bg-surface transition-colors">
                  <Filter className="size-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {questions.map((q) => (
                <div key={q.id} className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 group">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-lg bg-surface px-2 py-1 text-[9px] font-bold uppercase tracking-widest border border-border text-muted-foreground">{q.type}</span>
                        <span className="rounded-lg bg-primary/10 px-2 py-1 text-[9px] font-bold uppercase tracking-widest border border-primary/20 text-primary">{q.difficulty}</span>
                        <span className="rounded-lg bg-accent/10 px-2 py-1 text-[9px] font-bold uppercase tracking-widest border border-accent/20 text-accent">{q.marks} Marks</span>
                      </div>
                      <h3 className="text-base font-bold leading-relaxed">{q.text}</h3>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><History className="size-3" /> {q.year}</span>
                        <span className="flex items-center gap-1.5"><BarChart3 className="size-3" /> {q.frequency}</span>
                      </div>
                    </div>
                    <div className="md:w-48 shrink-0 flex flex-col gap-2 justify-center">
                      <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-surface px-4 py-2.5 text-xs font-bold border border-border hover:bg-card transition-all">
                        View Solution <ArrowRight className="size-3" />
                      </button>
                      <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border/50 bg-background px-4 py-2.5 text-xs font-bold hover:bg-surface transition-colors">
                        <Target className="size-3 text-primary" /> Mark Prepared
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
