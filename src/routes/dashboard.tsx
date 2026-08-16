import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
  { id: "cs3491", name: "Artificial Intelligence and Machine Learning", code: "CS3491", progress: 65 },
  { id: "cs3492", name: "Database Management Systems", code: "CS3492", progress: 40 },
  { id: "ma3491", name: "Statistics and Numerical Methods", code: "MA3491", progress: 20 },
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

function Dashboard() {
  const [activeSubject] = useState(subjects[0]);
  const [activeUnit] = useState(3);

  if (!activeSubject) return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card md:block">
        <div className="flex h-full flex-col">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="https://www.rajalakshmi.org/images/logo.png" 
                alt="REC Logo" 
                className="h-8 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-display text-base font-bold tracking-tight leading-tight">SemPrep AI</span>
                <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-tighter">REC Edition</span>
              </div>
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
          <div className="flex items-center gap-3 md:hidden">
             <img 
               src="https://www.rajalakshmi.org/images/logo.png" 
               alt="REC Logo" 
               className="h-7 w-auto object-contain"
             />
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
               <span className="text-sm font-medium">Kishore A</span>
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
                    { label: "Topics Studied", value: "12 / 20", color: "text-accent" },
                    { label: "Exam Date", value: "12 Jun", color: "text-foreground" },
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
                    <p className="text-sm font-semibold text-foreground">Priority: Hidden Markov Models</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      This topic appeared in 4 out of the last 6 papers. Based on your progress, mastering this now gives you the highest scoring potential.
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
                {["Preparation Plan", "Unit Notes", "Previous Papers", "Tamil Tutorials"].map((tab, i) => (
                  <button
                    key={tab}
                    className={`pb-4 text-sm font-medium transition-colors ${
                      i === 0 ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Preparation Plan Content */}
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
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
              </div>

              {/* Sidebar Actions */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-border bg-card overflow-hidden">
                  <div className="bg-surface/50 p-5 border-b border-border">
                    <h3 className="text-sm font-bold">Preparation Assets</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="rounded-2xl border border-border p-4 transition-colors hover:bg-surface/50 cursor-pointer">
                      <div className="flex items-center gap-3">
                         <div className="size-10 rounded-xl bg-red-500/10 grid place-items-center text-red-500">
                            <FileText className="size-5" />
                         </div>
                         <div className="min-w-0">
                           <p className="text-xs font-semibold truncate">Unit_3_Notes.pdf</p>
                           <p className="text-[10px] text-muted-foreground">Uploaded 2 days ago</p>
                         </div>
                      </div>
                    </div>
                    
                    <div className="rounded-2xl border border-border p-4 transition-colors hover:bg-surface/50 cursor-pointer">
                      <div className="flex items-center gap-3">
                         <div className="size-10 rounded-xl bg-blue-500/10 grid place-items-center text-blue-500">
                            <FileText className="size-5" />
                         </div>
                         <div className="min-w-0">
                           <p className="text-xs font-semibold truncate">PYQ_Bank_2018-24.pdf</p>
                           <p className="text-[10px] text-muted-foreground">Last updated yesterday</p>
                         </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:-translate-y-0.5 transition-transform">
                        <Upload className="size-3.5" /> Upload New Notes
                      </button>
                      <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-xs font-bold hover:bg-surface transition-colors">
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
                      <span className="text-4xl font-extrabold tracking-tighter">14</span>
                      <span className="text-sm font-medium opacity-80">days left</span>
                    </div>
                    
                    <p className="mt-4 text-[10px] leading-relaxed opacity-90">
                      You've completed 3/5 units. 
                      Finish Unit 3 by tomorrow to stay on track.
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