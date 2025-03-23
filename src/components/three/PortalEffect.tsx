import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface PortalEffectProps {
  position: [number, number, number];
  color: string;
}

export function PortalEffect({ position, color }: PortalEffectProps) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  
  // Animation loop
  useFrame((state, delta) => {
    const { clock } = state
    const time = clock.elapsedTime
    
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y = time * 0.5
    }
    
    if (ringRef.current) {
      // Pulsating ring
      ringRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1)
      
      // Update ring material
      if (ringRef.current.material instanceof THREE.ShaderMaterial) {
        ringRef.current.material.uniforms.time.value = time
      }
    }
    
    if (particlesRef.current) {
      // Update particle positions
      const positions = particlesRef.current.geometry.attributes.position
      const count = positions.count
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        
        // Get base position
        const x = positions.getX(i)
        const y = positions.getY(i)
        const z = positions.getZ(i)
        
        // Calculate new position with spiral motion
        const angle = time * 0.5 + i * 0.01
        const radius = 0.2 + i * 0.001
        
        positions.setXYZ(
          i,
          x + Math.cos(angle) * radius * 0.1,
          y + Math.sin(time + i * 0.1) * 0.01,
          z + Math.sin(angle) * radius * 0.1
        )
      }
      
      positions.needsUpdate = true
    }
  })
  
  // Custom shader for portal ring
  const ringShader = {
    uniforms: {
      color: { value: new THREE.Color(color) },
      time: { value: 0 }
    },
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        
        // Add subtle vertex displacement
        vec3 pos = position;
        pos.x += sin(time * 2.0 + position.z * 5.0) * 0.02;
        pos.y += cos(time * 2.0 + position.x * 5.0) * 0.02;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float time;
      varying vec2 vUv;
      
      void main() {
        // Calculate distance from center
        float dist = length(vUv - vec2(0.5));
        
        // Create ring effect
        float ring = smoothstep(0.4, 0.5, dist) * smoothstep(0.5, 0.4, dist);
        
        // Add time-based pulsation
        ring *= 0.5 + 0.5 * sin(time * 3.0 + dist * 10.0);
        
        // Set color with opacity based on ring
        gl_FragColor = vec4(color, ring);
      }
    `
  }
  
  // Generate particles for the portal
  const particleCount = 100
  const particlePositions = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    const angle = (i / particleCount) * Math.PI * 2
    const radius = 0.5 + Math.random() * 0.5
    
    particlePositions[i3] = Math.cos(angle) * radius
    particlePositions[i3 + 1] = (Math.random() - 0.5) * 0.5
    particlePositions[i3 + 2] = Math.sin(angle) * radius
  }
  
  return (
    <group position={position}>
      {/* Main portal ring */}
      <mesh 
        ref={ringRef}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[1, 0.1, 16, 32]} />
        <shaderMaterial
          uniforms={ringShader.uniforms}
          vertexShader={ringShader.vertexShader}
          fragmentShader={ringShader.fragmentShader}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner group with particles */}
      <group ref={groupRef}>
        {/* Portal particles */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute 
              attach="attributes-position"
              args={[particlePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.05}
            color={color}
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </points>
        
        {/* Center glow */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.5, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  )
} 