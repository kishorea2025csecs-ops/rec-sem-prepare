import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, ContactShadows, PresentationControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

const StudyObject = ({ position, color, label, tip, index }: { 
  position: [number, number, number], 
  color: string, 
  label: string, 
  tip: string,
  index: number
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate items slowly
  useFrame((state) => {
    if (meshRef.current && !active) {
      meshRef.current.rotation.x += 0.005 + (index * 0.002);
      meshRef.current.rotation.y += 0.005 + (index * 0.001);
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
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            setActive(!active);
          }}
          scale={active ? 1.4 : hovered ? 1.1 : 1}
        >
          {geometry}
          <MeshDistortMaterial 
            distort={active ? 0.4 : 0.2} 
            speed={4} 
            color={hovered ? '#ffffff' : color} 
            roughness={0.1}
            metalness={0.8}
            emissive={color}
            emissiveIntensity={hovered ? 0.5 : 0.2}
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
                <p className="text-xs font-black uppercase tracking-widest text-white">{label}</p>
                {active && (
                  <motion.p 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-1 w-48 text-[10px] leading-relaxed text-accent/90 font-bold"
                  >
                    {tip}
                  </motion.p>
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
  const objects = [
    { 
      color: "#9D4EDD", 
      label: "Unit Notes", 
      tip: "AI extracts key formulas and definitions from your uploaded PDFs instantly.",
      pos: [-5, 2.5, -2]
    },
    { 
      color: "#00D2FF", 
      label: "PYQ Analysis", 
      tip: "Historical weighting analysis identifies which topics are trending for this semester.",
      pos: [5, -2, 0]
    },
    { 
      color: "#FFB703", 
      label: "Important Topics", 
      tip: "Bayesian Networks and Neural Architecture are marked as 'High Priority' for Unit 3.",
      pos: [1, 3.5, -3]
    },
    { 
      color: "#FB8500", 
      label: "Tamil Help", 
      tip: "Difficult concepts? We map specific timestamps in Tamil tutorials to your notes.",
      pos: [-4, -3, 1]
    },
    { 
      color: "#F15BB5", 
      label: "Exam Score", 
      tip: "Targeted writing structure: Point-wise presentation and diagram placement tips.",
      pos: [3, 2, -1]
    }
  ];

  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
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
            />
          ))}
        </PresentationControls>

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
