import { createFileRoute } from "@tanstack/react-router";
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
import logoAsset from "@/assets/rec-logo.png.asset.json";

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
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#top" className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-xl bg-[image:var(--gradient-brand)] opacity-40 blur transition duration-300 group-hover:opacity-70" />
              <div className="relative overflow-hidden rounded-xl border-2 border-[#FDB813] bg-[#662D91] p-0.5">
                <img src={logoAsset.url} alt="REC Logo" className="size-8 object-contain" />
              </div>
            </div>
            <span className="font-display text-lg font-bold tracking-tight">SemPrep AI</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a className="transition-colors hover:text-foreground" href="#how">How it works</a>
            <a className="transition-colors hover:text-foreground" href="#features">Features</a>
            <a className="transition-colors hover:text-foreground" href="#tamil">Tamil help</a>
          </nav>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Go to Dashboard
          </a>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative overflow-hidden min-h-[600px] lg:min-h-[800px] flex items-center">
          {/* Spline 3D Design Background */}
          <div className="absolute inset-0 z-0">
            <iframe
              src="https://my.spline.design/room-bec3f548-ef95-486b-ac90-d11b131772e5/"
              frameBorder="0"
              width="100%"
              height="100%"
              className="h-full w-full pointer-events-none opacity-40 lg:opacity-60"
              title="3D Background Design"
            />
            <div
              className="pointer-events-none absolute inset-0 z-10"
              style={{ backgroundImage: "var(--gradient-hero)" }}
              aria-hidden="true"
            />
          </div>
          <div className="relative z-20 mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-16 md:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                <Sparkles className="size-3.5" /> Built for REC students
              </span>
              <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Your unit notes in.
                <br />
                <span className="bg-[image:var(--gradient-brand)] bg-clip-text text-transparent">
                  An exam strategy out.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                SemPrep AI reads your unit PDFs, cross-checks a decade of previous-year question
                papers, and tells you exactly what to study, in what order, and how to write it for
                full marks — with Tamil YouTube tutorials for the concepts that refuse to click.
              </p>
              <div id="start" className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition-transform hover:-translate-y-0.5"
                >
                  <Upload className="size-4" /> Open Dashboard
                </a>
                <a
                  href="#tamil"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
                >
                  <Play className="size-4" /> See Tamil tutorials
                </a>
              </div>
              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6">
                {[
                  ["Units", "Detailed Analysis"],
                  ["Papers", "PYQ Mapped"],
                  ["Results", "High Scoring Strategy"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="font-display text-2xl font-bold text-accent">{value}</dt>
                    <dd className="mt-1 text-xs text-muted-foreground">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-3xl border border-border bg-card/80 p-5 shadow-[var(--shadow-elevated)] backdrop-blur">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="size-4 text-accent" />
                  CS3491 — Unit III Notes.pdf
                </div>
                <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-accent">
                  Analysed
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                {[
                  ["Bayesian Networks — inference", "Asked 5 / last 6 semesters", "15 marks"],
                  ["Hidden Markov Models", "Asked 4 / last 6 semesters", "13 marks"],
                  ["Naive Bayes classifier", "Asked 3 / last 6 semesters", "13 marks"],
                  ["Approximate inference", "Rare — skip if short on time", "2 marks"],
                ].map(([topic, freq, mark], i) => (
                  <li
                    key={topic}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-surface/60 p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold">{topic}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{freq}</p>
                    </div>
                    <span
                      className={
                        i === 3
                          ? "shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"
                          : "shrink-0 rounded-full bg-primary/20 px-2.5 py-1 text-[11px] font-semibold text-primary"
                      }
                    >
                      {mark}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-xs text-foreground">
                <Youtube className="size-4 shrink-0 text-accent" />
                3 Tamil tutorials attached for Bayesian inference.
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-y border-border bg-surface/40 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
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
                  className="group rounded-3xl border border-border bg-card p-6 transition-colors hover:border-accent/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-accent/15 text-accent">
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
        <section id="features" className="py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
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
                <div key={f.title} className="rounded-3xl border border-border bg-card p-6">
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
        <section id="tamil" className="border-y border-border bg-surface/40 py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <Youtube className="size-3.5" /> தமிழ் tutorials
              </span>
              <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
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
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-5 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
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

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-sm text-muted-foreground sm:flex-row">
          <p>SemPrep AI · Made for Rajalakshmi Engineering College</p>
          <p>© {new Date().getFullYear()} SemPrep AI</p>
        </div>
      </footer>
    </div>
  );
}
