import * as THREE from 'three'

/**
 * Easing functions for smooth animations
 */
export const Easing = {
  // Linear interpolation
  linear: (t: number): number => t,
  
  // Quadratic easing
  easeInQuad: (t: number): number => t * t,
  easeOutQuad: (t: number): number => t * (2 - t),
  easeInOutQuad: (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  
  // Cubic easing
  easeInCubic: (t: number): number => t * t * t,
  easeOutCubic: (t: number): number => (--t) * t * t + 1,
  easeInOutCubic: (t: number): number => 
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  
  // Elastic and bounce
  easeOutElastic: (t: number): number => {
    const p = 0.3
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1
  },
  
  easeOutBounce: (t: number): number => {
    if (t < (1 / 2.75)) {
      return 7.5625 * t * t
    } else if (t < (2 / 2.75)) {
      return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75
    } else if (t < (2.5 / 2.75)) {
      return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375
    } else {
      return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375
    }
  }
}

/**
 * Interpolate between two values with easing
 */
export function lerp(
  start: number,
  end: number,
  t: number,
  easingFn = Easing.linear
): number {
  const easedT = easingFn(Math.max(0, Math.min(1, t)))
  return start + (end - start) * easedT
}

/**
 * Interpolate between two Vector3s with easing
 */
export function lerpVector3(
  start: THREE.Vector3,
  end: THREE.Vector3,
  t: number,
  easingFn = Easing.linear
): THREE.Vector3 {
  const easedT = easingFn(Math.max(0, Math.min(1, t)))
  return new THREE.Vector3(
    start.x + (end.x - start.x) * easedT,
    start.y + (end.y - start.y) * easedT,
    start.z + (end.z - start.z) * easedT
  )
}

/**
 * Interpolate between two colors with easing
 */
export function lerpColor(
  startColor: THREE.Color,
  endColor: THREE.Color,
  t: number,
  easingFn = Easing.linear
): THREE.Color {
  const easedT = easingFn(Math.max(0, Math.min(1, t)))
  return new THREE.Color(
    startColor.r + (endColor.r - startColor.r) * easedT,
    startColor.g + (endColor.g - startColor.g) * easedT,
    startColor.b + (endColor.b - startColor.b) * easedT
  )
}

/**
 * Generate a sequence of key points for a path
 */
export function generatePath(
  centerPoint: THREE.Vector3,
  radius: number,
  numPoints: number,
  heightVariation = 0.5,
  randomness = 0.2
): THREE.Vector3[] {
  const points: THREE.Vector3[] = []
  
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2
    
    // Base point on circle
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    
    // Add height variation
    const y = Math.sin(angle * 2) * heightVariation
    
    // Add some randomness
    const randX = (Math.random() - 0.5) * randomness
    const randY = (Math.random() - 0.5) * randomness
    const randZ = (Math.random() - 0.5) * randomness
    
    points.push(new THREE.Vector3(
      centerPoint.x + x + randX,
      centerPoint.y + y + randY,
      centerPoint.z + z + randZ
    ))
  }
  
  // Close the loop
  points.push(points[0].clone())
  
  return points
} 