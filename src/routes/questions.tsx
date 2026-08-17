import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Sidebar, MobileNav } from "@/components/Sidebar";

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setChecking(false);
    });
  }, []);

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
        <h1 className="font-display text-3xl font-black uppercase tracking-tight mb-8">
          Question Bank
        </h1>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
          <p className="text-muted-foreground">Previous exam questions and practice content coming soon.</p>
        </div>
      </main>
    </div>
  );
}
