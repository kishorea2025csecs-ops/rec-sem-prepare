import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { getQuestionBank, updateTopicMastery } from "@/lib/prep.functions";
import { 
  Loader2, 
  Search, 
  Filter, 
  BookOpen, 
  CheckCircle2, 
  PlayCircle, 
  ChevronRight,
  Eye,
  Star,
  AlertCircle
} from "lucide-react";
import { Header } from "@/components/Header";
import { Sidebar, MobileNav } from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/questions")({
  head: () => ({
    meta: [
      { title: "Question Bank | SemPrep AI" },
      { name: "description", content: "Previous year questions and practice bank for REC students." },
    ],
  }),
  component: QuestionsPage,
});

function QuestionsPage() {
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const fetchQuestions = useServerFn(getQuestionBank);
  const markMastery = useServerFn(updateTopicMastery);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadQuestions();
      } else {
        setChecking(false);
      }
    });
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const data = await fetchQuestions({ data: { subject: undefined, unit: undefined } });
      setQuestions(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  const handleMarkPrepared = async (topicId: string) => {
    try {
      await markMastery({ data: { topicId, masteryScore: 100 } });
      toast.success("Marked as prepared");
      // Could refresh stats here or update local state
    } catch (err) {
      toast.error("Failed to update progress");
    }
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = q.question_text.toLowerCase().includes(search.toLowerCase()) || 
                           (q.topic?.title || '').toLowerCase().includes(search.toLowerCase());
      const matchesUnit = selectedUnit === "All" || q.topic?.unit_id === selectedUnit;
      // Difficulty mapping logic if available, otherwise just use marks as proxy
      return matchesSearch && matchesUnit;
    });
  }, [questions, search, selectedUnit]);

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
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
            <button className="p-2.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
              <Filter className="size-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="size-10 animate-spin text-cyan-400" />
            <p className="text-muted-foreground animate-pulse">Syncing Question Bank...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-20 text-center backdrop-blur-xl">
            <AlertCircle className="size-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold mb-2">No questions found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {search ? "Try adjusting your search filters." : "Upload study materials in the Dashboard to populate your Question Bank."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredQuestions.map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/[0.07] transition-all hover:border-cyan-500/30"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        q.is_pyq ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}>
                        {q.is_pyq ? `PYQ ${q.year_semester || ''}` : 'Practice'}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {q.topic?.title || 'General'} • {q.marks} Marks
                      </span>
                    </div>
                    <p className="text-lg font-medium leading-relaxed group-hover:text-white transition-colors">
                      {q.question_text}
                    </p>
                  </div>
                  
                  <div className="flex md:flex-col justify-end gap-2 shrink-0">
                    <button 
                      onClick={() => setSelectedQuestion(q)}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors"
                    >
                      <Eye className="size-4" /> View Solution
                    </button>
                    <button 
                      onClick={() => handleMarkPrepared(q.topic_id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-colors"
                    >
                      <CheckCircle2 className="size-4" /> Mark Prepared
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Solution Modal placeholder */}
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
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-black uppercase mb-4">Model Answer</h3>
              <p className="text-muted-foreground italic mb-6">"{selectedQuestion.question_text}"</p>
              
              <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                <div>
                  <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-widest mb-2">Key Concepts</h4>
                  <p className="text-sm leading-relaxed">
                    Based on your notes, this question requires explaining {selectedQuestion.topic?.title}. 
                    Focus on the fundamental definitions and key structural diagrams provided in Unit 1.
                  </p>
                </div>
                
                <div className="rounded-2xl bg-white/5 p-5 border border-white/5">
                  <p className="text-sm text-center italic text-muted-foreground">
                    Detailed step-by-step model answers are generated in real-time when you select "Start Learning" for this topic in the Topics section.
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedQuestion(null)}
                className="mt-8 w-full py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-colors"
              >
                Close Solution
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
