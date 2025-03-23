import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

interface CentralHubProps {
  position: [number, number, number];
}

export function CentralHub({ position }: CentralHubProps) {
  const groupRef = useRef<THREE.Group>(null)
  const platformRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>>(null)
  
  // Animation loop
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1
    }
    
    if (platformRef.current && platformRef.current.material) {
      // Pulsating effect
      platformRef.current.material.emissiveIntensity = 
        0.2 + Math.sin(state.clock.elapsedTime) * 0.1
    }
  })
  
  return (
    <group position={position}>
      {/* Main platform */}
      <mesh
        ref={platformRef}
        position={[0, -0.25, 0]}
        receiveShadow
      >
        <cylinderGeometry args={[5, 5, 0.5, 32]} />
        <meshStandardMaterial 
          color="#6633cc"
          metalness={0.8}
          roughness={0.2}
          emissive="#6633cc"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Logo/title group */}
      <group ref={groupRef} position={[0, 2, 0]}>
        {/* 3D Text */}
        <Text
          position={[0, 0, 0]}
          fontSize={1}
          color="#ffffff"
          font="/fonts/inter-bold.woff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#ff33cc"
        >
          VIBE JAM
        </Text>
        
        {/* Decorative elements */}
        <mesh position={[0, 1.5, 0]}>
          <torusGeometry args={[1, 0.2, 16, 32]} />
          <meshStandardMaterial 
            color="#ff33cc"
            metalness={0.7}
            roughness={0.2}
            emissive="#ff33cc"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
      
      {/* Decorative pillars */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2
        const x = Math.cos(angle) * 4
        const z = Math.sin(angle) * 4
        
        return (
          <mesh 
            key={i} 
            position={[x, 0.5, z]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
            <meshStandardMaterial 
              color="#4422aa"
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        )
      })}
      
      {/* Light beams from the center */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 5, 10, 16, 1, true]} />
        <meshBasicMaterial 
          color="#ff33cc"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
} 