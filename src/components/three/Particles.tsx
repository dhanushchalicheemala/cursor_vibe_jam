import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface ParticlesProps {
  count: number;
}

export function Particles({ count = 1000 }: ParticlesProps) {
  const mesh = useRef<THREE.Points>(null)
  
  // Generate random particle positions and colors
  const particles = useMemo(() => {
    const temp = []
    const colors = []
    
    for (let i = 0; i < count; i++) {
      const radius = 25
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta) + (Math.random() * 5)
      const z = radius * Math.cos(phi)
      
      temp.push(x, y, z)
      
      // Generate colors based on position
      const r = Math.abs(x / radius) * 0.5 + 0.3
      const g = Math.abs(y / radius) * 0.3 + 0.2
      const b = Math.abs(z / radius) * 0.5 + 0.4
      
      colors.push(r, g, b)
    }
    
    return { positions: new Float32Array(temp), colors: new Float32Array(colors) }
  }, [count])
  
  // Animation loop
  useFrame((state) => {
    const { clock } = state
    
    if (mesh.current) {
      // Slow rotation
      mesh.current.rotation.x = clock.elapsedTime * 0.05
      mesh.current.rotation.y = clock.elapsedTime * 0.03
      
      // Get particles geometry
      const geometry = mesh.current.geometry
      const positions = geometry.attributes.position.array as Float32Array
      
      // Animate each particle
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        
        // Get current position
        const x = positions[i3]
        const y = positions[i3 + 1]
        const z = positions[i3 + 2]
        
        // Apply subtle movement based on sin/cos
        const time = clock.elapsedTime
        const factor = 0.1
        
        positions[i3] = x + Math.sin(time + i * 0.1) * factor
        positions[i3 + 1] = y + Math.cos(time + i * 0.1) * factor
        positions[i3 + 2] = z + Math.sin(time + i * 0.1) * factor
      }
      
      // Update the geometry
      geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute 
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.1}
        sizeAttenuation
        transparent
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
} 