import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// --- Components for specific 3D objects ---

const AIKnowledgeCore = ({ scrollProgress }: { scrollProgress: number }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.rotation.x += 0.005;
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 1;
      groupRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const { viewport } = useThree();
  const isMobile = viewport.width < 5;

  const pos = useMemo(() => {
    // Hero (0-0.2): Right side, centered on mobile
    if (scrollProgress < 0.2) return [isMobile ? 0 : 3.5, isMobile ? 0.5 : 0, 0];
    // Section 2: Study Material (0.2-0.4) -> Moves to back/top
    if (scrollProgress < 0.4) {
      const t = (scrollProgress - 0.2) / 0.2;
      const startX = isMobile ? 0 : 3.5;
      const startY = isMobile ? 0.5 : 0;
      return [
        THREE.MathUtils.lerp(startX, 0, t),
        THREE.MathUtils.lerp(startY, 4, t),
        THREE.MathUtils.lerp(0, -10, t),
      ];
    }
    // Section 3: AI Analysis (0.4-0.6) -> Center focus
    if (scrollProgress < 0.6) {
      const t = (scrollProgress - 0.4) / 0.2;
      return [0, THREE.MathUtils.lerp(4, 0, t), THREE.MathUtils.lerp(-10, 0, t)];
    }
    // Section 4 & 5: Background focus
    if (scrollProgress < 0.8) return [0, 5, -8];
    // Section 6: Revision (0.8-1.0) -> Center with cards
    const t = (scrollProgress - 0.8) / 0.2;
    return [0, THREE.MathUtils.lerp(5, 0, t), THREE.MathUtils.lerp(-8, 0, t)];
  }, [scrollProgress, isMobile]);

  return (
    <group ref={groupRef} position={pos as any}>
      <mesh>
        <icosahedronGeometry args={[1.6, 2]} />
        <meshPhysicalMaterial
          color="#00D2FF"
          transmission={0.9}
          thickness={1.5}
          roughness={0.1}
          metalness={0.2}
          ior={1.5}
          clearcoat={1}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#9D4EDD" emissive="#9D4EDD" emissiveIntensity={1} />
      </mesh>
    </group>
  );
};

const StudyNotes = ({ scrollProgress }: { scrollProgress: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const { viewport } = useThree();
  const isMobile = viewport.width < 5;

  const pos = useMemo(() => {
    // Hidden during hero
    if (scrollProgress < 0.15) return [-10, 0, -5];
    // Enters in Section 2 (0.2-0.4)
    if (scrollProgress < 0.4) {
      const t = (scrollProgress - 0.15) / 0.25;
      // On mobile, keep it slightly higher to avoid overlap with cards
      return [THREE.MathUtils.lerp(-8, 0, t), isMobile ? 1.5 : 0, THREE.MathUtils.lerp(-5, 2, t)];
    }
    // Moves to Section 3 processing
    if (scrollProgress < 0.6) {
      const t = (scrollProgress - 0.4) / 0.2;
      return [0, THREE.MathUtils.lerp(isMobile ? 1.5 : 0, -10, t), THREE.MathUtils.lerp(2, -10, t)];
    }
    return [0, -20, -10];
  }, [scrollProgress, isMobile]);

  return (
    <mesh ref={meshRef} position={pos as any}>
      <boxGeometry args={[2.2, 3, 0.1]} />
      <meshPhysicalMaterial color="#f8f9fa" roughness={0.4} metalness={0.05} />
    </mesh>
  );
};

const QuestionPaper = ({ scrollProgress }: { scrollProgress: number }) => {
  const pos = useMemo(() => {
    // Section 4: Important Questions (0.6-0.8)
    if (scrollProgress < 0.55) return [0, 10, -15];
    if (scrollProgress < 0.8) {
      const t = (scrollProgress - 0.55) / 0.25;
      return [0, THREE.MathUtils.lerp(8, 0, t), THREE.MathUtils.lerp(-12, 1, t)];
    }
    return [0, -10, -10];
  }, [scrollProgress]);

  return (
    <group position={pos as any} rotation={[0.1, -0.2, 0]}>
      <mesh>
        <planeGeometry args={[2.5, 3.5]} />
        <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>
      {/* Visual representation of "important question" cards emerging */}
      {scrollProgress > 0.65 && scrollProgress < 0.8 && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <mesh position={[1.5, 1, 0.5]}>
            <planeGeometry args={[0.8, 0.5]} />
            <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
          </mesh>
        </Float>
      )}
    </group>
  );
};

const AnswerSheet = ({ scrollProgress }: { scrollProgress: number }) => {
  const pos = useMemo(() => {
    // Section 5: Answer Coach (0.75-0.9)
    if (scrollProgress < 0.75) return [12, 0, -10];
    if (scrollProgress < 0.9) {
      const t = (scrollProgress - 0.75) / 0.15;
      return [THREE.MathUtils.lerp(10, 0, t), 0, THREE.MathUtils.lerp(-8, 2, t)];
    }
    return [-15, 0, -10];
  }, [scrollProgress]);

  return (
    <mesh position={pos as any} rotation={[-0.1, -0.1, 0]}>
      <boxGeometry args={[2.5, 3.5, 0.05]} />
      <meshPhysicalMaterial color="#eef2ff" transmission={0.2} thickness={0.5} roughness={0.3} />
    </mesh>
  );
};

