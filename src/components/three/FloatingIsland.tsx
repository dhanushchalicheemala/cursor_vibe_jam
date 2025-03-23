import { useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text, useTexture } from '@react-three/drei'

interface FloatingIslandProps {
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  type: string;
}

export function FloatingIsland({ position, scale, rotation, type }: FloatingIslandProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  
  // Handle hover state
  const onHover = (hovering: boolean) => {
    setHovered(hovering)
    document.body.style.cursor = hovering ? 'pointer' : 'auto'
  }
  
  // Animation loop for floating motion
  useFrame((state) => {
    if (groupRef.current) {
      // Floating motion
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2
      
      // Hover effect
      if (hovered) {
        groupRef.current.scale.setScalar(scale * 1.05)
      } else {
        groupRef.current.scale.setScalar(scale)
      }
    }
  })
  
  // Get island title based on type
  const getTitle = () => {
    switch (type) {
      case 'about':
        return 'ABOUT'
      case 'judges':
        return 'JUDGES'
      case 'sponsors':
        return 'SPONSORS'
      case 'submission':
        return 'SUBMIT'
      default:
        return type.toUpperCase()
    }
  }
  
  // Get island color based on type
  const getColor = () => {
    switch (type) {
      case 'about':
        return '#4422aa'
      case 'judges':
        return '#ff33cc'
      case 'sponsors':
        return '#6633cc'
      case 'submission':
        return '#33ccff'
      default:
        return '#4422aa'
    }
  }
  
  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => onHover(true)}
      onPointerOut={() => onHover(false)}
    >
      {/* Base of the island */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[2 * scale, 1.5 * scale, 0.5 * scale, 6]} />
        <meshStandardMaterial 
          color={getColor()}
          metalness={0.6}
          roughness={0.3}
          emissive={getColor()}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>
      
      {/* Top surface */}
      <mesh position={[0, 0.3 * scale, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.8 * scale, 1.9 * scale, 0.1 * scale, 6]} />
        <meshStandardMaterial 
          color={getColor()}
          metalness={0.8}
          roughness={0.2}
          emissive={getColor()}
          emissiveIntensity={hovered ? 0.7 : 0.3}
        />
      </mesh>
      
      {/* Island title */}
      <Text
        position={[0, 0.8 * scale, 0]}
        rotation={[0, Math.PI / 6, 0]}
        fontSize={0.5 * scale}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={getColor()}
      >
        {getTitle()}
      </Text>
      
      {/* Decorative elements based on type */}
      {type === 'about' && (
        <mesh position={[0, 0.5 * scale, 0]} castShadow>
          <boxGeometry args={[0.5 * scale, 0.5 * scale, 0.5 * scale]} />
          <meshStandardMaterial 
            color="#ffffff"
            metalness={0.5}
            roughness={0.5}
            emissive="#ffffff"
            emissiveIntensity={0.2}
          />
        </mesh>
      )}
      
      {type === 'judges' && (
        <group position={[0, 0.5 * scale, 0]}>
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (i / 5) * Math.PI * 2
            const radius = 0.8 * scale
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            
            return (
              <mesh key={i} position={[x, 0, z]} castShadow>
                <sphereGeometry args={[0.2 * scale, 16, 16]} />
                <meshStandardMaterial 
                  color="#ffffff"
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
            )
          })}
        </group>
      )}
      
      {type === 'sponsors' && (
        <group position={[0, 0.5 * scale, 0]}>
          <mesh position={[-0.5 * scale, 0, 0]} castShadow>
            <boxGeometry args={[0.7 * scale, 0.3 * scale, 0.1 * scale]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.5 * scale, 0, 0]} castShadow>
            <boxGeometry args={[0.7 * scale, 0.3 * scale, 0.1 * scale]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      )}
      
      {type === 'submission' && (
        <mesh position={[0, 0.5 * scale, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[0.7 * scale, 0.7 * scale, 0.1 * scale]} />
          <meshStandardMaterial 
            color="#33ccff"
            metalness={0.9}
            roughness={0.1}
            emissive="#33ccff"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  )
} 