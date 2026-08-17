import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { getImportantTopics, updateTopicMastery } from "@/lib/prep.functions";
import { getExplanation } from "@/lib/study.functions";
import { 
  Loader2, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  PlayCircle, 
  TrendingUp,
  Brain,
  Youtube,
  Zap,
  Star,
  Book
} from "lucide-react";
import { Header } from "@/components/Header";
import { Sidebar, MobileNav } from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/topics")({
  head: () => ({
    meta: [
      { title: "Important Topics | SemPrep AI" },
      { name: "description", content: "High-priority engineering exam topics for REC students." },
    ],
  }),
  component: TopicsPage,
});

function TopicsPage() {
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [explaining, setExplaining] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<any>(null);

  const fetchTopics = useServerFn(getImportantTopics);
  const runExplain = useServerFn(getExplanation);
  const markMastery = useServerFn(updateTopicMastery);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadTopics();
      } else {
        setChecking(false);
      }
    });
  }, []);

  const loadTopics = async () => {
    setLoading(true);
    try {
      const data = await fetchTopics({ data: undefined });
      setTopics(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load topics");
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  const handleExplain = async (topic: any, level: "exam" | "quick" | "revision") => {
    setExplaining(topic.id);
    setExplanation(null);
    try {
      const res: any = await runExplain({
        data: { topic: topic.title, level, subject: "Engineering" },
      });
      setExplanation({ ...res, topicName: topic.title });
    } catch (err) {
      toast.error("Failed to generate explanation");
    } finally {
      setExplaining(null);
    }
  };

  const handleToggleMastery = async (topicId: string, currentScore: number) => {
    try {
      const nextScore = currentScore >= 100 ? 0 : 100;
      await markMastery({ data: { topicId, masteryScore: nextScore } });
      setTopics(prev => prev.map(t => 
        t.id === topicId 
          ? { ...t, progress: [{ ...(t.progress?.[0] || {}), mastery_score: nextScore, status: nextScore === 100 ? 'mastered' : 'weak' }] }
          : t
      ));
      toast.success(nextScore === 100 ? "Topic mastered!" : "Progress reset");
    } catch (err) {
      toast.error("Failed to update mastery");
    }
  };

  const sortedTopics = useMemo(() => {
    return [...topics].sort((a, b) => (b.importance || 0) - (a.importance || 0));
  }, [topics]);

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
        activeLink="topics"
      />

      <Sidebar activeLink="/topics" />
      <MobileNav activeLink="/topics" />

      <main className="relative z-10 mx-auto max-w-7xl px-5 lg:pl-80 pt-28 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="font-display text-4xl font-black uppercase tracking-tight">
              Important Topics
            </h1>
            <p className="text-muted-foreground mt-2">
              High-priority areas based on historical exam patterns and mark weightage.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-pink-500/10 border border-pink-500/20 px-4 py-2 text-pink-400 text-xs font-bold uppercase tracking-widest">
              <Zap className="size-3.5" /> High Priority First
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="size-10 animate-spin text-pink-400" />
            <p className="text-muted-foreground animate-pulse">Ranking priority topics...</p>
          </div>
        ) : sortedTopics.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-20 text-center backdrop-blur-xl">
            <Target className="size-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold mb-2">No topics found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Upload your unit notes in the Dashboard to generate the priority topic list.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {sortedTopics.map((topic, idx) => {
              const mastery = topic.progress?.[0]?.mastery_score || 0;
              const isHighPriority = (topic.importance || 0) > 0.7;
              
              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative rounded-[2rem] border border-white/10 bg-white/5 p-8 hover:bg-white/[0.07] transition-all hover:border-pink-500/30 overflow-hidden"
                >
                  {isHighPriority && (
                    <div className="absolute top-0 right-0 px-6 py-2 bg-pink-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-2xl">
                      High Priority
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`size-12 rounded-2xl flex items-center justify-center ${
                        isHighPriority ? 'bg-pink-500/20 text-pink-400' : 'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        <Brain className="size-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-white transition-colors">{topic.title}</h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1">
                          {topic.marks_weightage || '2/13'} Marks • Exam Freq: {Math.round((topic.exam_frequency || 0.5) * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>Mastery Level</span>
                      <span>{mastery}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${mastery}%` }}
                        className={`h-full rounded-full ${mastery === 100 ? 'bg-emerald-400' : 'bg-cyan-400'}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleExplain(topic, "exam")}
                      disabled={explaining === topic.id}
                      className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                      {explaining === topic.id ? <Loader2 className="size-3 animate-spin" /> : <PlayCircle className="size-4" />}
                      Start Learning
                    </button>
                    <button 
                      onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(topic.title + " engineering Tamil explanation")}`, '_blank')}
                      className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors"
                    >
                      <Youtube className="size-4" /> Tamil Tutorial
                    </button>
                    <button 
                      onClick={() => handleToggleMastery(topic.id, mastery)}
                      className={`col-span-2 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all ${
                        mastery === 100 
                          ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' 
                          : 'bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-400'
                      }`}
                    >
                      <CheckCircle2 className="size-4" /> {mastery === 100 ? 'Mastered' : 'Mark Prepared'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Explanation Modal */}
      <AnimatePresence>
        {explanation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-black/90 backdrop-blur-md p-6"
            onClick={() => setExplanation(null)}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-3xl rounded-[3rem] border border-white/10 bg-[#0a0a12] p-10 shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="size-14 rounded-3xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <Sparkles className="size-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight">{explanation.topicName}</h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1">
                    AI Generated Exam Strategy • REC Standards
                  </p>
                </div>
              </div>

              <div className="prose prose-invert max-h-[60vh] overflow-y-auto pr-6 custom-scrollbar text-lg leading-relaxed text-white/90">
                {explanation.text.split('\n').map((line: string, i: number) => (
                  <p key={i} className={line.startsWith('-') ? 'ml-4' : ''}>
                    {line}
                  </p>
                ))}
              </div>

              <div className="mt-10 flex gap-4">
                <button 
                  onClick={() => setExplanation(null)}
                  className="flex-1 py-4 rounded-[1.5rem] bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-colors"
                >
                  Close Study Guide
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
