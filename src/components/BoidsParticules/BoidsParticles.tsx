import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useCircleTexture } from "../../hooks/useCircleTexture"
import type { Boid, BoidsSettings } from "./BoidsParticules.d"

// 🐦 Algorithme de boids classique et simple
const updateBoid = (boid: Boid, neighbors: Boid[], settings: BoidsSettings) => {
  const forces = {
    separation: new THREE.Vector3(),
    alignment: new THREE.Vector3(),
    cohesion: new THREE.Vector3()
  }

  let separationCount = 0
  let alignmentCount = 0
  let cohesionCount = 0

  // Parcourir les voisins une seule fois
  neighbors.forEach(neighbor => {
    const distance = boid.position.distanceTo(neighbor.position)
    
    // SÉPARATION - voisins trop proches
    if (distance < 1.0 && distance > 0) {
      const diff = new THREE.Vector3()
        .subVectors(boid.position, neighbor.position)
        .normalize()
        .divideScalar(distance) // Plus proche = plus fort
      forces.separation.add(diff)
      separationCount++
    }
    
    // ALIGNEMENT - voisins moyennement proches  
    if (distance < 2.0 && distance > 0) {
      forces.alignment.add(neighbor.velocity)
      alignmentCount++
    }
    
    // COHÉSION - voisins dans la zone sociale
    if (distance < 2.5 && distance > 0) {
      forces.cohesion.add(neighbor.position)
      cohesionCount++
    }
  })

  // IMPORTANT : Réinitialiser l'accélération
  boid.acceleration.set(0, 0, 0)

  // Appliquer les forces avec des facteurs encore plus petits !
  if (separationCount > 0) {
    forces.separation.divideScalar(separationCount)
    forces.separation.normalize()
    forces.separation.multiplyScalar(settings.separationForce * 0.02) // ← 0.02 au lieu de 0.1 !
    boid.acceleration.add(forces.separation)
  }

  if (alignmentCount > 0) {
    forces.alignment.divideScalar(alignmentCount)
    forces.alignment.normalize()
    forces.alignment.multiplyScalar(settings.alignmentForce * 0.02) // ← 0.02 !
    boid.acceleration.add(forces.alignment)
  }

  if (cohesionCount > 0) {
    forces.cohesion.divideScalar(cohesionCount)
    forces.cohesion.sub(boid.position)
    forces.cohesion.normalize()
    forces.cohesion.multiplyScalar(settings.cohesionForce * 0.02) // ← 0.02 !
    boid.acceleration.add(forces.cohesion)
  }

  // Force aléatoire encore plus subtile
  const wander = new THREE.Vector3(
    (Math.random() - 0.5) * 0.001, // ← Plus petit !
    (Math.random() - 0.5) * 0.001,
    (Math.random() - 0.5) * 0.001
  )
  boid.acceleration.add(wander)
}

// Nouvelle fonction : Évitement des boundaries
const avoidBoundaries = (boid: Boid, boundarySize: number, avoidanceStrength: number): THREE.Vector3 => {
  const avoidanceForce = new THREE.Vector3()
  const margin = boundarySize * 0.7 // Zone d'évitement à 70% du boundary
  
  // Évitement X
  if (boid.position.x > margin) {
    const strength = (boid.position.x - margin) / (boundarySize - margin)
    avoidanceForce.x = -strength * 0.05 * avoidanceStrength // ← Utiliser le paramètre
  } else if (boid.position.x < -margin) {
    const strength = (-margin - boid.position.x) / (boundarySize - margin)
    avoidanceForce.x = strength * 0.05 * avoidanceStrength
  }
  
  // Même chose pour Y et Z...
  if (boid.position.y > margin) {
    const strength = (boid.position.y - margin) / (boundarySize - margin)
    avoidanceForce.y = -strength * 0.05 * avoidanceStrength
  } else if (boid.position.y < -margin) {
    const strength = (-margin - boid.position.y) / (boundarySize - margin)
    avoidanceForce.y = strength * 0.05 * avoidanceStrength
  }
  
  if (boid.position.z > margin) {
    const strength = (boid.position.z - margin) / (boundarySize - margin)
    avoidanceForce.z = -strength * 0.05 * avoidanceStrength
  } else if (boid.position.z < -margin) {
    const strength = (-margin - boid.position.z) / (boundarySize - margin)
    avoidanceForce.z = strength * 0.05 * avoidanceStrength
  }
  
  return avoidanceForce
}


