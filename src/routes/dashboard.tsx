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
  Plus,
  Search,
  ChevronRight,
  Clock,
  MoreVertical,
  Sparkles,
  History,
  Zap,
  Image as ImageIcon,
  MessageSquare,
  BarChart3,
  Loader2,
  Settings,
  Wrench,
  Rocket,
  PlusCircle,
  ShieldCheck,
  Share2,
  Calendar,
  Star,
  Brain,
} from "lucide-react";
import { ModelViewer } from "@/components/ModelViewer";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Student Dashboard | SemPrep AI - Rajalakshmi Engineering College" },
      { name: "description", content: "Access your personalized exam preparation dashboard. Manage subjects, unit notes, and track your progress for REC engineering exams." },
      { property: "og:title", content: "Student Dashboard | SemPrep AI" },
      { property: "og:description", content: "AI-powered exam preparation dashboard for REC students." },
    ],
  }),
  component: Dashboard,
});

const subjects = [
  { id: "cs3491", name: "AI and Machine Learning", code: "CS3491", progress: 65 },
  { id: "cs3492", name: "DBMS", code: "CS3492", progress: 40 },
  { id: "ma3491", name: "Stats and Numerical Methods", code: "MA3491", progress: 20 },
];

const topics = [
  {
    id: "1",
    name: "Bayesian Networks — inference",
    importance: "High",
    marks: 15,
    frequency: "Asked 5 / last 6 semesters",
    completed: true,
  },
  {
    id: "2",
    name: "Hidden Markov Models",
    importance: "High",
    marks: 13,
    frequency: "Asked 4 / last 6 semesters",
    completed: false,
  },
  {
    id: "3",
    name: "Naive Bayes classifier",
    importance: "Medium",
    marks: 13,
    frequency: "Asked 3 / last 6 semesters",
    completed: false,
  },
  {
    id: "4",
    name: "Approximate inference",
    importance: "Low",
    marks: 2,
    frequency: "Rarely asked",
    completed: false,
  },
];

const pyqData = [
  {
    question: "Explain the working principle of Bayesian Networks with an example.",
    topic: "Bayesian Networks — inference",
    importance: "Very High",
    appearances: 5,
    expectedMarks: "13/15 marks",
    preparation: "Understand the principle, learn the diagram, and practice explaining it in exam format.",
  },
  {
    question: "Discuss the architecture and transition probabilities in Hidden Markov Models.",
    topic: "Hidden Markov Models",
    importance: "High",
    appearances: 4,
    expectedMarks: "13 marks",
    preparation: "Focus on state transitions and trellis diagram representation.",
  },
  {
    question: "Compare Naive Bayes with other classification algorithms.",
    topic: "Naive Bayes classifier",
    importance: "Medium",
    appearances: 3,
    expectedMarks: "8 marks",
    preparation: "Learn the mathematical formula and one real-world application case study.",
  },
];

