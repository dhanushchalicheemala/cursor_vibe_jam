import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

interface CountdownTimerProps {
  position: [number, number, number];
  targetDate: string;
}

export function CountdownTimer({ position, targetDate }: CountdownTimerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  
  // Calculate time remaining to target date
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }
    
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    
    return () => clearInterval(timer)
  }, [targetDate])
  
  // Animation loop
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating motion
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2
      
      // Gentle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })
  
  // Format time with leading zeros
  const formatTime = (value: number) => {
    return value < 10 ? `0${value}` : value.toString()
  }
  
  return (
    <group ref={groupRef} position={position}>
      {/* Title */}
      <Text
        position={[0, 1, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#ff33cc"
      >
        COUNTDOWN
      </Text>
      
      {/* Timer display */}
      <Text
        position={[0, 0.4, 0]}
        fontSize={0.8}
        font="/fonts/inter-bold.woff"
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
        outlineWidth={0.02}
        outlineColor="#6633cc"
      >
        {`${formatTime(timeLeft.days)}:${formatTime(timeLeft.hours)}:${formatTime(timeLeft.minutes)}:${formatTime(timeLeft.seconds)}`}
      </Text>
      
      {/* Labels */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        DAYS : HOURS : MINS : SECS
      </Text>
      
      {/* Deadline */}
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.25}
        color="#ff33cc"
        anchorX="center"
        anchorY="middle"
      >
        {targetDate}
      </Text>
      
      {/* Decorative ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.6, 32]} />
        <meshStandardMaterial 
          color="#6633cc"
          emissive="#6633cc"
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
} 