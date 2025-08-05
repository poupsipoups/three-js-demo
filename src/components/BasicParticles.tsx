import { useCircleTexture } from "../hooks/useCircleTexture"
import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export const BasicParticles = () => {
  // Créer les positions des particules
  const particleCount = 1000
  const positionsRef = useRef<THREE.BufferAttribute>(null)
  const circleTexture = useCircleTexture()
  const initialPositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3) // x, y, z pour chaque particule
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10     // x entre -5 et 5
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10 // y entre -5 et 5  
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 // z entre -5 et 5
    }
    
    return pos
  }, [])

  const colors = useMemo(() => {
    const cols = new Float32Array(particleCount * 3) // R, G, B pour chaque particule
    
    for (let i = 0; i < particleCount; i++) {
      // Créer un dégradé du bleu au rouge basé sur la position Y
      const y = initialPositions[i * 3 + 1] // position Y de cette particule
      const normalizedY = (y + 5) / 10 // Normaliser entre 0 et 1
      
      // Interpolation bleu vers rouge
      cols[i * 3] = normalizedY        // Rouge : 0 en bas, 1 en haut
      cols[i * 3 + 1] = 0.3           // Vert : constant
      cols[i * 3 + 2] = 1 - normalizedY // Bleu : 1 en bas, 0 en haut
    }
    
    return cols
  }, [initialPositions])

  useFrame(({ clock }) => {
    if (positionsRef.current) {
      const positions = positionsRef.current.array as Float32Array
      const time = clock.getElapsedTime()
      
      for (let i = 0; i < particleCount; i++) {
        // Position Y ondule avec le temps
        const x = initialPositions[i * 3]
        const y = initialPositions[i * 3 + 1]
        const z = initialPositions[i * 3 + 2]
        
        // Créer une vague basée sur X et le temps
        positions[i * 3 + 1] = y + Math.sin(time + x * 0.5) * 0.5 * z
      }
      
      // IMPORTANT : Dire à Three.js que les positions ont changé
      positionsRef.current.needsUpdate = true
    }
  })

 
  return (
    <points>
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
