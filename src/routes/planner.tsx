import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import {
  getUnits,
  getStudyPlan,
  generateStudyPlan,
  toggleStudyTask,
} from "@/lib/prep.functions";
import {
  Loader2,
  CalendarDays,
  Clock,
  Layers,
  Sparkles,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Target,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Sidebar, MobileNav } from "@/components/Sidebar";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Study Planner | SemPrep AI" },
      { name: "description", content: "Personalized revision schedule for REC students." },
    ],
  }),
  component: PlannerPage,
});

const LEVELS = ["beginner", "intermediate", "advanced"] as const;

function PlannerPage() {
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState<any>(null);

  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [examDate, setExamDate] = useState("");
  const [dailyHours, setDailyHours] = useState(2);
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("beginner");

  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [busyItem, setBusyItem] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUnits = useServerFn(getUnits);
  const loadPlan = useServerFn(getStudyPlan);
  const runGenerate = useServerFn(generateStudyPlan);
  const runToggle = useServerFn(toggleStudyTask);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setChecking(false);
      if (!session) {
        setLoading(false);
        return;
      }
      try {
        const [u, p] = await Promise.all([loadUnits(), loadPlan()]);
        setUnits(u as any[]);
        setPlan(p);
        if (p?.plan) {
          setExamDate((p.plan as any).exam_date);
          setDailyHours((p.plan as any).study_hours_per_day ?? 2);
          setLevel(((p.plan as any).preparation_level ?? "beginner") as any);
        }
      } catch (e: any) {
        setError(e?.message || "Could not load your planner data.");
      } finally {
        setLoading(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const days = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    for (const item of plan?.items ?? []) {
      (grouped[item.scheduled_date] ||= []).push(item);
    }
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [plan]);

  const completedCount = (plan?.items ?? []).filter((i: any) => i.completed).length;
  const totalCount = (plan?.items ?? []).length;
  const progress = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleUnit = (id: string) =>
    setSelectedUnits((prev) => (prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]));

  const handleGenerate = async () => {
    if (!examDate) {
      toast.error("Pick your exam date first.");
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const result = await runGenerate({
        data: { examDate, dailyHours: Number(dailyHours), units: selectedUnits, level },
      });
      setPlan(result);
      toast.success("Revision plan generated and saved.");
    } catch (e: any) {
      const msg = e?.message || "Could not generate your plan.";
      setError(msg);
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggle = async (item: any) => {
    setBusyItem(item.id);
    try {
      const updated: any = await runToggle({
        data: { itemId: item.id, completed: !item.completed },
      });
      setPlan((prev: any) => ({
        ...prev,
        items: prev.items.map((i: any) => (i.id === updated.id ? { ...i, ...updated } : i)),
      }));
      const fresh = await loadPlan();
      setPlan(fresh);
    } catch (e: any) {
      toast.error(e?.message || "Could not update the task.");
    } finally {
      setBusyItem(null);
    }
  };

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
        activeLink="planner"
      />

      <Sidebar activeLink="/planner" />
      <MobileNav activeLink="/planner" />

      <main className="relative z-10 mx-auto max-w-7xl px-5 lg:pl-80 pt-28 pb-20">
        <h1 className="font-display text-3xl font-black uppercase tracking-tight mb-2">
          Study Planner
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Build a day-by-day revision schedule from your highest-priority topics.
        </p>

        {!session ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
            <p className="text-muted-foreground">
              Sign in with your @rajalakshmi.edu.in account to build a revision plan.
            </p>
          </div>
        ) : loading ? (
          <div className="grid place-items-center rounded-3xl border border-white/10 bg-white/5 p-16">
            <Loader2 className="size-6 animate-spin text-accent" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            {/* Configuration */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl h-fit">
              <h2 className="font-display text-lg font-bold uppercase tracking-wide mb-5">
                Plan Setup
              </h2>

              <label className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <CalendarDays className="size-3.5" /> Exam date
              </label>
              <input
                type="date"
                value={examDate}
                min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
                onChange={(e) => setExamDate(e.target.value)}
                className="mb-5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm outline-none focus:border-primary/60"
              />

              <label className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Clock className="size-3.5" /> Study hours per day: {dailyHours}h
              </label>
              <input
                type="range"
                min={0.5}
                max={12}
                step={0.5}
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="mb-5 w-full accent-[var(--neon-cyan)]"
              />

              <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Target className="size-3.5" /> Preparation level
              </label>
              <div className="mb-5 grid grid-cols-3 gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    className={`rounded-xl border px-2 py-2 text-xs capitalize transition ${
                      level === l
                        ? "border-primary/60 bg-primary/15 text-primary"
                        : "border-white/10 bg-black/30 text-muted-foreground hover:border-white/25"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Layers className="size-3.5" /> Units {selectedUnits.length === 0 && "(all)"}
              </label>
              <div className="mb-6 max-h-52 space-y-2 overflow-y-auto pr-1">
                {units.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No units available yet. Upload notes from the dashboard to create them.
                  </p>
                ) : (
                  units.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => toggleUnit(u.id)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition ${
                        selectedUnits.includes(u.id)
                          ? "border-accent/60 bg-accent/15"
                          : "border-white/10 bg-black/30 hover:border-white/25"
                      }`}
                    >
                      <span>
                        Unit {u.unit_number} — {u.title}
                      </span>
                      {selectedUnits.includes(u.id) ? (
                        <CheckCircle2 className="size-4 text-accent" />
                      ) : (
                        <Circle className="size-4 text-white/25" />
                      )}
                    </button>
                  ))
                )}
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating || !examDate}
                className="neon-glow-cyan flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" /> Generate Revision Plan
                  </>
                )}
              </button>

              {error && (
                <p className="mt-4 flex items-start gap-2 text-xs text-destructive">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0" /> {error}
                </p>
              )}
            </section>

            {/* Schedule */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              {totalCount === 0 ? (
                <div className="grid h-full min-h-[280px] place-items-center text-center">
                  <div>
                    <CalendarDays className="mx-auto mb-3 size-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No schedule yet. Set your exam date and generate a plan.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-display text-lg font-bold uppercase tracking-wide">
                      Your Schedule
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {completedCount}/{totalCount} tasks done · {progress}%
                    </span>
                  </div>
                  <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-[var(--gradient-brand)]"
                      style={{ background: "var(--gradient-brand)" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  <div className="space-y-5">
                    {days.map(([date, items], idx) => (
                      <div key={date} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="font-display text-sm font-bold uppercase tracking-wide">
                            Day {idx + 1}
                          </span>
                          <span className="text-xs text-muted-foreground">{date}</span>
                        </div>
                        <ul className="space-y-2">
                          {items.map((item: any) => (
                            <li key={item.id}>
                              <button
                                onClick={() => handleToggle(item)}
                                disabled={busyItem === item.id}
                                className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2.5 text-left transition hover:border-white/20 disabled:opacity-60"
                              >
                                {busyItem === item.id ? (
                                  <Loader2 className="size-4 animate-spin text-primary" />
                                ) : item.completed ? (
                                  <CheckCircle2 className="size-4 text-[var(--neon-green)]" />
                                ) : (
                                  <Circle className="size-4 text-white/30" />
                                )}
                                <span
                                  className={`flex-1 text-sm ${
                                    item.completed ? "text-muted-foreground line-through" : ""
                                  }`}
                                >
                                  {item.topic?.title || "Topic"}
                                </span>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                  {item.priority} · {item.duration_minutes}m
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
