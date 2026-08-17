import React, { useState } from 'react';
import { 
  Box, 
  ChevronDown, 
  Settings2,
  Sparkles,
  Layers,
  Hexagon
} from 'lucide-react';

interface SplineSceneConfig {
  id: string;
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SCENES: SplineSceneConfig[] = [
  { 
    id: 'abstract-crystal', 
    name: 'Abstract Crystal', 
    url: 'https://prod.spline.design/q5P9V-35n4G5Q4Z2/scene.splinecode',
    icon: Sparkles
  },
  { 
    id: 'glass-nodes', 
    name: 'Glass Nodes', 
    url: 'https://prod.spline.design/Kz6xJ-M-5r-oX1-Q/scene.splinecode',
    icon: Layers
  },
  { 
    id: 'tech-orbit', 
    name: 'Tech Orbit', 
    url: 'https://prod.spline.design/ATw-M-y5K7Wk-1P7/scene.splinecode',
    icon: Hexagon
  },
  { 
    id: 'modern-box', 
    name: 'Modern Box', 
    url: 'https://prod.spline.design/cW9kF-1O7k-P-v-9/scene.splinecode',
    icon: Box
  }
];


export const SceneSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSceneId, setCurrentSceneId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('semprep_scene_id');
      if (saved && SCENES.some(s => s.id === saved)) {
        return saved;
      }
    }
    return SCENES[0].id;
  });

  const activeScene = SCENES.find(s => s.id === currentSceneId) || SCENES[0];

  const handleSelect = (id: string) => {
    setCurrentSceneId(id);
    localStorage.setItem('semprep_scene_id', id);
    const scene = SCENES.find(s => s.id === id);
    if (scene) {
      window.dispatchEvent(new CustomEvent('semprep-scene-change', { 
        detail: { url: scene.url } 
      }));
    }
    setIsOpen(false);
  };

  return (
    <div className="relative group">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full glass-morphism border border-white/10 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:border-accent/50 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
      >
        <Settings2 className="size-3.5 text-accent animate-pulse" />
        <span>3D Scene: {activeScene.name}</span>
        <ChevronDown className={`size-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-56 rounded-2xl glass-morphism border border-white/10 overflow-hidden backdrop-blur-2xl z-[100] shadow-2xl">
          <div className="p-2 space-y-1">
            {SCENES.map((scene) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => handleSelect(scene.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group/item ${
                  currentSceneId === scene.id 
                  ? 'bg-accent/20 border border-accent/30 text-white' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <scene.icon className={`size-4 ${currentSceneId === scene.id ? 'text-accent' : 'text-white/40 group-hover/item:text-accent'} transition-colors`} />
                <span className="text-[11px] font-bold uppercase tracking-widest">{scene.name}</span>
                {currentSceneId === scene.id && (
                  <div className="ml-auto size-1.5 rounded-full bg-accent shadow-[0_0_8px_#22d3ee]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
