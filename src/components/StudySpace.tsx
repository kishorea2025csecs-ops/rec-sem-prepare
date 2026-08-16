import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

// --- Components for specific 3D objects ---

const AIKnowledgeCore = ({ scrollProgress, ...props }: { scrollProgress: number } & any) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 1;
      meshRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  // Position logic based on scroll (Section 1 and 3 focus)
  const pos = useMemo(() => {
    // In Hero (0-0.2): right side
    if (scrollProgress < 0.2) return [4, 0, 0];
    // Transitions away in Section 2
    if (scrollProgress < 0.4) return [4 + (scrollProgress - 0.2) * 20, 2, -5];
    // Focused in Section 3 Analysis (0.4-0.6)
    if (scrollProgress < 0.6) return [0, 0, 0];
    // Background in later sections
    return [0, 5, -10];
  }, [scrollProgress]);

  return (
    <group ref={meshRef} position={pos as any} {...props}>
      <mesh>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshPhysicalMaterial 
          color="#00D2FF" 
          transmission={0.8} 
          thickness={1} 
          roughness={0.1} 
          metalness={0.8}
          emissive="#00D2FF"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh scale={0.8}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#9D4EDD" emissive="#9D4EDD" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

const StudyNotes = ({ scrollProgress }: { scrollProgress: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  const pos = useMemo(() => {
    // Enters in Section 2 (0.2-0.4)
    if (scrollProgress < 0.1) return [-15, 0, 0];
    if (scrollProgress < 0.4) {
      const t = (scrollProgress - 0.1) / 0.3;
      return [THREE.MathUtils.lerp(-10, 0, t), 0, 0];
    }
    // Moves away in Section 3
    return [0, -10, -5];
  }, [scrollProgress]);

  return (
    <mesh ref={meshRef} position={pos as any}>
      <boxGeometry args={[2, 3, 0.2]} />
      <meshPhysicalMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
    </mesh>
  );
};

const QuestionPaper = ({ scrollProgress }: { scrollProgress: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const pos = useMemo(() => {
    // Focused in Section 4 (0.6-0.8)
    if (scrollProgress < 0.5) return [0, 15, -5];
    if (scrollProgress < 0.8) {
      const t = (scrollProgress - 0.5) / 0.3;
      return [0, THREE.MathUtils.lerp(10, 0, t), 0];
    }
    return [0, -15, -5];
  }, [scrollProgress]);

  return (
    <mesh ref={meshRef} position={pos as any} rotation={[0.2, 0.2, 0]}>
      <planeGeometry args={[3, 4]} />
      <meshStandardMaterial color="#f0f0f0" side={THREE.DoubleSide} />
    </mesh>
  );
};

const AnswerSheet = ({ scrollProgress }: { scrollProgress: number }) => {
  const pos = useMemo(() => {
    // Section 5 (0.8-0.9)
    if (scrollProgress < 0.75) return [10, 0, -10];
    if (scrollProgress < 0.9) {
      const t = (scrollProgress - 0.75) / 0.15;
      return [THREE.MathUtils.lerp(10, 0, t), 0, 0];
    }
    return [-10, 0, -10];
  }, [scrollProgress]);

  return (
    <mesh position={pos as any} rotation={[-0.2, -0.3, 0]}>
      <boxGeometry args={[2.5, 3.5, 0.1]} />
      <meshPhysicalMaterial color="#e0e0ff" roughness={0.2} metalness={0.2} />
    </mesh>
  );
};

const Scene = ({ scrollY }: { scrollY: number }) => {
  const { camera } = useThree();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress(scrollY / height);
  }, [scrollY]);

  useFrame(() => {
    // Smooth camera path
    const targetZ = 10 - scrollProgress * 5;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -scrollProgress * 2, 0.05);
  });

  return (
    <>
      <AIKnowledgeCore scrollProgress={scrollProgress} />
      <StudyNotes scrollProgress={scrollProgress} />
      <QuestionPaper scrollProgress={scrollProgress} />
      <AnswerSheet scrollProgress={scrollProgress} />

      <Environment preset="city" />
      <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={20} blur={2} />
      
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
    </>
  );
};

export const StudySpace = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene scrollY={scrollY} />
      </Canvas>
    </div>
  );
};