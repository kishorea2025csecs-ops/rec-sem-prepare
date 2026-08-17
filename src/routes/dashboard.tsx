import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react";
import logoAsset from "@/assets/logo-glow.png.asset.json";
import { SplineScene } from "@/components/SplineScene";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { analyzeMaterial, getExplanation } from "@/lib/study.functions";
import { getPreparationStats } from "@/lib/prep.functions";
import { extractPdfText } from "@/lib/pdf";
import { toast } from "sonner";
import { Canvas } from "@react-three/fiber";
import { ProgressWheel3D } from "@/components/ProgressWheel3D";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Sidebar, MobileNav } from "@/components/Sidebar";

import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Loader2,
  Lock,
  Sparkles,
  Target,
  Trash2,
  Upload,
  Youtube,
  LineChart,
  Target as TargetIcon,
  ListChecks,
  ChevronRight,
  TrendingUp,
  Activity,
  History,
  Calendar,
} from "lucide-react";


export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Study Dashboard | SemPrep AI for REC Students" },
      {
        name: "description",
        content:
          "Upload unit notes and previous-year papers, get AI-ranked high-priority topics, model answers and Tamil tutorials.",
      },
      { property: "og:title", content: "Study Dashboard | SemPrep AI" },
      {
        property: "og:description",
        content:
          "Your AI exam-prep workspace: uploads, priority topics, question bank and Tamil help.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

type Material = {
  id: string;
  title: string;
  subject: string;
  unit: string;
  kind: "notes" | "pyq";
  status: string;
  analysis: any;
  created_at: string;
  file_path: string | null;
};

const UNITS = ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"];

const priorityStyles: Record<string, string> = {
  high: "bg-pink-500/15 text-pink-300 border-pink-500/40",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  low: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40",
};

function DashboardPage() {
  const navigate = useNavigate();
  const runAnalysis = useServerFn(analyzeMaterial);
  const runExplain = useServerFn(getExplanation);
  const fetchStats = useServerFn(getPreparationStats);

  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [explain, setExplain] = useState<{ topic: string; level: string; text: string } | null>(
    null,
  );
  const [explaining, setExplaining] = useState(false);
  const [showProgressOrbit, setShowProgressOrbit] = useState(false);
  const [useMcp, setUseMcp] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    subject: "",
    unit: "Unit 1",
    kind: "notes" as "notes" | "pyq",
  });

  const isVerified = !!email?.endsWith("@rajalakshmi.edu.in");

  const loadMaterials = useCallback(async () => {
    const { data } = await supabase
      .from("study_materials")
      .select("id,title,subject,unit,kind,status,analysis,created_at,file_path")
      .order("created_at", { ascending: false });
    setMaterials((data as Material[]) ?? []);
    if (data && data.length && !activeId) setActiveId(data[0]!.id);
  }, [activeId]);

  const loadProgress = useCallback(async () => {
    const { data } = await supabase.from("study_progress").select("topic,completed");
    const map: Record<string, boolean> = {};
    (data ?? []).forEach((row: any) => (map[row.topic] = row.completed));
    setProgress(map);
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const s = await fetchStats();
      setStats(s);
    } catch (err) {
      console.warn("Failed to load stats:", err);
    }
  }, [fetchStats]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (!session) {
        navigate({ to: "/auth/login" });
        return;
      }
      setEmail(session.user.email ?? null);
      await Promise.all([loadMaterials(), loadProgress(), loadStats()]);
      setChecking(false);
      setTimeout(() => setShowProgressOrbit(true), 800);
    });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = useMemo(
    () => materials.find((m) => m.id === activeId) ?? null,
    [materials, activeId],
  );

  const handleUpload = async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please choose a PDF file");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast.error("PDF must be under 25 MB");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return navigate({ to: "/auth/login" });

    try {
      setUploading("Reading your PDF…");
      const text = await extractPdfText(file);

      setUploading("Uploading securely…");
      const path = `${session.user.id}/${crypto.randomUUID()}.pdf`;
      const { error: upErr } = await supabase.storage.from("study-material").upload(path, file, {
        contentType: "application/pdf",
      });
      if (upErr) throw upErr;

      const { data: inserted, error: insErr } = await supabase
        .from("study_materials")
        .insert({
          user_id: session.user.id,
          title: file.name.replace(/\.pdf$/i, ""),
          subject: form.subject.trim() || "General",
          unit: form.unit,
          kind: form.kind,
          file_path: path,
          extracted_text: text,
          status: "uploaded",
        })
        .select("id,title,subject,unit,kind,status,analysis,created_at,file_path")
        .single();
      if (insErr) throw insErr;

      setMaterials((prev) => [inserted as Material, ...prev]);
      setActiveId((inserted as Material).id);
      setUploading(null);
      toast.success("Uploaded", { description: "Running AI analysis…" });
      await analyse((inserted as Material).id);
    } catch (e: any) {
      setUploading(null);
      toast.error("Upload failed", { description: e?.message ?? "Unknown error" });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const analyse = async (id: string) => {
    setBusyId(id);
    setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, status: "analyzing" } : m)));
    try {
      const res: any = await runAnalysis({ data: { materialId: id, useMcp } });
      setMaterials((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "ready", analysis: res.analysis } : m)),
      );
      toast.success("Analysis ready");
      loadStats();
    } catch (e: any) {
      setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, status: "failed" } : m)));
      toast.error("Analysis failed", { description: e?.message ?? "Try again" });
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (m: Material) => {
    if (m.file_path) await supabase.storage.from("study-material").remove([m.file_path]);
    await supabase.from("study_materials").delete().eq("id", m.id);
    setMaterials((prev) => prev.filter((x) => x.id !== m.id));
    if (activeId === m.id) setActiveId(null);
    toast.success("Deleted");
  };

  const toggleTopic = async (topic: string, subject: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;
    const next = !progress[topic];

    // Optimistic update
    setProgress((p) => ({ ...p, [topic]: next }));

    try {
      await supabase
        .from("study_progress")
        .upsert(
          { user_id: session.user.id, topic, subject, completed: next },
          { onConflict: "user_id,subject,topic" },
        );

      if (next) {
        toast.success(`Topic "${topic}" completed!`);
        loadStats();
      }
    } catch (err) {
      // Revert on error
      setProgress((p) => ({ ...p, [topic]: !next }));
      toast.error("Failed to update progress");
    }
  };

  const askExplain = async (topic: string, level: "quick" | "exam" | "revision") => {
    setExplaining(true);
    setExplain({ topic, level, text: "" });
    try {
      const res: any = await runExplain({
        data: { topic, level, subject: active?.subject ?? "General" },
      });
      setExplain({ topic, level, text: res.text });
    } catch (e: any) {
      setExplain(null);
      toast.error("Could not generate explanation", { description: e?.message });
    } finally {
      setExplaining(false);
    }
  };

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#020205]">
        <Loader2 className="size-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#020205] px-6 text-center">
        <div className="max-w-md rounded-3xl border border-red-500/30 bg-red-500/5 p-8">
          <Lock className="mx-auto size-8 text-red-400" />
          <h1 className="mt-4 font-display text-2xl font-black uppercase">Access restricted</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Only verified <span className="text-red-300">@rajalakshmi.edu.in</span> accounts can
            upload material or view AI results.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-white/10 px-5 py-2.5 text-sm font-bold"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const analysis = active?.analysis;
  const topics = analysis?.topics ?? [];
  const done = topics.filter((t: any) => progress[t.topic]).length;

  return (
    <div className="min-h-screen pb-20 text-foreground bg-[#020205]">
      {/* Background Video for Hero area context */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-[1]">
        <div className="absolute left-[10%] top-[10%] size-96 rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute right-[10%] top-[45%] size-[420px] rounded-full bg-purple-600/10 blur-[150px]" />
      </div>

      <Header
        isAuthenticated={true}
        isVerifiedRec={isVerified}
        userEmail={email}
        activeLink="dashboard"
      />


      <Sidebar activeLink="/dashboard" />
      <MobileNav activeLink="/dashboard" />

      <main className="relative z-10 mx-auto max-w-7xl px-5 lg:pl-80 pt-28 pb-20">

        {/* TOP: Exam Readiness command center */}
        <section className="mb-10 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
            <div>
              <div className="flex items-center gap-3 text-accent">
                <TargetIcon className="size-5" />
                <h2 className="font-display text-sm font-black uppercase tracking-widest">
                  Exam Readiness
                </h2>
              </div>
              <div className="mt-6 flex items-baseline gap-4">
                <span className="font-display text-7xl font-black tracking-tighter text-white">
                  {stats?.readiness ?? 0}%
                </span>
                <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase text-emerald-400 border border-emerald-500/20">
                  <TrendingUp className="size-3" />
                  +5% weekly
                </div>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {stats?.recommendation ?? "Complete your first practice session to calculate your readiness score."}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/planner"
                  className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:scale-105 active:scale-95 shadow-lg shadow-purple-600/20"
                >
                  <Calendar className="size-4" /> Open Planner
                </Link>
                <Link
                  to="/analytics"
                  className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-white/10"
                >
                  <LineChart className="size-4" /> Deep Analytics
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 border-t border-white/5 pt-10">
                {[
                  { label: "Topic Coverage", val: stats?.topicCoverage ?? 0, icon: ListChecks, color: "text-cyan-400" },
                  { label: "Question Accuracy", val: stats?.questionAccuracy ?? 0, icon: Activity, color: "text-purple-400" },
                  { label: "Revision Consistency", val: stats?.revisionConsistency ?? 0, icon: History, color: "text-pink-400" },
                  { label: "Priority Coverage", val: stats?.priorityCoverage ?? 0, icon: Sparkles, color: "text-amber-400" },
                ].map((item) => (
                  <div key={item.label} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <item.icon className={`size-3 ${item.color}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-xs font-bold">{item.val}%</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.val}%` }}
                        className={`h-full rounded-full ${item.color.replace('text-', 'bg-').split(' ')[0]}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-48 rounded-full border border-white/5 bg-white/[0.02]" />
              </div>
              <div className="relative h-64 w-full cursor-pointer" onClick={() => navigate({ to: '/analytics' })}>
                <Canvas camera={{ position: [0, 0, 8], fov: 35 }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <ProgressWheel3D completion={stats?.readiness ?? 0} totalTopics={100} />
                </Canvas>
              </div>
            </div>
          </div>
        </section>


        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* LEFT: upload + library */}
        <aside className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="font-display text-lg font-black uppercase tracking-tight">
              Upload material
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Text-based PDF notes or previous-year papers.
            </p>

            <label className="mt-5 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Subject
            </label>
            <input
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              placeholder="e.g. Machine Learning"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm outline-none focus:border-cyan-400/50"
            />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Unit
                </label>
                <select
                  value={form.unit}
                  onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-cyan-400/50"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u} className="bg-[#0a0a12]">
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Type
                </label>
                <select
                  value={form.kind}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, kind: e.target.value as "notes" | "pyq" }))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-cyan-400/50"
                >
                  <option value="notes" className="bg-[#0a0a12]">
                    Notes
                  </option>
                  <option value="pyq" className="bg-[#0a0a12]">
                    PYQ paper
                  </option>
                </select>
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileRef.current?.click()}
              disabled={!!uploading}
              className="group relative mt-5 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-white/20 bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#0070F3] px-6 py-4 text-sm font-black text-white transition-all duration-500 shadow-[0_0_20px_rgba(121,40,202,0.3)] hover:shadow-[0_0_30px_rgba(0,112,243,0.5)] disabled:opacity-60"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
              {uploading ? (
                <Loader2 className="size-4 animate-spin relative z-10" />
              ) : (
                <Upload className="size-4 relative z-10" />
              )}
              <span className="relative z-10">{uploading ?? "Choose PDF & analyse"}</span>
            </motion.button>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <h2 className="font-display text-sm font-black uppercase tracking-widest text-muted-foreground">
              Your library ({materials.length})
            </h2>
            <ul className="mt-4 space-y-2">
              {materials.length === 0 && (
                <li className="rounded-2xl border border-dashed border-white/10 p-5 text-center text-xs text-muted-foreground">
                  Nothing uploaded yet.
                </li>
              )}
              {materials.map((m, i) => (
                <motion.li
                  key={m.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div
                    className={`flex items-center gap-3 rounded-2xl border p-3 transition-all duration-300 ${
                      activeId === m.id
                        ? "border-cyan-400/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                        : "border-white/10 bg-black/30 hover:bg-white/5"
                    }`}
                  >
                    <button
                      onClick={() => setActiveId(m.id)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/5">
                        {m.kind === "pyq" ? (
                          <FileText className="size-4 text-amber-300" />
                        ) : (
                          <BrainCircuit className="size-4 text-cyan-300" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold">{m.title}</span>
                        <span className="block truncate text-[10px] uppercase tracking-widest text-muted-foreground">
                          {m.subject} · {m.unit} · {m.status}
                        </span>
                      </span>
                    </button>
                    <button
                      onClick={() => remove(m)}
                      aria-label={`Delete ${m.title}`}
                      className="text-muted-foreground hover:text-red-400"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          </section>
        </aside>

        {/* RIGHT: analysis */}
        <section className="space-y-6">
          {!active && (
            <div className="grid min-h-[400px] place-items-center rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
              <div>
                <Sparkles className="mx-auto size-8 text-accent" />
                <h2 className="mt-4 font-display text-2xl font-black uppercase">
                  Upload a unit to begin
                </h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  The AI reads your PDF, ranks high-priority topics, drafts a question bank and
                  finds Tamil tutorials.
                </p>
              </div>
            </div>
          )}

          {active && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="font-display text-2xl font-black uppercase tracking-tight">
                      {active.title}
                    </h1>
                    {active.status === "ready" && (
                      <span className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/20">
                        <Sparkles className="size-2.5" /> MCP Tool Assisted
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                    {active.subject} · {active.unit} ·{" "}
                    {active.kind === "pyq" ? "Previous-year paper" : "Unit notes"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setUseMcp((prev) => {
                        const next = !prev;
                        toast.info(
                          next ? "MCP Tool Integration Enabled" : "Running in Standalone Mode",
                        );
                        return next;
                      })
                    }
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${useMcp ? "border-accent/40 bg-accent/10 text-accent" : "border-white/10 bg-white/5 text-muted-foreground"}`}
                  >
                    <Sparkles className={`size-3 ${useMcp ? "animate-pulse" : ""}`} />
                    Tools: {useMcp ? "ON" : "OFF"}
                  </button>
                  <button
                    onClick={() => analyse(active.id)}
                    disabled={busyId === active.id}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:scale-105 active:scale-95 disabled:opacity-60"
                  >
                    {busyId === active.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <BrainCircuit className="size-4" />
                    )}
                    {active.status === "ready" ? "Re-run analysis" : "Run AI analysis"}
                  </button>
                </div>
              </div>

              {busyId === active.id && (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
                  <Loader2 className="mx-auto size-6 animate-spin text-accent" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Reading the unit and mining patterns…
                  </p>
                </div>
              )}

              {analysis && busyId !== active.id && (
                <>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                    >
                      <h2 className="font-display text-sm font-black uppercase tracking-widest text-accent">
                        Summary
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {analysis.summary}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl flex flex-col items-center justify-center min-h-[300px] group cursor-pointer"
                    >
                      <div className="absolute top-6 left-6 z-10">
                        <h2 className="font-display text-sm font-black uppercase tracking-widest text-accent">
                          Preparation Orbit
                        </h2>
                        <div className="mt-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          <span>
                            {done}/{topics.length} Topics Ready
                          </span>
                        </div>
                      </div>

                      <div className="size-full max-h-[250px] relative z-0">
                        <Suspense
                          fallback={<Loader2 className="size-8 animate-spin text-accent" />}
                        >
                          {showProgressOrbit && (
                            <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
                              <ambientLight intensity={0.5} />
                              <pointLight position={[10, 10, 10]} intensity={1} />
                              <ProgressWheel3D completion={done} totalTopics={topics.length} />
                            </Canvas>
                          )}
                        </Suspense>
                      </div>

                      <div className="absolute bottom-6 w-full px-6 flex justify-between gap-4 z-10">
                        <div className="rounded-2xl bg-black/40 border border-white/5 p-3 flex-1 text-center backdrop-blur-md">
                          <p className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter">
                            Accuracy
                          </p>
                          <p className="text-sm font-bold text-cyan-400">92%</p>
                        </div>
                        <div className="rounded-2xl bg-black/40 border border-white/5 p-3 flex-1 text-center backdrop-blur-md">
                          <p className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter">
                            Selection
                          </p>
                          <p className="text-sm font-bold text-purple-400">84%</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {topics.length > 0 && (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                      <h2 className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-widest text-accent">
                        <Target className="size-4" /> Priority topics
                      </h2>
                      <ul className="mt-4 space-y-3">
                        {topics.map((t: any) => (
                          <li
                            key={t.topic}
                            className="rounded-2xl border border-white/10 bg-black/30 p-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <button
                                onClick={() => toggleTopic(t.topic, active.subject)}
                                className="flex items-center gap-3 text-left"
                              >
                                <CheckCircle2
                                  className={`size-5 shrink-0 ${progress[t.topic] ? "text-emerald-400" : "text-white/20"}`}
                                />
                                <span
                                  className={`text-sm font-bold ${progress[t.topic] ? "line-through opacity-60" : ""}`}
                                >
                                  {t.topic}
                                </span>
                              </button>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase ${priorityStyles[t.priority] ?? priorityStyles["low"]}`}
                                >
                                  {t.priority} priority
                                </span>
                                <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold">
                                  {t.marks}
                                </span>
                              </div>
                            </div>
                            <p className="mt-2 pl-8 text-xs text-muted-foreground">{t.reason}</p>
                            <div className="mt-3 flex flex-wrap gap-2 pl-8">
                              {(["quick", "exam", "revision"] as const).map((lvl) => (
                                <button
                                  key={lvl}
                                  onClick={() => askExplain(t.topic, lvl)}
                                  className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition hover:border-purple-400/50 hover:bg-purple-500/10"
                                >
                                  {lvl} explain
                                </button>
                              ))}
                              <a
                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(t.topic + " tamil explanation")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition hover:border-amber-400/50 hover:bg-amber-500/10"
                              >
                                <Youtube className="size-3" /> Tamil
                              </a>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.questions?.length > 0 && (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                      <h2 className="font-display text-sm font-black uppercase tracking-widest text-accent">
                        Question bank
                      </h2>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Ranked by how strongly the material supports them — not a guarantee of what
                        will be asked.
                      </p>
                      <ul className="mt-4 space-y-3">
                        {analysis.questions.map((q: any, i: number) => (
                          <li
                            key={i}
                            className="rounded-2xl border border-white/10 bg-black/30 p-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <p className="text-sm">{q.question}</p>
                              <span
                                className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-black uppercase ${priorityStyles[q.priority] ?? priorityStyles["low"]}`}
                              >
                                {q.marks}
                              </span>
                            </div>
                            <p className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                              {q.source}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid gap-6 md:grid-cols-2">
                    {analysis.concepts?.length > 0 && (
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                        <h2 className="font-display text-sm font-black uppercase tracking-widest text-accent">
                          Key concepts
                        </h2>
                        <ul className="mt-4 space-y-3">
                          {analysis.concepts.map((c: any, i: number) => (
                            <li key={i}>
                              <p className="text-sm font-bold">{c.name}</p>
                              <p className="text-xs text-muted-foreground">{c.detail}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysis.formulas?.length > 0 && (
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                        <h2 className="font-display text-sm font-black uppercase tracking-widest text-accent">
                          Formulas
                        </h2>
                        <ul className="mt-4 space-y-3">
                          {analysis.formulas.map((f: any, i: number) => (
                            <li key={i} className="rounded-xl bg-black/40 p-3">
                              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                {f.name}
                              </p>
                              <p className="mt-1 font-mono text-sm text-cyan-300">{f.expression}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {analysis.tamilQueries?.length > 0 && (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                      <h2 className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-widest text-accent">
                        <Youtube className="size-4" /> தமிழ் tutorials
                      </h2>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {analysis.tamilQueries.map((q: string) => (
                          <a
                            key={q}
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(q + " tamil explanation")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold transition hover:border-amber-400/50 hover:bg-amber-500/10"
                          >
                            {q}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {!analysis && busyId !== active.id && (
                <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center text-sm text-muted-foreground">
                  No analysis yet — hit “Run AI analysis”.
                </div>
              )}
            </>
          )}
        </section>
        </div>
      </main>

      {explain && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-5 backdrop-blur-sm"
          onClick={() => setExplain(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0a0a12] p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-accent">
              {explain.level} explanation
            </p>
            <h3 className="mt-2 font-display text-xl font-black">{explain.topic}</h3>
            {explaining ? (
              <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Writing it out…
              </div>
            ) : (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {explain.text}
              </p>
            )}
            <button
              onClick={() => setExplain(null)}
              className="mt-6 rounded-full bg-white/10 px-5 py-2 text-xs font-black uppercase tracking-widest"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
