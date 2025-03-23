import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * Smoothly animate the camera to a new position and target
 */
export function animateCamera(
  camera: THREE.Camera, 
  controls: any,
  targetPosition: THREE.Vector3,
  targetLookAt: THREE.Vector3,
  duration = 2.0
): Promise<void> {
  return new Promise((resolve) => {
    // Animate camera position
    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration,
      ease: 'power2.inOut',
      onComplete: resolve
    })
    
    // If we have orbit controls, animate the target
    if (controls) {
      gsap.to(controls.target, {
        x: targetLookAt.x,
        y: targetLookAt.y,
        z: targetLookAt.z,
        duration,
        ease: 'power2.inOut',
        onUpdate: () => {
          controls.update()
        }
      })
    }
    // Otherwise, point the camera directly
    else {
      const lookAtVec = new THREE.Vector3(
        targetLookAt.x,
        targetLookAt.y,
        targetLookAt.z
      )
      
      gsap.to(camera.rotation, {
        x: 0, 
        y: 0, 
        z: 0, 
        duration: duration / 2,
        onComplete: () => {
          camera.lookAt(lookAtVec)
        }
      })
    }
  })
}

/**
 * Apply device orientation to camera rotation
 */
export function applyCameraOrientation(
  camera: THREE.Camera,
  orientationX: number,
  orientationY: number,
  strength = 0.1
): void {
  // Apply subtle rotation based on device orientation
  camera.rotation.x += (orientationX * strength - camera.rotation.x) * 0.05
  camera.rotation.y += (orientationY * strength - camera.rotation.y) * 0.05
}

/**
 * Create a camera shake effect (e.g., for transitions or impacts)
 */
export function shakeCamera(
  camera: THREE.Camera,
  intensity = 0.1,
  duration = 1.0
): Promise<void> {
  return new Promise((resolve) => {
    const initialPosition = camera.position.clone()
    let elapsed = 0
    const interval = 0.01
    
    // Save the original position
    const originalX = camera.position.x
    const originalY = camera.position.y
    const originalZ = camera.position.z
    
    // Create interval for shake effect
    const shakeInterval = setInterval(() => {
      elapsed += interval
      
      if (elapsed >= duration) {
        clearInterval(shakeInterval)
        
        // Return to original position
        gsap.to(camera.position, {
          x: originalX,
          y: originalY,
          z: originalZ,
          duration: 0.2,
          ease: 'power1.out',
          onComplete: resolve
        })
        
        return
      }
      
      // Calculate remaining shake strength based on time elapsed
      const remaining = 1 - (elapsed / duration)
      const power = intensity * remaining
      
      // Apply random offset
      camera.position.x = originalX + (Math.random() - 0.5) * power
      camera.position.y = originalY + (Math.random() - 0.5) * power
      camera.position.z = originalZ + (Math.random() - 0.5) * power
    }, interval * 1000)
  })
} 