import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SplineScene } from "@/components/SplineScene";
import logoAsset from "@/assets/logo-glow.png.asset.json";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { toast } from "sonner";
import { User, Mail, ShieldCheck, CreditCard, Key, ArrowLeft, Loader2, Camera } from "lucide-react";
import { Header } from "@/components/Header";
import { Sidebar, MobileNav } from "@/components/Sidebar";


export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile | SemPrep AI - Account Settings" },
      {
        name: "description",
        content:
          "Manage your SemPrep AI profile and account settings. Secure academic portal for Rajalakshmi Engineering College students.",
      },
      { property: "og:title", content: "Student Profile | SemPrep AI" },
      { property: "og:description", content: "Manage your account settings on SemPrep AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate({ to: "/auth/login" });
        return;
      }

      setUser(session.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }
      setLoading(false);
    };

    getProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground pb-20 relative overflow-hidden">
      <div className="absolute left-[10%] top-[10%] size-96 rounded-full bg-cyan-500/5 blur-[140px] pointer-events-none" />
      <div className="absolute right-[10%] top-[45%] size-[420px] rounded-full bg-purple-600/5 blur-[150px] pointer-events-none" />
      {/* Header */}
      <Header
        isAuthenticated={true}
        isVerifiedRec={!!user?.email?.endsWith("@rajalakshmi.edu.in")}
        userEmail={user?.email}
        activeLink="profile"
      />

      <Sidebar activeLink="/profile" />
      <MobileNav activeLink="/profile" />

      <main className="mx-auto max-w-2xl p-6 lg:p-10 lg:pl-80" aria-labelledby="profile-heading">

        <div className="space-y-10">
          {/* Profile Section */}
          <section className="space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold">Personal Information</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your static account details managed by SemPrep AI.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
                <div className="relative group">
                  {profile?.avatar_url || user?.user_metadata?.avatar_url ? (
                    <img
                      src={profile?.avatar_url || user?.user_metadata?.avatar_url}
                      alt="Avatar"
                      className="size-24 rounded-3xl object-cover border-4 border-surface shadow-xl"
                    />
                  ) : (
                    <div className="size-24 rounded-3xl bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-primary-foreground text-3xl font-black border-4 border-surface shadow-xl">
                      {(profile?.full_name || user?.user_metadata?.full_name || "S").charAt(0)}
                    </div>
                  )}
                  <button className="absolute -bottom-2 -right-2 size-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center border-2 border-[#020205] shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all duration-300 hover:scale-110">
                    <Camera className="size-4" />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold">
                    {profile?.full_name || user?.user_metadata?.full_name || "Student Name"}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                    <ShieldCheck className="size-3.5 text-accent" /> REC Student Account
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      readOnly
                      value={profile?.full_name || user?.user_metadata?.full_name || ""}
                      className="w-full rounded-2xl border border-border bg-surface px-11 py-3 text-sm focus:outline-none cursor-default"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">
                    Official Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="email"
                      readOnly
                      value={user?.email || ""}
                      className="w-full rounded-2xl border border-border bg-surface px-11 py-3 text-sm focus:outline-none cursor-default"
                    />
                  </div>
                  <p className="text-[10px] text-accent font-medium px-1 flex items-center gap-1">
                    <ShieldCheck className="size-3" /> Verified by Rajalakshmi Engineering College
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold">Security</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your password and authentication methods.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
              <button className="flex w-full items-center justify-between rounded-full border border-white/10 bg-white/5 p-4 transition-all duration-500 hover:bg-purple-500/10 hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(192,132,252,0.2)] backdrop-blur-md group">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Key className="size-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold group-hover:text-white transition-colors">
                      Change Password
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Update your REC portal login password
                    </p>
                  </div>
                </div>
                <div className="size-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-purple-500/20 group-hover:border-purple-400/30 transition-all">
                  <span className="text-xs group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </div>
              </button>
            </div>
          </section>

          {/* Subscription Section */}
          <section className="space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold">Plan & Subscription</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your current access level to SemPrep AI features.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6">
              <div className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-accent to-primary p-6 text-primary-foreground">
                <div>
                  <h3 className="font-display text-lg font-bold">Academic Pro</h3>
                  <p className="text-xs opacity-80 mt-1 uppercase tracking-widest font-bold">
                    Active Student License
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <CreditCard className="size-6" />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between px-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Renewal Date
                  </p>
                  <p className="text-sm font-bold mt-1">Aug 16, 2027</p>
                </div>
                <button
                  onClick={() =>
                    toast.info("Managed by Rajalakshmi Engineering College IT Department")
                  }
                  className="text-xs font-black uppercase tracking-widest text-white px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/10 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] backdrop-blur-md transition-all duration-300"
                >
                  Manage Billing
                </button>
              </div>
            </div>
          </section>

          {/* Note from semantics */}
          <div className="rounded-2xl bg-surface/50 border border-border p-5">
            <p className="text-[11px] leading-relaxed text-muted-foreground italic text-center">
              "Profile is reserved for static personal information. For live analytics, interactive
              models, and system metrics, please visit your Dashboard."
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
