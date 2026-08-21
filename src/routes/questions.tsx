import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import {
  getQuestionBank,
  updateTopicMastery,
  getQuestionSolution,
  recordQuestionAttempt,
} from "@/lib/prep.functions";
import {
  Loader2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Sidebar, MobileNav } from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/questions")({
  head: () => ({
    meta: [
      { title: "Question Bank | NexLearn AI" },
      {
        name: "description",
        content: "Previous year questions and practice bank for REC students.",
      },
      { property: "og:title", content: "Question Bank | NexLearn AI" },
      {
        property: "og:description",
        content: "Search, practise and solve previous year questions with AI model answers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuestionsPage,
});

const MARK_FILTERS = ["All", "2", "13", "15"] as const;
const TYPE_FILTERS = ["All", "PYQ", "Practice"] as const;

function QuestionsPage() {
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("All");
  const [selectedMarks, setSelectedMarks] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [solution, setSolution] = useState<string>("");
  const [solutionLoading, setSolutionLoading] = useState(false);
  const [solutionError, setSolutionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [attempted, setAttempted] = useState<Record<string, boolean>>({});

  const fetchQuestions = useServerFn(getQuestionBank);
  const markMastery = useServerFn(updateTopicMastery);
  const fetchSolution = useServerFn(getQuestionSolution);
  const saveAttempt = useServerFn(recordQuestionAttempt);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadQuestions();
      } else {
        setLoading(false);
        setChecking(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const data = await fetchQuestions({ data: { subject: undefined, unit: undefined } });
      setQuestions((data as any[]) || []);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to load questions");
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  const handleMarkPrepared = async (topicId: string) => {
    if (!topicId) {
      toast.error("This question is not linked to a topic yet.");
      return;
    }
    setBusyId(topicId);
    try {
      await markMastery({ data: { topicId, masteryScore: 100 } });
      toast.success("Marked as prepared");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update progress");
    } finally {
      setBusyId(null);
    }
  };

  const openSolution = async (q: any) => {
    setSelectedQuestion(q);
    setSolution("");
    setSolutionError(null);
    setSolutionLoading(true);
    try {
      const res: any = await fetchSolution({ data: { questionId: q.id } });
      setSolution(res.answer);
    } catch (err: any) {
      setSolutionError(err?.message || "Could not generate the model answer.");
    } finally {
      setSolutionLoading(false);
    }
  };

  const handleAttempt = async (q: any, isCorrect: boolean) => {
    setBusyId(q.id + (isCorrect ? "-y" : "-n"));
    try {
      await saveAttempt({ data: { questionId: q.id, isCorrect } });
      setAttempted((prev) => ({ ...prev, [q.id]: isCorrect }));
      toast.success(isCorrect ? "Attempt saved as correct" : "Attempt saved — revise this one");
    } catch (err: any) {
      toast.error(err?.message || "Could not save your attempt");
    } finally {
      setBusyId(null);
    }
  };

  const units = useMemo(() => {
    const map = new Map<string, string>();
    questions.forEach((q) => {
      if (q.topic?.unit_id) map.set(q.topic.unit_id, q.topic.unit_id);
    });
    return ["All", ...Array.from(map.keys())];
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        q.question_text.toLowerCase().includes(search.toLowerCase()) ||
        (q.topic?.title || "").toLowerCase().includes(search.toLowerCase());
      const matchesUnit = selectedUnit === "All" || q.topic?.unit_id === selectedUnit;
      const matchesMarks = selectedMarks === "All" || String(q.marks) === selectedMarks;
      const matchesType =
        selectedType === "All" ||
        (selectedType === "PYQ" ? !!q.is_pyq : !q.is_pyq);
      return matchesSearch && matchesUnit && matchesMarks && matchesType;
    });
  }, [questions, search, selectedUnit, selectedMarks, selectedType]);

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
        activeLink="questions"
      />

      <Sidebar activeLink="/questions" />
      <MobileNav activeLink="/questions" />

      <main className="relative z-10 mx-auto max-w-7xl px-5 lg:pl-80 pt-28 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <h1 className="font-display text-4xl font-black uppercase tracking-tight">
              Question Bank
            </h1>
            <p className="text-muted-foreground mt-2">
              Browse previous exam questions and practice material extracted from your notes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-2xl border border-white/10 bg-white/5 outline-none focus:border-cyan-400/50 w-64 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={`p-2.5 rounded-2xl border transition-colors ${
                showFilters
                  ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
              aria-label="Toggle filters"
            >
              <Filter className="size-5" />
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mb-8 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl md:grid-cols-3">
                <div>
                  <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Marks
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {MARK_FILTERS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSelectedMarks(m)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                          selectedMarks === m
                            ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-300"
                            : "border-white/10 bg-black/30 text-muted-foreground hover:border-white/25"
                        }`}
                      >
                        {m === "All" ? "All" : `${m} marks`}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Type
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TYPE_FILTERS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedType(t)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                          selectedType === t
                            ? "border-amber-500/50 bg-amber-500/15 text-amber-300"
                            : "border-white/10 bg-black/30 text-muted-foreground hover:border-white/25"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Unit
                  </p>
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs outline-none focus:border-cyan-400/50"
                  >
                    {units.map((u) => (
                      <option key={u} value={u} className="bg-[#0a0a12]">
                        {u === "All" ? "All units" : `Unit ${u.slice(0, 8)}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="size-10 animate-spin text-cyan-400" />
            <p className="text-muted-foreground animate-pulse">Syncing Question Bank...</p>
          </div>
        ) : !session ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-20 text-center backdrop-blur-xl">
            <p className="text-muted-foreground">
              Sign in with your @rajalakshmi.edu.in account to open the Question Bank.
            </p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-20 text-center backdrop-blur-xl">
            <AlertCircle className="size-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold mb-2">No questions found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {search || selectedMarks !== "All" || selectedType !== "All"
                ? "Try adjusting your search filters."
                : "Upload study materials in the Dashboard to populate your Question Bank."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredQuestions.map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                className="group relative rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/[0.07] transition-all hover:border-cyan-500/30"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          q.is_pyq
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        }`}
                      >
                        {q.is_pyq ? `PYQ ${q.year_semester || ""}` : "Practice"}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {q.topic?.title || "General"} • {q.marks} Marks
                      </span>
                      {attempted[q.id] !== undefined && (
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${
                            attempted[q.id] ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {attempted[q.id] ? "Attempted · correct" : "Attempted · revise"}
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-medium leading-relaxed group-hover:text-white transition-colors">
                      {q.question_text}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Practise:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAttempt(q, true)}
                        disabled={busyId === q.id + "-y"}
                        className="flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50"
                      >
                        {busyId === q.id + "-y" ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="size-3.5" />
                        )}
                        I answered this
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAttempt(q, false)}
                        disabled={busyId === q.id + "-n"}
                        className="flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-[11px] font-bold text-rose-400 hover:bg-rose-500/20 disabled:opacity-50"
                      >
                        {busyId === q.id + "-n" ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <XCircle className="size-3.5" />
                        )}
                        Need revision
                      </button>
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openSolution(q)}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors"
                    >
                      <Eye className="size-4" /> View Solution
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkPrepared(q.topic_id)}
                      disabled={busyId === q.topic_id}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
                    >
                      {busyId === q.topic_id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="size-4" />
                      )}
                      Mark Prepared
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-black/80 backdrop-blur-sm p-6"
            onClick={() => setSelectedQuestion(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-[#0a0a12] p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-black uppercase mb-2 flex items-center gap-2">
                <Sparkles className="size-5 text-cyan-400" /> Model Answer
              </h3>
              <p className="text-muted-foreground italic mb-6">
                “{selectedQuestion.question_text}”
              </p>

              <div className="max-h-[50vh] overflow-y-auto pr-4">
                {solutionLoading ? (
                  <div className="flex items-center gap-3 py-10 text-sm text-muted-foreground">
                    <Loader2 className="size-5 animate-spin text-cyan-400" />
                    Generating a {selectedQuestion.marks}-mark model answer…
                  </div>
                ) : solutionError ? (
                  <p className="flex items-start gap-2 py-6 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" /> {solutionError}
                  </p>
                ) : (
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {solution}
                  </pre>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                {solutionError && (
                  <button
                    type="button"
                    onClick={() => openSolution(selectedQuestion)}
                    className="flex-1 py-4 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 font-bold text-cyan-300 hover:bg-cyan-500/25 transition-colors"
                  >
                    Retry
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedQuestion(null)}
                  className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-colors"
                >
                  Close Solution
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
