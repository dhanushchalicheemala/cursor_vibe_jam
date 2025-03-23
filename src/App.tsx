import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Preload } from '@react-three/drei'
import { Experience } from './components/three/Experience'
import UI from './components/UI'
import LoadingScreen from './components/LoadingScreen'
import useDeviceOrientation from './hooks/useDeviceOrientation'
import './App.css'

// Camera Controller component that uses device orientation on mobile
const CameraController = () => {
  const { camera } = useThree()
  const { isSupported, getCameraRotation } = useDeviceOrientation()
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  
  useEffect(() => {
    if (!isSupported || !isMobile) return
    
    // Apply device orientation to camera on mobile
    const handleOrientation = () => {
      const { x, y } = getCameraRotation()
      
      // Apply subtle rotation based on device orientation
      camera.rotation.x += (x * 0.1 - camera.rotation.x) * 0.05
      camera.rotation.y += (y * 0.1 - camera.rotation.y) * 0.05
    }
    
    const interval = setInterval(handleOrientation, 16)
    
    return () => {
      clearInterval(interval)
    }
  }, [camera, isSupported, isMobile, getCameraRotation])
  
  return null
}

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentSection, setCurrentSection] = useState('welcome')
  const canvasRef = useRef(null)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  
  // Fullscreen handler
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  return (
    <div className="w-full h-screen bg-background">
      {isLoading && <LoadingScreen />}
      
      <UI 
        currentSection={currentSection} 
        setCurrentSection={setCurrentSection} 
      />
      
      {/* Fullscreen button for mobile */}
      {isMobile && !isLoading && (
        <button 
          onClick={handleFullscreen}
          className="fixed top-4 left-4 z-20 p-2 bg-primary/20 backdrop-blur-md rounded-full"
          aria-label="Toggle fullscreen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
            <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
            <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
            <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
          </svg>
        </button>
      )}
      
      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [0, 5, 10], fov: 75 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: 'high-performance'
        }}
      >
        <Suspense fallback={null}>
          <Experience 
            currentSection={currentSection}
            setIsLoading={setIsLoading}
          />
          <CameraController />
        </Suspense>
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          dampingFactor={0.05}
          rotateSpeed={0.5}
        />
        <Preload all />
      </Canvas>
    </div>
  )
}

export default App
