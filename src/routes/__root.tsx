import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { useEffect, type ReactNode, Suspense, useState } from "react";
import { SplineScene } from "@/components/SplineScene";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SemPrep AI — Academic Excellence" },
      { name: "description", content: "AI-powered exam preparation for engineering students." },
      { property: "og:title", content: "SemPrep AI" },
      {
        property: "og:description",
        content: "AI-powered exam preparation for engineering students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Syne:wght@400;500;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const DEFAULT_SCENE_ID = "abstract-crystal";
const SCENES_MAP: Record<string, string> = {
  "abstract-crystal": "https://prod.spline.design/q5P9V-35n4G5Q4Z2/scene.splinecode",
  "glass-nodes": "https://prod.spline.design/Kz6xJ-M-5r-oX1-Q/scene.splinecode",
  "tech-orbit": "https://prod.spline.design/ATw-M-y5K7Wk-1P7/scene.splinecode",
  "modern-box": "https://prod.spline.design/cW9kF-1O7k-P-v-9/scene.splinecode",
};

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const [sceneUrl, setSceneUrl] = useState(() => {
    if (typeof window !== "undefined") {
      const savedId = localStorage.getItem("semprep_scene_id");
      if (savedId && SCENES_MAP[savedId]) {
        return SCENES_MAP[savedId];
      }
    }
    return SCENES_MAP[DEFAULT_SCENE_ID] as string;
  });

  useEffect(() => {
    const handleSceneChange = (e: any) => {
      if (e.detail && e.detail.url) {
        setSceneUrl(e.detail.url);
      }
    };
    window.addEventListener("semprep-scene-change", handleSceneChange);
    return () => window.removeEventListener("semprep-scene-change", handleSceneChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen bg-[#020205]">
        {/* Global Persistent 3D Background */}
        <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000">
          <StudySpace />
        </div>

        {/* Shared ambient glows */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-[1]">
          <div className="absolute left-[10%] top-[10%] size-96 rounded-full bg-cyan-500/10 blur-[140px]" />
          <div className="absolute right-[10%] top-[45%] size-[420px] rounded-full bg-purple-600/10 blur-[150px]" />
        </div>


        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <div className="relative z-10">
          <Outlet />
        </div>
      </div>
    </QueryClientProvider>
  );
}