export const BoidsParticles = ({ settings }: { settings: BoidsSettings }) => {
  const particleCount = 100 // Nombre raisonnable
  const positionsRef = useRef<THREE.BufferAttribute>(null)
  const circleTexture = useCircleTexture()

  // Boids simplifiés - pas de personnalité complexe
  const boids = useMemo(() => {
    const flock: Boid[] = []
    
    for (let i = 0; i < particleCount; i++) {
      flock.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5
        ),
        acceleration: new THREE.Vector3(0, 0, 0)
      })
    }
    
    return flock
  }, [])

  const initialPositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    
    boids.forEach((boid, i) => {
      pos[i * 3] = boid.position.x
      pos[i * 3 + 1] = boid.position.y
      pos[i * 3 + 2] = boid.position.z
    })
    
    return pos
  }, [boids])

  const colors = useMemo(() => {
    const cols = new Float32Array(particleCount * 3)
    
    boids.forEach((boid, i) => {
      const speed = boid.velocity.length()
      const normalizedSpeed = Math.min(speed / 2, 1)
      
      cols[i * 3] = normalizedSpeed     // Rouge pour rapides
      cols[i * 3 + 1] = 0.5            // Vert constant
      cols[i * 3 + 2] = 1 - normalizedSpeed // Bleu pour lents
    })
    
    return cols
  }, [boids])

  useFrame(() => {
    if (positionsRef.current) {
      const positions = positionsRef.current.array as Float32Array

      boids.forEach((boid, index) => {
        // 1. Boundaries d'urgence (si l'évitement a échoué)
        const MAX_DISTANCE = 6
        if (boid.position.length() > MAX_DISTANCE) {
          boid.position.set(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
          )
          boid.velocity.set(
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1
          )
        }

        // 2. Trouver les voisins
        const neighbors = boids
          .filter(other => other !== boid)
          .map(other => ({
            boid: other,
            distance: boid.position.distanceTo(other.position)
          }))
          .filter(n => n.distance < 3.0)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 8)
          .map(n => n.boid)

        // 3. Mettre à jour le boid (forces de flocking)
        updateBoid(boid, neighbors, settings)
        
        // 4. ✨ NOUVELLE FORCE : Évitement des boundaries
        const BOUNDARY = 4
        const boundaryAvoidance = avoidBoundaries(boid, BOUNDARY, settings.boundaryAvoidance)
        boid.acceleration.add(boundaryAvoidance)
        
        // 5. Appliquer la physique
        boid.velocity.add(boid.acceleration)
        
        // 6. Limiter la vitesse
        const speed = boid.velocity.length()
        const MAX_SPEED = Math.min(settings.maxSpeed, 0.2)
        
        if (speed > MAX_SPEED) {
          boid.velocity.normalize().multiplyScalar(MAX_SPEED)
        } else if (speed < 0.01) {
          boid.velocity.normalize().multiplyScalar(0.01)
        }

        // 7. Mouvement
        boid.position.add(boid.velocity)

        // 8. Boundaries de sécurité SEULEMENT (plus de rebonds brutaux !)
        if (Math.abs(boid.position.x) > BOUNDARY) {
          boid.position.x = Math.sign(boid.position.x) * BOUNDARY
          boid.velocity.x *= 0.1 // Réduire fortement la vitesse
        }
        if (Math.abs(boid.position.y) > BOUNDARY) {
          boid.position.y = Math.sign(boid.position.y) * BOUNDARY
          boid.velocity.y *= 0.1
        }
        if (Math.abs(boid.position.z) > BOUNDARY) {
          boid.position.z = Math.sign(boid.position.z) * BOUNDARY
          boid.velocity.z *= 0.1
        }

        // 9. Mettre à jour le buffer
        positions[index * 3] = boid.position.x
        positions[index * 3 + 1] = boid.position.y
        positions[index * 3 + 2] = boid.position.z
      })

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
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
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