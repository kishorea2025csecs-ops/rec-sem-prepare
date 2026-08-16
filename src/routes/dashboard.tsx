import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
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
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Student Dashboard | SemPrep AI" },
      { name: "description", content: "Manage your subjects, units and exam preparation progress." },
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
  const [activeSubject] = useState(subjects[0]);
  const [activeUnit] = useState(3);
  const [activeTab, setActiveTab] = useState("Preparation Plan");
  const [analysisStatus, setAnalysisStatus] = useState<"idle" | "uploading" | "analyzing" | "complete">("idle");
  const [processingProgress, setProcessingProgress] = useState(0);

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
            <Link to="/" className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-[image:var(--gradient-brand)] text-brand-foreground">
                <Layout className="size-4" />
              </span>
              <span className="font-display font-bold tracking-tight">SemPrep AI</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            <button className="flex w-full items-center gap-3 rounded-xl bg-primary/10 px-3 py-2 text-sm font-semibold text-primary transition-colors">
              <Layout className="size-4" /> Dashboard
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              <BookOpen className="size-4" /> My Subjects
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              <FileText className="size-4" /> Question Bank
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              <TrendingUp className="size-4" /> Progress
            </button>
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
          <div className="flex items-center gap-4 md:hidden">
             <Layout className="size-5 text-primary" />
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
            <div className="flex items-center gap-3 rounded-full border border-border bg-surface px-3 py-1.5">
               <div className="size-6 rounded-full bg-gradient-to-tr from-accent to-primary" />
               <span className="text-sm font-medium">My Account</span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl p-6 lg:p-10">
          <div className="flex flex-col gap-8">
            {/* Subject Info & Progress */}
            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight">{activeSubject.name}</h1>
                <p className="mt-2 text-muted-foreground">Rajalakshmi Engineering College · Semester 4</p>
                
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[
                    { label: "Completion", value: `${activeSubject.progress}%`, color: "text-primary" },
                    { label: "Topics Studied", value: "Topics List", color: "text-accent" },
                    { label: "Exam Date", value: "Upcoming", color: "text-foreground" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-border bg-card p-4">
                      <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                      <p className={`mt-1 text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-surface/30 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold">Study Recommendation</h3>
                  <AlertCircle className="size-4 text-accent" />
                </div>
                <div className="mt-4 flex items-start gap-4 rounded-2xl border border-accent/20 bg-accent/5 p-4">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground shadow-lg">
                    <TrendingUp className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Priority: Topic Recommendation</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Run AI analysis on your notes to see personalized study priorities based on exam patterns.
                    </p>
                    <button className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-accent hover:underline">
                      Start studying <ArrowRight className="size-3" />
                    </button>
                  </div>
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
                          className="group relative flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-sm"
                        >
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
                                  topic.importance === 'High' ? 'bg-accent/15 text-accent' : 
                                  topic.importance === 'Medium' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                                }`}>
                                  {topic.importance} Priority
                                </span>
                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  <FileText className="size-3" /> {topic.frequency}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-accent">{topic.marks} Marks</p>
                            <button className="mt-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                              <MoreVertical className="size-4" />
                            </button>
                          </div>
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
                        <BarChart3 className="size-3" /> Data from last 6 semesters
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
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:-translate-y-0.5 transition-transform"
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