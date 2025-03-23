import { useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'

interface JudgeAvatarProps {
  position: THREE.Vector3;
  name: string;
  description: string;
}

export function JudgeAvatar({ position, name, description }: JudgeAvatarProps) {
  const groupRef = useRef<THREE.Group>(null)
  const avatarRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  
  // Handle hover state
  const handleHover = (hovering: boolean) => {
    setHovered(hovering)
    document.body.style.cursor = hovering ? 'pointer' : 'auto'
  }
  
  // Handle click to show/hide info
  const handleClick = () => {
    setShowInfo(!showInfo)
  }
  
  // Animation loop
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating motion
      groupRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime) * 0.1
    }
    
    if (avatarRef.current) {
      // Gentle rotation
      avatarRef.current.rotation.y += 0.01
      
      // Scale on hover
      const scale = hovered ? 1.1 : 1
      avatarRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
      
      // Update material on hover
      if (avatarRef.current.material instanceof THREE.MeshStandardMaterial) {
        avatarRef.current.material.emissiveIntensity = hovered ? 0.5 : 0.2
      }
    }
  })
  
  // Get avatar color based on name
  const getColor = () => {
    switch (name.split(' ')[0].toLowerCase()) {
      case 'andrej':
        return '#6633cc'
      case 'tim':
        return '#ff33cc'
      case 'mr.':
        return '#33ccff'
      case 's13k':
        return '#33ff66'
      case 'levelsio':
        return '#ffcc33'
      default:
        return '#6633cc'
    }
  }
  
  return (
    <group 
      ref={groupRef} 
      position={[position.x, position.y, position.z]}
      onPointerOver={() => handleHover(true)}
      onPointerOut={() => handleHover(false)}
      onClick={handleClick}
    >
      {/* Judge avatar representation */}
      <mesh 
        ref={avatarRef}
        castShadow
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={getColor()}
          metalness={0.8}
          roughness={0.2}
          emissive={getColor()}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Name label */}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor={getColor()}
      >
        {name.split(' ')[0]}
      </Text>
      
      {/* Decorative elements */}
      <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial 
          color={getColor()}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Information popup */}
      {showInfo && (
        <Html
          position={[1, 0, 0]}
          className="pointer-events-none"
          style={{
            width: '200px',
            transform: 'translateX(0) translateY(-50%)'
          }}
          distanceFactor={15}
        >
          <div className="bg-background/90 backdrop-blur-lg p-4 rounded-xl border border-primary/30">
            <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
            <p className="text-sm text-white/80">{description}</p>
          </div>
        </Html>
      )}
      
      {/* Halo effect when hovered */}
      {hovered && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.7, 32]} />
          <meshBasicMaterial 
            color={getColor()}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
} 