import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  GraduationCap,
  LineChart,
  ListChecks,
  Play,
  Sparkles,
  Target,
  Timer,
  Upload,
  Youtube,
} from "lucide-react";
import logoAsset from "@/assets/logo-glow.png.asset.json";
import brainVideoAsset from "@/assets/brain-video.png.asset.json";
import backgroundVideoAsset from "@/assets/background-video.mp4.asset.json";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef, Suspense } from "react";
import { StudySpace } from "@/components/StudySpace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SemPrep AI — Crack Semester Exams with Your Own Notes" },
      {
        name: "description",
        content:
          "Upload your unit notes, let AI mine previous-year papers, get a topic-priority plan and Tamil YouTube tutorials built for REC engineering students.",
      },
      { property: "og:title", content: "SemPrep AI — Crack Semester Exams with Your Own Notes" },
      {
        property: "og:description",
        content:
          "AI exam prep for Rajalakshmi Engineering College: unit PDFs in, important questions, scoring strategy and Tamil video help out.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    icon: Upload,
    title: "Upload your unit PDF",
    body: "Drop the unit notes your faculty shared. Scanned, typed or handwritten — the AI reads it all.",
  },
  {
    icon: BrainCircuit,
    title: "AI understands the notes",
    body: "Every definition, derivation and diagram is mapped into a concept graph for that unit.",
  },
  {
    icon: FileText,
    title: "Previous papers analysed",
    body: "Anna University and REC internal papers are mined for repeat patterns and mark weightage.",
  },
  {
    icon: Target,
    title: "Important topics ranked",
    body: "You see exactly which topics carry the marks, and which ones you can safely skip tonight.",
  },
  {
    icon: GraduationCap,
    title: "Learn how to score",
    body: "Model answers, keyword lists and 2/13/15-mark writing structure for each topic.",
  },
  {
    icon: Youtube,
    title: "Tamil video backup",
    body: "Stuck on a concept? Handpicked Tamil YouTube explanations play right beside your notes.",
  },
];

const features = [
  {
    icon: ListChecks,
    title: "Repeat-question radar",
    body: "Questions that appeared 3+ semesters in a row get flagged first, with the exact year they came from.",
  },
  {
    icon: LineChart,
    title: "Unit-wise mark weightage",
    body: "See the mark distribution across units so your revision time goes where the marks actually live.",
  },
  {
    icon: Timer,
    title: "Night-before mode",
    body: "A compressed plan when the exam is 10 hours away: the 20% of syllabus worth 80% of the paper.",
  },
  {
    icon: Sparkles,
    title: "Answer coach",
    body: "Write your answer, get instant feedback on structure, keywords and diagrams the examiner expects.",
  },
];

