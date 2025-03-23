import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { gsap } from 'gsap'
import { CentralHub } from './CentralHub'
import { FloatingIsland } from './FloatingIsland'
import { Particles } from './Particles'
import { PortalEffect } from './PortalEffect'
import { JudgeAvatar } from './JudgeAvatar'
import { CountdownTimer } from './CountdownTimer'

// Define camera positions for navigation
const cameraPositions = {
  welcome: { position: new THREE.Vector3(0, 5, 10), target: new THREE.Vector3(0, 0, 0) },
  about: { position: new THREE.Vector3(-8, 3, 5), target: new THREE.Vector3(-8, 0, 0) },
  judges: { position: new THREE.Vector3(10, 4, 5), target: new THREE.Vector3(10, 0, 0) },
  sponsors: { position: new THREE.Vector3(0, 3, -12), target: new THREE.Vector3(0, 0, -10) },
  submission: { position: new THREE.Vector3(15, 5, 8), target: new THREE.Vector3(15, 0, 0) }
}

// Define judges data
const judgesData = [
  { 
    id: 'andrej', 
    name: 'Andrej Karpathy', 
    position: new THREE.Vector3(8, 1, 2),
    description: 'AI researcher and former Tesla AI Director'
  },
  { 
    id: 'tim', 
    name: 'Tim Soret', 
    position: new THREE.Vector3(10, 1, 0),
    description: 'Game developer and creator of The Last Night' 
  },
  { 
    id: 'mrdoob', 
    name: 'Mr. Doob (Ricardo Cabello)', 
    position: new THREE.Vector3(12, 1, 2),
    description: 'Creator of Three.js' 
  },
  { 
    id: 's13k', 
    name: 's13k', 
    position: new THREE.Vector3(10, 1, 4),
    description: 'Renowned game developer and programmer' 
  },
  { 
    id: 'levelsio', 
    name: 'levelsio (Pieter Levels)', 
    position: new THREE.Vector3(14, 1, 1),
    description: 'Serial indie maker and founder of Nomad List' 
  }
]

interface ExperienceProps {
  currentSection: string;
  setIsLoading: (value: boolean) => void;
}

export function Experience({ currentSection, setIsLoading }: ExperienceProps) {
  const { camera, controls } = useThree()
  const groupRef = useRef<THREE.Group>(null)
  const previousSectionRef = useRef<string>('welcome')
  
  // Handle section changes and camera animations
  useEffect(() => {
    if (previousSectionRef.current === currentSection) return
    
    const targetPosition = cameraPositions[currentSection as keyof typeof cameraPositions]?.position || cameraPositions.welcome.position
    const targetLookAt = cameraPositions[currentSection as keyof typeof cameraPositions]?.target || cameraPositions.welcome.target
    
    // Animate camera movement
    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 2,
      ease: 'power2.inOut',
    })
    
    // Animate camera target
    gsap.to(controls.target, {
      x: targetLookAt.x,
      y: targetLookAt.y,
      z: targetLookAt.z,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        controls.update()
      }
    })
    
    previousSectionRef.current = currentSection
  }, [currentSection, camera, controls])
  
  // Complete the loading state after scene is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [setIsLoading])
  
  // Animation loop
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05
    }
  })
  
  return (
    <>
      {/* Scene lighting */}
      <ambientLight intensity={0.5} color="#6633cc" />
      <directionalLight 
        position={[5, 10, 7.5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize={[1024, 1024]} 
      />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#ff33cc" />
      
      {/* Background fog */}
      <fog attach="fog" args={['#110033', 10, 50]} />
      
      {/* Central hub */}
      <CentralHub position={[0, 0, 0]} />
      
      {/* Floating islands */}
      <FloatingIsland position={[-8, -1, -5]} scale={0.8} rotation={[0, Math.PI / 6, 0]} type="about" />
      <FloatingIsland position={[10, 0, -3]} scale={1.2} rotation={[0, -Math.PI / 4, 0]} type="judges" />
      <FloatingIsland position={[0, -2, -12]} scale={1.5} rotation={[0, Math.PI / 2, 0]} type="sponsors" />
      <FloatingIsland position={[15, 2, 8]} scale={0.7} rotation={[0, Math.PI / 5, 0]} type="submission" />
      
      {/* Judges avatars */}
      {judgesData.map((judge) => (
        <JudgeAvatar
          key={judge.id}
          position={judge.position}
          name={judge.name}
          description={judge.description}
        />
      ))}
      
      {/* Portal effects at each content area */}
      <PortalEffect position={[-8, 1, -5]} color="#4422aa" />
      <PortalEffect position={[10, 2, -3]} color="#ff33cc" />
      <PortalEffect position={[0, 0, -12]} color="#6633cc" />
      <PortalEffect position={[15, 3, 8]} color="#33ccff" />
      
      {/* Countdown timer */}
      <CountdownTimer 
        position={[0, 3, 0]} 
        targetDate="April 1, 2025" 
      />
      
      {/* Particle systems */}
      <Particles count={1000} />
      
      {/* Rotating group for ambient elements */}
      <group ref={groupRef}>
        <mesh position={[0, 8, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="#ff33cc" emissive="#ff33cc" emissiveIntensity={2} />
        </mesh>
      </group>
    </>
  )
} 