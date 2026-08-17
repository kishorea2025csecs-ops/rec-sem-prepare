import React, { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
  onLoad?: (e: any) => void;
}

export const SplineScene: React.FC<SplineSceneProps> = ({ scene, className, onLoad }) => {
  return (
    <div className={className}>
      <Suspense fallback={null}>
        <Spline 
          scene={scene} 
          {...(onLoad ? { onLoad } : {})}
        />
      </Suspense>
    </div>
  );
};