function Landing() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-4 z-50 border border-white/10 glass-morphism mx-5 md:mx-auto max-w-6xl overflow-hidden backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 md:px-5 py-3 md:py-4">
          <a href="#top" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-accent/40 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex size-12 items-center justify-center rounded-xl bg-black/40 backdrop-blur-md p-1 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent pointer-events-none" />
                <img src={logoAsset.url} alt="REC Logo" className="size-full object-contain relative z-10 pro-glow-logo" />
              </div>
            </div>
            <span className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">SemPrep AI</span>
          </a>
          <nav className="hidden items-center gap-4 text-[10px] font-black md:flex uppercase tracking-[0.15em]">
            <a className="transition-all duration-500 hover:text-white px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/10 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] backdrop-blur-md relative group overflow-hidden" href="#how">
              <span className="relative z-10">How it works</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </a>
            <a className="transition-all duration-500 hover:text-white px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-purple-500/10 hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(192,132,252,0.3)] backdrop-blur-md relative group overflow-hidden" href="#features">
              <span className="relative z-10">Features</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </a>
            <a className="transition-all duration-500 hover:text-white px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-amber-500/10 hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] backdrop-blur-md relative group overflow-hidden" href="#tamil">
              <span className="relative z-10">Tamil help</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </a>
          </nav>
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 md:px-6 md:py-2.5 text-xs md:text-sm font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 neon-glow-pink shrink-0 whitespace-nowrap"
          >
            Go to Dashboard
          </Link>
        </div>
      </header>

      <main id="top" className="relative">
        {/* Hero Section with The Learner Orbit */}
        <section 
          aria-labelledby="hero-heading"
          className="relative overflow-hidden min-h-[700px] lg:min-h-[900px] flex items-center"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Background Video & Glows */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-[#020205]">
            <video 
              src={backgroundVideoAsset.url} 
              autoPlay 
              loop 
              muted 
              playsInline
              className="absolute inset-0 h-full w-full object-cover opacity-20 grayscale scale-110"
              aria-hidden="true"
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#020205]/40 to-[#020205]" />
            <div className="absolute inset-0 z-10 backdrop-blur-[1px]" />
            <div
              className="pointer-events-none absolute inset-0 z-20"
              style={{ 
                background: "radial-gradient(circle at 50% 50%, transparent 0%, var(--background) 100%)",
                backgroundImage: "var(--gradient-hero)",
                mixBlendMode: "overlay"
              }}
              aria-hidden="true"
            />
            {/* Interactive 3D Study Space */}
            <div className="absolute inset-0 z-[25] opacity-60 pointer-events-none">
              <Suspense fallback={null}>
                <div className="size-full pointer-events-auto">
                  <StudySpace />
                </div>
              </Suspense>
            </div>
          </div>

          {/* Floating Glows & 3D Objects Across Home Screen */}
          <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
            {/* Top Area */}
            <motion.div 
              animate={{ y: [0, -30, 0], rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[10%] left-[5%] size-48 rounded-full bg-gradient-to-tr from-[#00D2FF]/15 to-transparent blur-3xl"
            />
            
            {/* Mid Area */}
            <motion.div 
              animate={{ y: [0, 50, 0], x: [0, 20, 0], rotate: [0, -20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[40%] right-[5%] size-64 rounded-full bg-gradient-to-tr from-[#9D4EDD]/15 to-transparent blur-[100px]"
            />

            {/* Bottom Area */}
            <motion.div 
              animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[10%] left-[10%] size-56 rounded-full bg-gradient-to-tr from-cyan-500/10 to-transparent blur-[80px]"
            />

            {/* Extra Glows for Depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] bg-accent/5 rounded-full blur-[150px]" />
          </div>

          <div className="relative z-20 mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-16 md:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 glass-morphism px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-accent">
                  <Sparkles className="size-3.5" /> Built for REC students
                </span>
                <h1 id="hero-heading" className="mt-6 font-display text-4xl font-black leading-[0.95] tracking-tighter sm:text-6xl lg:text-8xl uppercase">
                  Master your exams 
                  <br />
                  <span className="bg-[image:var(--gradient-brand)] bg-clip-text text-transparent neon-text-cyan font-display tracking-tighter">
                    with The Learner Orbit.
                  </span>
                </h1>
                <p className="mt-6 max-w-xl text-lg text-muted-foreground/90">
                  A sleek, AI-driven preparation interface designed for Rajalakshmi Engineering College. 
                  Turn your unit PDFs into winning strategies and Tamil-supported learning paths.
                </p>
                <div id="start" className="mt-9 flex flex-wrap items-center gap-4">
                  <Link
                    to="/auth/login"
                    className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#0070F3] px-10 py-5 text-base font-black text-white shadow-[0_0_25px_rgba(121,40,202,0.4)] transition-all duration-500 hover:scale-105 active:scale-95 hover:shadow-[0_0_50px_rgba(0,112,243,0.6)] border border-white/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                    <Upload className="size-5 transition-transform group-hover:-translate-y-1 relative z-10" /> 
                    <span className="relative z-10">Start Your Orbit</span>
                  </Link>
                  <a
                    href="#how"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 px-10 py-5 text-base font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 neon-glow-cyan"
                  >
                    <Play className="size-5 text-white" /> 
                    <span>How it works</span>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Interactive 3D Parallax Card */}
            <motion.div 
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              animate={{ 
                y: [0, -10, 0],
                rotateZ: [0, 1, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative hidden lg:block"
            >
              <div className="glass-morphism rounded-[2.5rem] p-8 transition-transform duration-200 ease-out border-white/10 overflow-hidden relative group">
                <div className="absolute -inset-24 bg-gradient-radial from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center text-primary-foreground shadow-lg">
                        <BrainCircuit className="size-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Smart Analysis</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">AI Preparation Engine</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    {[
                      { topic: "Pattern Recognition", freq: "AU Regulation Aware", mark: "AI", icon: Target },
                      { topic: "Note Extraction", freq: "PDF to Concept Map", mark: "PDF", icon: BrainCircuit },
                      { topic: "Tamil Tutorials", freq: "Handpicked Lectures", mark: "TV", icon: Youtube },
                    ].map((item, i) => (
                      <motion.div
                        key={item.topic}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + 0.5 }}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 hover:bg-white/10 transition-colors cursor-default"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="size-4 text-accent" />
                          <div>
                            <p className="text-sm font-bold">{item.topic}</p>
                            <p className="text-[10px] text-muted-foreground">{item.freq}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">
                          {item.mark}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 size-20 rounded-2xl bg-gradient-to-br from-accent/40 to-primary/40 blur-xl animate-pulse-glow" />
              <div className="absolute -bottom-6 -left-6 size-24 rounded-full bg-gradient-to-tr from-primary/40 to-accent/40 blur-xl animate-pulse-glow" />
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="relative z-10 border-y border-white/10 bg-[#020205]/60 backdrop-blur-md py-20 overflow-hidden" aria-labelledby="how-it-works-heading">
          {/* Animated Background Objects for Section */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div 
              animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
              transition={{ duration: 15, repeat: Infinity }}
              className="absolute top-0 right-[10%] size-72 bg-purple-500/5 rounded-full blur-3xl" 
            />
            <motion.div 
              animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
              transition={{ duration: 18, repeat: Infinity }}
              className="absolute bottom-0 left-[5%] size-80 bg-cyan-500/5 rounded-full blur-3xl" 
            />
          </div>
          <div className="mx-auto max-w-6xl px-5">
            <h2 id="how-it-works-heading" className="max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              From a PDF to a plan in six moves
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              No generic study advice. Everything is generated from your syllabus, your notes and
              your department's past papers.
            </p>
            <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="group rounded-3xl border border-white/10 glass-morphism p-6 transition-colors hover:border-accent/50 pro-card-hover"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-accent/15 text-accent neon-glow-purple border border-accent/20">
                      <step.icon className="size-5" />
                    </span>
                    <span className="font-display text-sm font-bold text-muted-foreground">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="relative z-10 py-20 bg-background" aria-labelledby="features-heading">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 id="features-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Study like the paper is already in front of you
              </h2>
              <p className="mt-4 text-muted-foreground">
                Every feature exists for one reason: more marks per hour of revision.
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {[
                  "Works with handwritten and scanned unit notes",
                  "Anna University regulation-aware question banks",
                  "Answers structured for 2, 13 and 15-mark formats",
                  "Free for Rajalakshmi Engineering College students",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {features.map((f) => (
                <div key={f.title} className="rounded-3xl border border-white/10 glass-morphism p-6 pro-card-hover">
                  <span className="grid size-11 place-items-center rounded-2xl bg-primary/15 text-primary">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tamil */}
        <section id="tamil" className="relative z-10 border-y border-white/10 bg-[#020205]/60 backdrop-blur-md py-20" aria-labelledby="tamil-heading">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 glass-morphism px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-primary">
                <Youtube className="size-3.5" /> தமிழ் tutorials
              </span>
              <h2 id="tamil-heading" className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                When English textbooks stop making sense
              </h2>
              <p className="mt-4 text-muted-foreground">
                For every hard concept in your unit, SemPrep AI finds the clearest Tamil explanation
                on YouTube and jumps straight to the timestamp that covers it — no scrubbing through
                two-hour lectures at 2 AM.
              </p>
            </div>
            <div className="space-y-4">
              {[
                ["Bayesian Networks விளக்கம்", "Tamil Tutorials Available"],
                ["Hidden Markov Model எளிமையாக", "Tamil Tutorials Available"],
                ["Naive Bayes problem solving", "Tamil Tutorials Available"],
              ].map(([title, meta]) => (
                <div
                  key={title}
                  className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
                    <Play className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {meta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24" aria-labelledby="cta-heading">
          <div className="mx-auto max-w-4xl px-5 text-center">
            <h2 id="cta-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Semester exams start soon. Your plan can start now.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Upload one unit and see the important-question list in under two minutes.
            </p>
            <a
              href="#start"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition-transform hover:-translate-y-0.5"
            >
              Get started free <ArrowRight className="size-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8" role="contentinfo">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-sm text-muted-foreground sm:flex-row">
          <p>SemPrep AI · Made for Rajalakshmi Engineering College (REC)</p>
          <p>© {new Date().getFullYear()} SemPrep AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
