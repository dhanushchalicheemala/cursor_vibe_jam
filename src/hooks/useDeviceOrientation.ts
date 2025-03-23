import { useState, useEffect } from 'react'

interface DeviceOrientationData {
  alpha: number | null; // rotation around z-axis (0-360)
  beta: number | null;  // rotation around x-axis (-180-180)
  gamma: number | null; // rotation around y-axis (-90-90)
  absolute: boolean;
  isSupported: boolean;
}

export default function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<DeviceOrientationData>({
    alpha: null,
    beta: null,
    gamma: null,
    absolute: false,
    isSupported: false
  })

  useEffect(() => {
    // Check if device orientation is supported
    const isDeviceOrientationSupported = 'DeviceOrientationEvent' in window;
    
    setOrientation(prev => ({
      ...prev,
      isSupported: isDeviceOrientationSupported
    }))
    
    if (!isDeviceOrientationSupported) return;

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
        absolute: event.absolute,
        isSupported: true
      })
    }

    window.addEventListener('deviceorientation', handleDeviceOrientation, true)

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
    }
  }, [])

  // Convert orientation data to camera rotation
  const getCameraRotation = () => {
    if (!orientation.isSupported || orientation.beta === null || orientation.gamma === null) {
      return { x: 0, y: 0 }
    }

    // Limit the range of movement
    const betaConstrained = Math.max(-45, Math.min(45, orientation.beta)) / 45
    const gammaConstrained = Math.max(-45, Math.min(45, orientation.gamma)) / 45

    return {
      x: betaConstrained,  // Up/down rotation
      y: gammaConstrained  // Left/right rotation
    }
  }

  return {
    ...orientation,
    getCameraRotation
  }
} 