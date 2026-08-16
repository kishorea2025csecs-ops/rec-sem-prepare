import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import logoAsset from "@/assets/logo-clean.png.asset.json";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  LogOut,
  User,
  Settings as SettingsIcon,
  ChevronDown,
  BookOpen,
  Layout,
  Upload,
  FileText,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Youtube,
  ArrowRight,
  Search,
  ChevronRight,
  Clock,
  History,
  Zap,
  Image as ImageIcon,
  MessageSquare,
  BarChart3,
  Calendar,
  Filter,
  Star,
  Brain,
  ListChecks,
  Target
} from "lucide-react";

export const Route = createFileRoute("/topics")({
  head: () => ({
    meta: [
      { title: "Important Topics | SemPrep AI" },
      { name: "description", content: "High priority topics for your upcoming semester exams." },
    ],
  }),
  component: ImportantTopics,
});

const priorityTopics = [
  {
    id: "1",
    name: "Bayesian Networks — inference",
    priority: "Very High",
    marks: 15,
    frequency: "5/6 semesters",
    reason: "Consistent appearance in Part-C (15 marks) and foundational for Unit 3.",
    recency: "Dec 2025, May 2025",
    color: "red"
  },
  {
    id: "2",
    name: "Hidden Markov Models",
    priority: "High",
    marks: 13,
    frequency: "4/6 semesters",
    reason: "High repetition rate in Part-B; usually involves a trellis diagram.",
    recency: "Dec 2025",
    color: "orange"
  },
  {
    id: "3",
    name: "Naive Bayes Classifier",
    priority: "Medium",
    marks: 13,
    frequency: "3/6 semesters",
    reason: "Alternative to Bayesian Networks; often asked in theory/comparison format.",
    recency: "May 2024",
    color: "amber"
  },
  {
    id: "4",
    name: "Markov Decision Process",
    priority: "Low",
    marks: 8,
    frequency: "1/6 semesters",
    reason: "Introduced recently; depth varies but usually asked for 2-5 marks.",
    recency: "Dec 2025",
    color: "emerald"
  }
];

function ImportantTopics() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
      {/* Sidebar - Reusing styles from Dashboard */}
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
            <button className="flex w-full items-center gap-3 rounded-xl bg-primary/10 px-3 py-2 text-sm font-semibold text-primary transition-colors">
              <Star className="size-4" /> Important Topics
            </button>
            <Link to="/question-bank" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              <FileText className="size-4" /> Question Bank
            </Link>
            <Link to="/study-planner" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              <Calendar className="size-4" /> Study Planner
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-xl">
          <div className="hidden items-center gap-2 text-xs font-medium text-muted-foreground md:flex">
             <span>AI Analysis</span>
             <ChevronRight className="size-3" />
             <span className="text-foreground">Priority Topics</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 rounded-full border border-border bg-surface px-3 py-1.5"
              >
                 <div className="size-6 rounded-full bg-gradient-to-tr from-accent to-primary" />
                 <span className="text-sm font-medium">My Account</span>
                 <ChevronDown className="size-3" />
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl p-6 lg:p-10">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">Important Topics</h1>
              <p className="mt-2 text-muted-foreground">
                Priority calculated based on previous 6 semesters' frequency and mark distribution.
              </p>
            </div>

            <div className="grid gap-6">
              {priorityTopics.map((topic) => (
                <div 
                  key={topic.id}
                  className="rounded-3xl border border-border bg-card overflow-hidden transition-all hover:border-primary/40 group"
                >
                  <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${
                          topic.color === 'red' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                          topic.color === 'orange' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                          topic.color === 'amber' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}>
                          {topic.priority} Priority
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-widest">
                          <History className="size-3" /> Last Asked: {topic.recency}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{topic.name}</h3>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                          <span className="text-foreground font-semibold">AI Insight:</span> {topic.reason}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4 pt-2">
                        <div className="flex items-center gap-2 rounded-xl bg-surface px-4 py-2 border border-border">
                          <Target className="size-4 text-accent" />
                          <div className="text-left">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Marks</p>
                            <p className="text-xs font-bold">{topic.marks} Marks</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-surface px-4 py-2 border border-border">
                          <BarChart3 className="size-4 text-primary" />
                          <div className="text-left">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Frequency</p>
                            <p className="text-xs font-bold">{topic.frequency}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-64 shrink-0 flex flex-col gap-3 justify-center">
                      <Link 
                        to="/dashboard" 
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg hover:-translate-y-0.5 transition-all"
                      >
                        Start Learning <ArrowRight className="size-4" />
                      </Link>
                      <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-bold hover:bg-card transition-colors">
                        <Youtube className="size-4 text-red-500" /> Watch Tutorial
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
