import { useCircleTexture } from "../hooks/useCircleTexture"
import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export const BasicParticles = () => {
  // create the positions of the particles
  const particleCount = 1000
  const positionsRef = useRef<THREE.BufferAttribute>(null)
  const circleTexture = useCircleTexture()
  const initialPositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3) // x, y, z for each particle
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10     // x between -5 and 5
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10 // y between -5 and 5  
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 // z between -5 and 5
    }
    
    return pos
  }, [])

  const colors = useMemo(() => {
    const cols = new Float32Array(particleCount * 3) // R, G, B for each particle
    
    for (let i = 0; i < particleCount; i++) {
      // create a gradient from blue to red based on the Y position
      const y = initialPositions[i * 3 + 1] // position Y of this particle
      const normalizedY = (y + 5) / 10 // normalize between 0 and 1
      
      // interpolation from blue to red
      cols[i * 3] = normalizedY        // red: 0 at the bottom, 1 at the top
      cols[i * 3 + 1] = 0.3           // green: constant
      cols[i * 3 + 2] = 1 - normalizedY // blue: 1 at the bottom, 0 at the top
    }
    
    return cols
  }, [initialPositions])

  useFrame(({ clock }) => {
    if (positionsRef.current) {
      const positions = positionsRef.current.array as Float32Array
      const time = clock.getElapsedTime()
      
      for (let i = 0; i < particleCount; i++) {
        // Position Y oscillate with the time
        const x = initialPositions[i * 3]
        const y = initialPositions[i * 3 + 1]
        const z = initialPositions[i * 3 + 2]
        
        // create a wave based on X and the time
        positions[i * 3 + 1] = y + Math.sin(time + x * 0.5) * 0.5 * z
      }
      
      // IMPORTANT : tell Three.js that the positions have changed
      positionsRef.current.needsUpdate = true
    }
  })

 
  return (
    <points>
      {/* bufferGeometry is a way to store the positions and colors of the particles */}
      <bufferGeometry>
        <bufferAttribute
          ref={positionsRef}
          attach="attributes-position"
          args={[initialPositions.slice(), 3]}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          itemSize={3}
        />
      </bufferGeometry>
      {/* pointsMaterial is the material of the particles, it's the texture that will be applied to the particles */}
      <pointsMaterial 
        color="white" 
        size={0.05}
        sizeAttenuation={true}
        alphaTest={0.01}
        transparent={true}
        map={circleTexture}
        vertexColors={true}
      />
    </points>
  )
}