const RevisionCards = ({ scrollProgress }: { scrollProgress: number }) => {
  // Always render some floating background objects for professional depth
  return (
    <group>
      {/* Scroll-conditional main objects */}
      {scrollProgress > 0.8 &&
        [0, 1, 2].map((i) => (
          <Float
            key={i}
            speed={2}
            rotationIntensity={1}
            floatIntensity={2}
            position={[(i - 1) * 3, 2, -2] as any}
          >
            <mesh rotation={[Math.random(), Math.random(), 0]}>
              <boxGeometry args={[1, 0.6, 0.02]} />
              <meshStandardMaterial color={i === 1 ? "#FF0080" : "#7928CA"} />
            </mesh>
          </Float>
        ))}

      {/* Persistent floating professional primitives */}
      {[...Array(20)].map((_, i) => {
        const x = Math.sin(i * 1.5) * 15;
        const y = Math.cos(i * 2) * 12;
        const z = -20 - (i % 5) * 5;

        return (
          <Float
            key={`extra-${i}`}
            speed={1 + Math.random()}
            rotationIntensity={2}
            floatIntensity={2}
            position={[x, y, z] as any}
          >
            {i % 4 === 0 ? (
              <mesh>
                <coneGeometry args={[0.3, 0.7, 32]} />
                <meshPhysicalMaterial
                  color="#00D2FF"
                  emissive="#00D2FF"
                  emissiveIntensity={0.8}
                  transmission={0.5}
                  thickness={1}
                />
              </mesh>
            ) : i % 4 === 1 ? (
              <mesh>
                <octahedronGeometry args={[0.4]} />
                <meshPhysicalMaterial
                  color="#FFD700"
                  emissive="#FFD700"
                  emissiveIntensity={0.8}
                  transmission={0.5}
                  thickness={1}
                />
              </mesh>
            ) : i % 4 === 2 ? (
              <mesh>
                <boxGeometry args={[0.4, 0.4, 0.4]} />
                <meshPhysicalMaterial
                  color="#FF0080"
                  emissive="#FF0080"
                  emissiveIntensity={0.8}
                  transmission={0.5}
                  thickness={1}
                />
              </mesh>
            ) : (
              <mesh>
                <tetrahedronGeometry args={[0.3]} />
                <meshPhysicalMaterial
                  color="#7928CA"
                  emissive="#7928CA"
                  emissiveIntensity={0.8}
                  transmission={0.5}
                  thickness={1}
                />
              </mesh>
            )}
          </Float>
        );
      })}
    </group>
  );
};

const KnowledgeNodes = ({ scrollProgress }: { scrollProgress: number }) => {
  const visible = scrollProgress > 0.4 && scrollProgress < 0.65;
  if (!visible) return null;

  return (
    <group>
      {[...Array(6)].map((_, i) => (
        <Float key={i} speed={3} floatIntensity={2}>
          <mesh position={[Math.sin(i) * 3, Math.cos(i) * 3, -2] as any}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={1} />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const Scene = ({ scrollY }: { scrollY: number }) => {
  const { camera, viewport } = useThree();
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobile = viewport.width < 5; // Rough heuristic for mobile in Three.js units

  useEffect(() => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress(scrollY / height);
  }, [scrollY]);

  useFrame((state) => {
    // Smoother persistent camera movement
    const targetZ = isMobile ? 8 - scrollProgress * 5 : 10 - scrollProgress * 3;
    const targetY = isMobile ? -scrollProgress * 6 : -scrollProgress * 4;

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);

    // Add subtle camera tilt based on time
    camera.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    camera.rotation.y = Math.cos(state.clock.elapsedTime * 0.2) * 0.05;

    camera.lookAt(0, targetY, 0);
  });

  return (
    <>
      <AIKnowledgeCore scrollProgress={scrollProgress} />
      <StudyNotes scrollProgress={scrollProgress} />
      <KnowledgeNodes scrollProgress={scrollProgress} />
      <QuestionPaper scrollProgress={scrollProgress} />
      <AnswerSheet scrollProgress={scrollProgress} />
      <RevisionCards scrollProgress={scrollProgress} />

      <Environment preset="night" />
      <ContactShadows position={[0, -6, 0]} opacity={0.4} scale={25} blur={2.5} far={10} />

      <ambientLight intensity={0.4} />
      <spotLight position={[15, 20, 10]} angle={0.2} penumbra={1} intensity={1.5} castShadow />
      <pointLight position={[-15, -10, -10]} intensity={0.5} color="#9D4EDD" />
    </>
  );
};

export const StudySpace = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        shadows
        camera={{ position: [0, 0, 10], fov: 40 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Scene scrollY={scrollY} />
      </Canvas>
    </div>
  );
};
