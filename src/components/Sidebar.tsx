import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo-glow.png.asset.json";
import { 
  LayoutDashboard, 
  Target, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Lock,
  User as UserIcon
} from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  activeLink: string;
}

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Important Topics", icon: Target, path: "/topics" },
  { label: "Question Bank", icon: BookOpen, path: "/questions" },
  { label: "Study Planner", icon: Calendar, path: "/planner" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
];

export const Sidebar = ({ activeLink }: SidebarProps) => {
  return (
    <aside className="fixed left-6 top-28 bottom-6 w-64 z-40 hidden lg:block">
      <div className="h-full rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 flex flex-col">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="relative flex size-10 items-center justify-center rounded-xl bg-black/40 backdrop-blur-md p-1 border border-white/10">
            <img
              src={logoAsset.url}
              alt="REC Logo"
              className="size-full object-contain relative z-10"
            />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            SemPrep AI
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = activeLink === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.label}
                to={item.path as any}
                className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-cyan-500 rounded-r-full"
                  />
                )}
                <Icon className={`size-5 transition-transform group-hover:scale-110 ${isActive ? "text-cyan-400" : ""}`} />
                <span className="text-sm font-bold tracking-wide uppercase font-display">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <Link
            to="/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
              activeLink === "/profile" 
                ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]" 
                : "hover:bg-white/5"
            }`}
          >
            <div className="size-8 rounded-full bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-[10px] font-black">
              REC
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className={`text-xs font-bold truncate ${activeLink === "/profile" ? "text-cyan-400" : "text-white"}`}>Student Portal</p>
              <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest">Profile</p>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export const MobileNav = ({ activeLink }: SidebarProps) => {
  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 lg:hidden">
      <div className="flex items-center justify-around rounded-3xl border border-white/10 bg-[#0a0a12]/80 backdrop-blur-2xl p-2 shadow-2xl">
        {menuItems.map((item) => {
          const isActive = activeLink === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.label}
              to={item.path as any}
              className={`p-3 rounded-2xl transition-all ${
                isActive ? "bg-cyan-500/10 text-cyan-400" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-5" />
            </Link>
          );
        })}
        <Link
          to="/profile"
          className={`p-3 rounded-2xl transition-all ${
            activeLink === "/profile" ? "bg-cyan-500/10 text-cyan-400" : "text-muted-foreground"
          }`}
        >
          <UserIcon className="size-5" />
        </Link>
      </div>
    </div>
  );
};
