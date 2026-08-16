import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, MeshWobbleMaterial, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const StudyObject = ({ position, color, icon, label, tip }: { position: [number, number, number], color: string, icon: string, label: string, tip: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state) => {
    if (meshRef.current && !active) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => setActive(!active)}
          scale={active ? 1.5 : 1}
        >
          <boxGeometry args={[1, 1, 1]} />
          <MeshWobbleMaterial factor={0.4} speed={2} color={hovered ? '#00D2FF' : color} />
        </mesh>
        
        {hovered && (
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        )}

        {active && (
          <Text
            position={[0, -1.5, 0]}
            fontSize={0.15}
            color="#9D4EDD"
            maxWidth={2}
            textAlign="center"
          >
            {tip}
          </Text>
        )}
      </group>
    </Float>
  );
};

export const StudySpace = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        
        <StudyObject 
          position={[-4, 2, 0]} 
          color="#9D4EDD" 
          icon="book" 
          label="Unit Notes" 
          tip="AI extracts key formulas from your PDFs automatically."
        />
        <StudyObject 
          position={[4, -2, 0]} 
          color="#00D2FF" 
          icon="target" 
          label="PYQ Analysis" 
          tip="Questions from 2024 are weighted higher in your plan."
        />
        <StudyObject 
          position={[0, 3, -2]} 
          color="#FFB703" 
          icon="star" 
          label="Smart Rank" 
          tip="Focus on Bayesian Networks—it's a 15-mark staple."
        />
        <StudyObject 
          position={[-3, -3, 2]} 
          color="#FB8500" 
          icon="video" 
          label="Tamil Help" 
          tip="Click any topic to see handpicked Tamil tutorials."
        />

        <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};
