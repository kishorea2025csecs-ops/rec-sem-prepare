import React, { Suspense, lazy, useState, useEffect } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
  onLoad?: (e: any) => void;
}

export const SplineScene: React.FC<SplineSceneProps> = ({ scene, className, onLoad }) => {
  const [error, setError] = useState<Error | null>(null);

  // Reset error when scene changes
  useEffect(() => {
    setError(null);
  }, [scene]);

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-black/20 backdrop-blur-sm border border-white/5 rounded-3xl p-8 text-center`}>
        <div className="space-y-4">
          <div className="size-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
            <div className="size-2 rounded-full bg-red-500 animate-ping" />
          </div>
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest">3D Module Interrupted</p>
          <button 
            onClick={() => setError(null)}
            className="px-4 py-2 rounded-full glass-morphism border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
          >
            Attempt Recovery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <ErrorBoundary onError={setError}>
        <Suspense fallback={null}>
          <Spline 
            scene={scene} 
            {...(onLoad ? { onLoad } : {})}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode, onError: (error: Error) => void }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  override render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
