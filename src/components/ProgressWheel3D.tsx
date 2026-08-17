import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

export const ProgressWheel3D = ({ completion, totalTopics }: { completion: number; totalTopics: number }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const geometry = useMemo(() => {
    return new THREE.TorusGeometry(2, 0.4, 16, 100);
  }, []);

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh geometry={geometry} rotation={[Math.PI / 2, 0, 0]}>
          <meshPhysicalMaterial 
            color="#00D2FF" 
            transmission={0.5} 
            thickness={1} 
            roughness={0.2}
            emissive="#00D2FF"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Progress Segment (Visual representation) */}
        <mesh geometry={new THREE.TorusGeometry(2, 0.45, 16, 100, (Math.PI * 2) * (completion / Math.max(1, totalTopics)))} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#FF0080" />
        </mesh>

        <Text
          position={[0, 0, 0]}
          fontSize={0.8}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Montserrat-ExtraBold.ttf"
        >
          {Math.round((completion / Math.max(1, totalTopics)) * 100)}%
        </Text>
      </Float>
    </group>
  );
};