const extractedConcepts = [
  { category: "Definitions", items: ["Acyclic Graph", "Conditional Probability Table (CPT)", "Markov Property"] },
  { category: "Formulas", items: ["P(A|B) = P(B|A)P(A)/P(B)", "Sum-Product Algorithm"] },
  { category: "Key Diagrams", items: ["Trellis Diagram", "DAG Representation", "Transition Matrix"] },
];

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activeSubject] = useState(subjects[0]);
  const [activeUnit] = useState(3);
  const [activeTab, setActiveTab] = useState("Preparation Plan");
  const [activeLessonStep, setActiveLessonStep] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState<"idle" | "uploading" | "analyzing" | "complete">("idle");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [explanationLevel, setExplanationLevel] = useState<"quick" | "exam" | "revision">("quick");

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/auth/login" });
        return;
      }
      setUser(session.user);
      
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }
    };
    
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate({ to: "/auth/login" });
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate({ to: "/auth/login" });
  };

  const startAnalysis = () => {
    setAnalysisStatus("uploading");
    setProcessingProgress(0);
  };

  useEffect(() => {
    let timer: any;
    if (analysisStatus === "uploading" || analysisStatus === "analyzing") {
      timer = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 100) {
            if (analysisStatus === "uploading") {
              setAnalysisStatus("analyzing");
              return 0;
            }
            setAnalysisStatus("complete");
            clearInterval(timer);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [analysisStatus]);

  if (!activeSubject) return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
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
            <button className="flex w-full items-center gap-3 rounded-xl bg-primary/10 px-3 py-2 text-sm font-semibold text-primary transition-colors">
              <Layout className="size-4" /> Dashboard
            </button>
            <Link to="/topics" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              <Star className="size-4" /> Important Topics
            </Link>
            <Link to="/question-bank" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              <FileText className="size-4" /> Question Bank
            </Link>
            <Link to="/study-planner" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              <Calendar className="size-4" /> Study Planner
            </Link>
          </nav>

          <div className="border-t border-border p-4">
            <div className="rounded-2xl bg-surface/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Subject
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-xl bg-accent/15 text-accent font-bold text-xs">
                  {activeSubject.code.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{activeSubject.name}</p>
                  <p className="text-[10px] text-muted-foreground">{activeSubject.code}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 md:hidden">
            <div className="flex size-8 items-center justify-center rounded-lg bg-accent/10 p-0.5 border border-accent/20">
              <img src={logoAsset.url} alt="REC Logo" className="size-full object-contain" />
            </div>
            <span className="font-display font-bold">SemPrep AI</span>
          </div>
          <div className="hidden items-center gap-2 text-xs font-medium text-muted-foreground md:flex">
             <span>Subjects</span>
             <ChevronRight className="size-3" />
             <span>{activeSubject.code}</span>
             <ChevronRight className="size-3" />
             <span className="text-foreground">Unit {activeUnit}</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="grid size-9 place-items-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground">
              <Search className="size-4" />
            </button>
            <div className="h-8 w-[1px] bg-border" />
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 rounded-full border border-border bg-surface px-3 py-1.5 transition-colors hover:bg-surface/80"
              >
                 {profile?.avatar_url || user?.user_metadata?.avatar_url ? (
                   <img 
                     src={profile?.avatar_url || user?.user_metadata?.avatar_url} 
                     alt="Avatar" 
                     className="size-6 rounded-full object-cover" 
                   />
                 ) : (
                   <div className="size-6 rounded-full bg-gradient-to-tr from-accent to-primary" />
                 )}
                 <span className="text-sm font-medium max-w-[120px] truncate">
                   {profile?.full_name || user?.user_metadata?.full_name || "Student"}
                 </span>
                 <ChevronDown className={`size-3 text-muted-foreground transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="border-b border-border p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Signed in as</p>
                    <p className="mt-0.5 truncate text-xs font-medium">{user?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <button 
                      onClick={() => navigate({ to: "/profile" })}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium hover:bg-surface transition-colors"
                    >
                      <User className="size-3.5" /> Profile
                    </button>
                    <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium hover:bg-surface transition-colors">
                      <SettingsIcon className="size-3.5" /> Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="size-3.5" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl p-6 lg:p-10">
          <div className="flex flex-col gap-8">
            {/* Subject Info & Progress */}
            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight uppercase">
                  {activeSubject.name}
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Rajalakshmi Engineering College · {profile?.full_name || "Semester 4"}
                </p>
                
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Completion", value: `${activeSubject.progress}%`, color: "text-primary" },
                    { label: "Topics Prepared", value: "8 / 10", color: "text-accent" },
                    { label: "Practice Rate", value: "72%", color: "text-foreground" },
                  ].map((stat, i) => (
                    <motion.div 
                      key={stat.label} 

                      animate={{ 
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5
                      }}
                      className="rounded-2xl border border-border bg-card p-4 hover:border-primary/50 transition-colors group neon-border-cyan"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                      <div className="mt-1 flex items-baseline justify-between">
                        <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                        <BarChart3 className="size-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-surface/30 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold">Study Recommendation</h3>
                    <AlertCircle className="size-4 text-accent" />
                  </div>
                  <motion.div 
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="mt-4 flex items-start gap-4 rounded-2xl border border-accent/20 bg-accent/5 p-4 neon-border-purple"
                  >
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground shadow-lg neon-glow-purple">
                      <TrendingUp className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Next Task: Bayesian Networks</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                        High-priority Part-C topic. Recommended to watch the Tamil visualization before reading notes.
                      </p>
                    </div>
                  </motion.div>
                </div>
                <Link to="/study-planner" className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-card px-4 py-2 text-xs font-bold border border-border hover:bg-surface transition-all">
                  Open Planner <Calendar className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Lesson Progress Stepper */}
            <div className="rounded-3xl border border-border bg-card overflow-hidden">
              <div className="bg-surface/50 px-6 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">Lesson Roadmap</h3>
                  <p className="text-[10px] text-muted-foreground">Complete these 7 steps to master the lesson</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-primary">{Math.round((activeLessonStep / 6) * 100)}%</span>
                  <div className="w-24 h-1.5 rounded-full bg-surface overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500" 
                      style={{ width: `${(activeLessonStep / 6) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                  {[
                    { title: "Meet the Basics", icon: BookOpen, desc: "1: Meet the Basics – Learn the core ideas.", color: "from-blue-500/20 to-blue-600/20", img: "https://cdn.iconscout.com/icon/premium/png-512-thumb/learning-2601726-2184144.png?f=webp&w=256" },
                    { title: "Set Up Tools", icon: Wrench, desc: "2: Set Up Tools – Prepare your workspace fast.", color: "from-purple-500/20 to-purple-600/20", img: "https://cdn.iconscout.com/icon/premium/png-512-thumb/tools-box-3171358-2641031.png?f=webp&w=256" },
                    { title: "Build First Steps", icon: Rocket, desc: "3: Build First Steps – Create your first small piece.", color: "from-emerald-500/20 to-emerald-600/20", img: "https://cdn.iconscout.com/icon/premium/png-512-thumb/startup-2601728-2184146.png?f=webp&w=256" },
                    { title: "Add New Skills", icon: PlusCircle, desc: "4: Add New Skills – Expand what you can do.", color: "from-amber-500/20 to-amber-600/20", img: "https://cdn.iconscout.com/icon/premium/png-512-thumb/growth-2601724-2184142.png?f=webp&w=256" },
                    { title: "Fix Mistakes", icon: AlertCircle, desc: "5: Fix Common Mistakes – Find and solve simple problems.", color: "from-red-500/20 to-red-600/20", img: "https://cdn.iconscout.com/icon/premium/png-512-thumb/problem-solving-2601727-2184145.png?f=webp&w=256" },
                    { title: "Finish Project", icon: ShieldCheck, desc: "6: Finish the Project – Put everything together safely.", color: "from-indigo-500/20 to-indigo-600/20", img: "https://cdn.iconscout.com/icon/premium/png-512-thumb/success-2601729-2184147.png?f=webp&w=256" },
                    { title: "Share Your Work", icon: Share2, desc: "7: Share Your Work – Show your results to others.", color: "from-pink-500/20 to-pink-600/20", img: "https://cdn.iconscout.com/icon/premium/png-512-thumb/sharing-2601725-2184143.png?f=webp&w=256" },
                  ].map((step, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setActiveLessonStep(i)}
                      animate={{ 
                        y: [0, -4, 0],
                        rotate: [0, i % 2 === 0 ? 0.5 : -0.5, 0]
                      }}
                      transition={{
                        duration: 5 + i,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className={`group relative flex flex-col items-center text-center p-3 rounded-2xl transition-all ${
                        activeLessonStep === i 
                          ? "bg-surface ring-2 ring-primary/50 shadow-lg" 
                          : "hover:bg-surface/50 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className={`relative flex size-14 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} border border-white/5 overflow-hidden transition-transform duration-300 group-hover:scale-105 ${activeLessonStep === i ? 'neon-glow-cyan border-primary/50' : ''}`}>
                        <img 
                          src={step.img} 
                          alt={step.title} 
                          className="size-10 object-contain transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {activeLessonStep > i && (
                          <div className="absolute -top-1 -right-1 size-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-background shadow-sm">
                            <CheckCircle2 className="size-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Step 0{i+1}</p>
                        <p className="mt-1 text-[11px] font-bold leading-tight line-clamp-2">{step.title}</p>
                      </div>
                      {activeLessonStep === i && (
                        <div className="mt-2 absolute -bottom-20 left-1/2 -translate-x-1/2 w-48 z-20 pointer-events-none">
                          <div className="bg-popover/90 backdrop-blur-md border border-primary/30 rounded-xl p-3 shadow-2xl animate-in fade-in zoom-in slide-in-from-top-2 duration-300">
                            <p className="text-[10px] text-foreground leading-relaxed font-medium">{step.desc}</p>
                          </div>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="border-b border-border">
              <nav className="-mb-px flex gap-8">
                {["Preparation Plan", "Unit Notes", "Previous Papers", "Tamil Tutorials"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-medium transition-colors relative ${
                      activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Preparation Content Area */}
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {activeTab === "Preparation Plan" && (
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-xl font-bold">Important Topics — Unit {activeUnit}</h2>
                      <button className="inline-flex items-center gap-2 rounded-xl bg-surface px-3 py-1.5 text-xs font-semibold border border-border hover:bg-card">
                        <Clock className="size-3" /> Recent Changes
                      </button>
                    </div>

                    <div className="mt-6 space-y-4">
                      {topics.map((topic) => (
                        <div
                          key={topic.id}
                          className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50"
                        >
                          <div className="p-5 flex items-start justify-between gap-4">
                            <div className="flex gap-4">
                              <button className={`mt-1 grid size-5 place-items-center rounded border ${topic.completed ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30 hover:border-primary'}`}>
                                {topic.completed && <CheckCircle2 className="size-4" />}
                              </button>
                              <div>
                                <p className={`text-sm font-semibold ${topic.completed ? 'text-muted-foreground line-through' : ''}`}>
                                  {topic.name}
                                </p>
                                <div className="mt-2 flex items-center gap-3">
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                    topic.importance === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                                    topic.importance === 'Medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                                    'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                  }`}>
                                    {topic.importance} Priority
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1">
                                    <FileText className="size-3" /> {topic.marks} Marks
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => setSelectedQuestion(topic)}
                              className="inline-flex items-center gap-2 rounded-xl bg-surface px-4 py-2 text-xs font-bold border border-border hover:bg-primary hover:text-primary-foreground transition-all"
                            >
                              Guide <ArrowRight className="size-3" />
                            </button>
                          </div>
                          
                          {selectedQuestion?.id === topic.id && (
                            <div className="border-t border-border bg-surface/30 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                              <div className="grid gap-6 lg:grid-cols-2">
                                <div className="space-y-6">
                                  <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Score Guidance</h4>
                                    <div className="mt-4 space-y-3">
                                      <div className="rounded-xl border border-border bg-card p-4">
                                        <p className="text-xs font-bold text-foreground">Examiner Expectations</p>
                                        <p className="mt-1 text-[11px] text-muted-foreground">Logical flow, clear diagram, and the formula derivation for {topic.name}.</p>
                                      </div>
                                      <div className="rounded-xl border border-border bg-card p-4">
                                        <p className="text-xs font-bold text-foreground">Suggested 13-Mark Structure</p>
                                        <div className="mt-3 space-y-1.5">
                                          {[
                                            { l: "Intro & Def", m: "2m" },
                                            { l: "Working Principle", m: "3m" },
                                            { l: "Main Explanation", m: "4m" },
                                            { l: "Diagram & Label", m: "2m" },
                                            { l: "Applications", m: "2m" },
                                          ].map(item => (
                                            <div key={item.l} className="flex items-center justify-between text-[10px]">
                                              <span className="text-muted-foreground">{item.l}</span>
                                              <span className="font-bold text-primary">{item.m}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-6">
                                  <div>
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">AI Explanation</h4>
                                      <div className="flex gap-1">
                                        {["quick", "exam", "revision"].map((l: any) => (
                                          <button 
                                            key={l}
                                            onClick={() => setExplanationLevel(l)}
                                            className={`rounded-lg px-2 py-1 text-[9px] font-bold uppercase tracking-widest border transition-all ${
                                              explanationLevel === l ? 'bg-primary border-primary text-primary-foreground' : 'bg-surface border-border text-muted-foreground'
                                            }`}
                                          >
                                            {l}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    <div className="mt-4 rounded-xl border border-border bg-card p-5">
                                      {explanationLevel === 'quick' && (
                                        <div className="animate-in fade-in duration-300">
                                          <p className="text-xs leading-relaxed text-muted-foreground">
                                            Imagine a flow of logic where every event depends on the one before it. {topic.name} is just a map of these "ifs" and "thens".
                                          </p>
                                        </div>
                                      )}
                                      {explanationLevel === 'exam' && (
                                        <div className="animate-in fade-in duration-300 space-y-3">
                                          <p className="text-xs leading-relaxed text-foreground font-semibold underline decoration-primary/30">Standard Definition:</p>
                                          <p className="text-xs leading-relaxed text-muted-foreground">
                                            {topic.name} is a probabilistic graphical model that represents a set of variables and their conditional dependencies via a directed acyclic graph (DAG).
                                          </p>
                                        </div>
                                      )}
                                      {explanationLevel === 'revision' && (
                                        <div className="animate-in fade-in duration-300">
                                          <ul className="space-y-2">
                                            {["DAG", "Node Dependencies", "CPT Tables"].map(kw => (
                                              <li key={kw} className="flex items-center gap-2 text-[10px] font-bold">
                                                <Zap className="size-3 text-amber-400" /> {kw}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>

                                    <div className="mt-6">
                                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">Tamil Tutorials</h4>
                                      <div className="mt-3 space-y-2">
                                        <div className="flex items-center justify-between rounded-xl bg-red-500/5 border border-red-500/10 p-3">
                                          <div className="flex items-center gap-3">
                                            <Youtube className="size-4 text-red-500" />
                                            <div>
                                              <p className="text-[10px] font-bold">{topic.name} விளக்கம்</p>
                                              <p className="text-[9px] text-muted-foreground">Learn Engineering Tamil</p>
                                            </div>
                                          </div>
                                          <button className="text-[9px] font-bold uppercase text-red-500 hover:underline">Watch</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                        <Plus className="size-4" /> Add custom topic or sub-unit
                      </button>
                    </div>
                  </>
                )}

                {activeTab === "Unit Notes" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-xl font-bold">Unit Analysis</h2>
                      {analysisStatus === "idle" && (
                        <button 
                          onClick={startAnalysis}
                          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:-translate-y-0.5 transition-all"
                        >
                          <Sparkles className="size-3.5" /> Analyze Notes with AI
                        </button>
                      )}
                    </div>

                    {analysisStatus !== "idle" && analysisStatus !== "complete" && (
                      <div className="rounded-3xl border border-border bg-card p-8 text-center">
                        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary animate-pulse">
                          {analysisStatus === "uploading" ? <Upload className="size-8" /> : <Loader2 className="size-8 animate-spin" />}
                        </div>
                        <h3 className="mt-6 font-display font-bold text-lg">
                          {analysisStatus === "uploading" ? "Uploading Unit PDF..." : "AI Analyzing Content..."}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
                          Extracting formulas, diagrams and key definitions from your lecture notes.
                        </p>
                        <div className="mt-8 h-2 w-full max-w-md mx-auto overflow-hidden rounded-full bg-surface">
                          <div 
                            className="h-full bg-primary transition-all duration-300 ease-out"
                            style={{ width: `${processingProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {analysisStatus === "complete" && (
                      <div className="grid gap-6">
                        <div className="rounded-3xl border border-border bg-accent/5 p-6 border-accent/20">
                          <div className="flex items-center gap-2 text-accent">
                            <CheckCircle2 className="size-5" />
                            <h3 className="font-display font-bold">Analysis Complete</h3>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            AI has processed your notes and extracted key exam-relevant details.
                          </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-3">
                          {extractedConcepts.map((concept) => (
                            <div key={concept.category} className="rounded-2xl border border-border bg-card p-5">
                              <div className="flex items-center gap-2 mb-4">
                                {concept.category === "Definitions" && <MessageSquare className="size-4 text-blue-400" />}
                                {concept.category === "Formulas" && <Zap className="size-4 text-amber-400" />}
                                {concept.category === "Key Diagrams" && <ImageIcon className="size-4 text-emerald-400" />}
                                <h4 className="text-xs font-bold uppercase tracking-wider">{concept.category}</h4>
                              </div>
                              <ul className="space-y-3">
                                {concept.items.map((item, idx) => (
                                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-border" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysisStatus === "idle" && (
                      <div className="rounded-3xl border-2 border-dashed border-border p-12 text-center bg-surface/30">
                        <div className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
                          <Upload className="size-6" />
                        </div>
                        <h3 className="mt-4 font-semibold">Upload Unit Materials</h3>
                        <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
                          Upload your PDF notes or lecture slides to get AI-powered exam guidance.
                        </p>
                        <button 
                          onClick={startAnalysis}
                          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-surface transition-colors"
                        >
                          Select PDF Files
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "Previous Papers" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-xl font-bold">PYQ Analysis & Patterns</h2>
                      <div className="flex items-center gap-2 rounded-xl bg-accent/10 px-3 py-1.5 text-[10px] font-bold text-accent border border-accent/20">
                        <BarChart3 className="size-3" /> Based on historical patterns
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {pyqData.map((item, idx) => (
                        <div key={idx} className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/50 group">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="space-y-4 flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  item.importance === 'Very High' ? 'bg-red-500/15 text-red-500' : 'bg-accent/15 text-accent'
                                }`}>
                                  {item.importance} Priority
                                </span>
                                <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                                  <History className="size-3" /> Frequently asked in PYQs
                                </span>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-bold text-foreground leading-relaxed group-hover:text-accent transition-colors">
                                  Question: "{item.question}"
                                </h4>
                                <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                                  <BookOpen className="size-3 text-primary" /> 
                                  Related Unit Topic: <span className="text-foreground font-medium">{item.topic}</span>
                                </p>
                              </div>

                              <div className="rounded-xl bg-surface/50 p-4 border border-border/50">
                                <p className="text-[11px] font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                                  <Sparkles className="size-3" /> AI Preparation Guide
                                </p>
                                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                  {item.preparation}
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0 text-left md:text-right border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 space-y-3">
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Expected Marks</p>
                                <p className="mt-1 text-xl font-black text-foreground">{item.expectedMarks}</p>
                              </div>
                              <button className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-surface px-3 py-2 text-[10px] font-bold border border-border hover:bg-card">
                                View Relevant Notes <ArrowRight className="size-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                      <p className="text-xs text-muted-foreground italic">
                        * Analysis is based on frequently mentioned concepts and repeated year-over-year patterns. 
                        Scoring potential is estimated based on historical mark weightage.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Actions */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-border bg-card overflow-hidden">
                  <div className="bg-surface/50 p-5 border-b border-border">
                    <h3 className="text-sm font-bold">Preparation Assets</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div 
                      onClick={() => setActiveTab("Unit Notes")}
                      className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                        activeTab === "Unit Notes" ? "bg-primary/5 border-primary/30" : "border-border hover:bg-surface/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                         <div className="size-10 rounded-xl bg-red-500/10 grid place-items-center text-red-500">
                            <FileText className="size-5" />
                         </div>
                         <div className="min-w-0">
                           <p className="text-xs font-semibold truncate">Unit_3_Notes.pdf</p>
                           <p className="text-[10px] text-muted-foreground">PDF Document</p>
                         </div>
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => setActiveTab("Previous Papers")}
                      className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                        activeTab === "Previous Papers" ? "bg-accent/5 border-accent/30" : "border-border hover:bg-surface/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                         <div className="size-10 rounded-xl bg-blue-500/10 grid place-items-center text-blue-500">
                            <FileText className="size-5" />
                         </div>
                         <div className="min-w-0">
                           <p className="text-xs font-semibold truncate">PYQ_Bank_2018-24.pdf</p>
                           <p className="text-[10px] text-muted-foreground">PDF Question Bank</p>
                         </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      <button 
                        onClick={startAnalysis}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:-translate-y-0.5 transition-transform neon-glow-cyan"
                      >
                        <Upload className="size-3.5" /> Upload New Notes
                      </button>
                      <button 
                        onClick={() => setActiveTab("Tamil Tutorials")}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-xs font-bold hover:bg-surface transition-colors"
                      >
                        <Youtube className="size-3.5" /> Open Tamil Lectures
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-card overflow-hidden">
                  <div className="bg-surface/50 p-5 border-b border-border flex items-center justify-between">
                    <h3 className="text-sm font-bold">Preparation Analytics</h3>
                    <Sparkles className="size-3.5 text-accent" />
                  </div>
                  <div className="p-5">
                    <div className="space-y-6">
                      <motion.div 
                        animate={{ 
                          y: [0, -6, 0],
                          rotate: [0, 0.5, 0]
                        }}
                        transition={{
                          duration: 7,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="aspect-[4/3] w-full relative rounded-2xl bg-surface/30 overflow-hidden group cursor-crosshair border border-border"
                      >
                        <div className="h-full w-full opacity-90 transition-transform duration-500 group-hover:scale-105">
                          <ModelViewer />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent flex flex-col justify-end p-5 pointer-events-none">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Interactive 3D Model</p>
                          <h4 className="mt-1 text-sm font-bold">Concept Analysis</h4>
                        </div>
                      </motion.div>

                      <div className="grid grid-cols-2 gap-3">
                        <motion.div 
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                          className="rounded-2xl bg-surface/50 border border-border p-4"
                        >
                          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Selection Rate</p>
                          <p className="mt-1 text-lg font-black text-accent">84%</p>
                          <div className="mt-2 h-1 w-full bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-accent w-[84%]" />
                          </div>
                        </motion.div>
                        <motion.div 
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                          className="rounded-2xl bg-surface/50 border border-border p-4"
                        >
                          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Accuracy</p>
                          <p className="mt-1 text-lg font-black text-primary">92%</p>
                          <div className="mt-2 h-1 w-full bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[92%]" />
                          </div>
                        </motion.div>
                      </div>

                      <motion.div 
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                        className="p-4 rounded-2xl bg-surface/50 border border-border"
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest mb-3">
                          <span className="text-muted-foreground">Revision KPI</span>
                          <span className="text-accent">Active</span>
                        </div>
                        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-accent w-[72%] rounded-full shadow-[0_0_8px_rgba(var(--accent),0.5)]" />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-[image:var(--gradient-brand)] p-6 text-brand-foreground relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="font-display font-bold">Exam Countdown</h3>
                    <p className="mt-1 text-[11px] opacity-80 uppercase tracking-[0.1em]">Semester Assessment 2</p>
                    
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold tracking-tighter">--</span>
                      <span className="text-sm font-medium opacity-80">days</span>
                    </div>
                    
                    <p className="mt-4 text-[10px] leading-relaxed opacity-90">
                      Stay updated with your preparation progress here.
                    </p>
                  </div>
                  <Sparkles className="absolute -bottom-4 -right-4 size-24 opacity-10 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}