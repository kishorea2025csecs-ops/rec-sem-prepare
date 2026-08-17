import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export const ProgressWheel3D = ({
  completion,
  totalTopics,
}: {
  completion: number;
  totalTopics: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const progressPercent = totalTopics > 0 ? completion / totalTopics : 0;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        {/* Outer Glow Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.2, 0.02, 16, 100]} />
          <meshBasicMaterial color="#00D2FF" transparent opacity={0.3} />
        </mesh>

        {/* Base Glass Torus */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2, 0.3, 20, 100]} />
          <meshPhysicalMaterial
            color="#00D2FF"
            transmission={0.7}
            thickness={1.5}
            roughness={0.1}
            metalness={0.1}
            ior={1.5}
            clearcoat={1}
            emissive="#00D2FF"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Active Progress Segment */}
        {progressPercent > 0 && (
          <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2, 0.35, 20, 100, Math.PI * 2 * progressPercent]} />
            <MeshDistortMaterial
              color="#FF0080"
              speed={2}
              distort={0.3}
              radius={1}
              emissive="#FF0080"
              emissiveIntensity={0.5}
            />
          </mesh>
        )}

        {/* Center Text */}
        <Text
          position={[0, 0, 0.5]}
          fontSize={0.9}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
          textAlign="center"
        >
          {`${Math.round(progressPercent * 100)}%`}
        </Text>

        {/* Subtle Inner Sphere */}
        <mesh>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshPhysicalMaterial
            color="#7928CA"
            transparent
            opacity={0.1}
            transmission={0.9}
            thickness={2}
          />
        </mesh>
      </Float>
    </group>
  );
};
