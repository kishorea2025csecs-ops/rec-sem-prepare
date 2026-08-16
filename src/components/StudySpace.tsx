import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, ContactShadows, PresentationControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import { ExternalLink } from 'lucide-react';

const StudyObject = ({ position, color, label, tip, index, path }: { 
  position: [number, number, number], 
  color: string, 
  label: string, 
  tip: string,
  index: number,
  path: string
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  // Rotate items slowly, reacting to scroll
  useFrame((state, delta) => {
    if (meshRef.current && !active) {
      // Base rotation + scroll-induced boost
      const scrollImpact = Math.abs((window.scrollY - state.camera.position.y * -200) * 0.0001);
      const rotationSpeed = 0.005 + (index * 0.002) + (scrollImpact * 0.05);
      
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed * 0.5;
    }
  });

  // Geometry selector based on index for variety
  const geometry = useMemo(() => {
    switch(index % 3) {
      case 0: return <octahedronGeometry args={[0.8, 0]} />;
      case 1: return <torusKnotGeometry args={[0.5, 0.2, 128, 32]} />;
      default: return <icosahedronGeometry args={[0.7, 0]} />;
    }
  }, [index]);

  return (
    <Float 
      speed={1.5 + index * 0.2} 
      rotationIntensity={1} 
      floatIntensity={2}
      floatingRange={[-0.5, 0.5]}
    >
      <group position={position} {...({} as any)}>
        <mesh
          ref={meshRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (active) {
               navigate({ to: path });
            } else {
               setActive(true);
            }
          }}
          scale={active ? 1.4 : hovered ? 1.1 : 1}
          {...({} as any)}
        >
          {geometry}
          <meshPhysicalMaterial 
            {...({} as any)}
            transmission={0.95}
            thickness={2}
            roughness={0.05}
            envMapIntensity={2}
            clearcoat={1}
            color={hovered ? '#ffffff' : color}
            attenuationColor={color}
            attenuationDistance={0.5}
            emissive={color}
            emissiveIntensity={hovered ? 0.8 : 0.2}
          />
        </mesh>
        
        {/* Study Tooltips / UI Overlay inside Canvas */}
        <Html position={[0, 1.2, 0]} center style={{ pointerEvents: 'none' }}>
          <AnimatePresence>
            {(hovered || active) && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                className="whitespace-nowrap rounded-lg border border-white/20 bg-black/60 px-3 py-1.5 backdrop-blur-md"
              >
                <div className="flex items-center gap-2">
                  <p className="text-xs font-black uppercase tracking-widest text-white">{label}</p>
                  {active && <ExternalLink className="size-3 text-accent" />}
                </div>
                {active && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-1 w-48"
                  >
                    <p className="text-[10px] leading-relaxed text-accent/90 font-bold">
                      {tip}
                    </p>
                    <p className="mt-2 text-[8px] uppercase tracking-tighter text-white/40 font-black">Click again to open module</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Html>
      </group>
    </Float>
  );
};

export const StudySpace = () => {
  const scrollRef = useRef(0);
  const scrollVelocity = useRef(0);
  const lastScrollY = useRef(0);
  
  // Update scroll value for camera parallax and velocity for object rotation
  useFrame((state, delta) => {
    const currentScrollY = window.scrollY;
    
    // Calculate velocity with smoothing
    const velocity = (currentScrollY - lastScrollY.current) / (delta * 1000);
    scrollVelocity.current = THREE.MathUtils.lerp(scrollVelocity.current, velocity, 0.1);
    lastScrollY.current = currentScrollY;
    
    scrollRef.current = currentScrollY;
    
    // Parallax movement
    const targetY = -(scrollRef.current * 0.005);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.1);
    
    // Subtly tilt camera based on scroll velocity
    state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, scrollVelocity.current * 0.0002, 0.05);
  });

  const objects = [
    { 
      color: "#9D4EDD", 
      label: "Unit Notes", 
      tip: "AI extracts key formulas and definitions from your uploaded PDFs instantly.",
      pos: [-5, 2.5, -2],
      path: "/dashboard"
    },
    { 
      color: "#00D2FF", 
      label: "PYQ Analysis", 
      tip: "Historical weighting analysis identifies which topics are trending for this semester.",
      pos: [5, -2, 0],
      path: "/question-bank"
    },
    { 
      color: "#FFB703", 
      label: "Important Topics", 
      tip: "Bayesian Networks and Neural Architecture are marked as 'High Priority' for Unit 3.",
      pos: [1, 3.5, -3],
      path: "/topics"
    },
    { 
      color: "#FB8500", 
      label: "Tamil Help", 
      tip: "Difficult concepts? We map specific timestamps in Tamil tutorials to your notes.",
      pos: [-4, -3, 1],
      path: "/dashboard"
    },
    { 
      color: "#F15BB5", 
      label: "Study Planner", 
      tip: "Targeted writing structure: Point-wise presentation and diagram placement tips.",
      pos: [3, 2, -1],
      path: "/study-planner"
    }
  ];

  return (
    <PresentationControls
      global
      snap
      rotation={[0, 0, 0]}
      polar={[-Math.PI / 6, Math.PI / 6]}
      azimuth={[-Math.PI / 4, Math.PI / 4]}
    >
      {objects.map((obj, i) => (
        <StudyObject 
          key={i}
          index={i}
          position={obj.pos as [number, number, number]}
          color={obj.color}
          label={obj.label}
          tip={obj.tip}
          path={obj.path}
        />
      ))}
    </PresentationControls>
  );
};

export const StudySpaceCanvas = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020205]">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color('#020205'), 0);
        }}
      >
        <ambientLight intensity={0.4} {...({} as any)} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow {...({} as any)} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} {...({} as any)} />
        
        <Suspense fallback={null}>
          <StudySpace />
        </Suspense>

        <ContactShadows 
          position={[0, -5, 0]} 
          opacity={0.3} 
          scale={20} 
          blur={2.5} 
          far={10} 
        />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
};
