import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo-glow.png.asset.json";
import { SceneSelector } from "@/components/SceneSelector";
import { Lock } from "lucide-react";

interface HeaderProps {
  isAuthenticated: boolean;
  isVerifiedRec?: boolean | null | undefined;
  userEmail?: string | null;
  activeLink?: "dashboard" | "home" | "profile" | "topics" | "questions" | "planner" | "analytics";
}

export const Header = ({ isAuthenticated, isVerifiedRec, userEmail, activeLink }: HeaderProps) => {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 border border-white/10 glass-morphism mx-5 md:mx-auto max-w-6xl overflow-hidden backdrop-blur-xl rounded-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 md:px-5 py-3 md:py-3">
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative">
            <div className="relative flex size-10 items-center justify-center rounded-xl bg-black/40 backdrop-blur-md p-1 border border-white/10">
              <img
                src={logoAsset.url}
                alt="REC Logo"
                className="size-full object-contain relative z-10"
              />
            </div>
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white hidden sm:block">
            SemPrep AI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {isAuthenticated && (
            <>
              <Link
                to="/"
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
                  activeLink === "home"
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
                  activeLink === "dashboard"
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            isVerifiedRec ? (
              <Link
                to="/profile"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-black uppercase tracking-widest backdrop-blur-md transition hover:bg-white/10"
              >
                Profile
              </Link>
            ) : (
              <div className="flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/30 px-4 py-2 text-[10px] font-black uppercase text-red-400 backdrop-blur-md">
                <Lock className="size-3" />
                <span>REC Only</span>
              </div>
            )
          ) : (
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 text-xs font-bold text-white transition-all hover:scale-105"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
