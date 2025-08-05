import * as THREE from "three";
import type { Boid, BoidsSettings } from "./BoidsParticules.d";

// ✨ NOUVELLE APPROCHE : Mouvement naturel avec personnalité
export const applyNaturalForces = (
  boid: Boid,
  neighbors: Boid[],
  settings: BoidsSettings,
): void => {
  boid.acceleration.set(0, 0, 0);

  // 🎲 1. WANDER - Mouvement de base aléatoire (plus important que le flocking!)
  boid.personality.wanderAngle += (Math.random() - 0.5) * 0.3;
  const wanderDirection = new THREE.Vector3(
    Math.cos(boid.personality.wanderAngle),
    Math.sin(boid.personality.wanderAngle * 0.7),
    Math.sin(boid.personality.wanderAngle * 0.3),
  ).normalize();

  const wanderForce = wanderDirection.multiplyScalar(
    settings.wanderForce * boid.personality.independence,
  );

  boid.acceleration.add(wanderForce);

  // 🚫 2. SÉPARATION SIMPLE - Seulement avec voisins très proches
  const tooClose = neighbors.filter(
    (n) =>
      boid.position.distanceTo(n.position) < boid.personality.socialDistance,
  );

  if (tooClose.length > 0) {
    const separation = new THREE.Vector3();
    tooClose.forEach((neighbor) => {
      const diff = new THREE.Vector3()
        .subVectors(boid.position, neighbor.position)
        .normalize();
      separation.add(diff);
    });

    separation.divideScalar(tooClose.length);
    separation.multiplyScalar(settings.separationForce);
    boid.acceleration.add(separation);
  }

  // ➡️ 3. ALIGNEMENT DOUX - Seulement si pas trop indépendant
  if (boid.personality.independence < 0.8 && neighbors.length > 0) {
    const avgVelocity = new THREE.Vector3();
    neighbors.slice(0, 3).forEach((n) => {
      // Max 3 voisins pour l'alignement
      avgVelocity.add(n.velocity);
    });

    avgVelocity.divideScalar(Math.min(neighbors.length, 3));
    const alignment = avgVelocity
      .sub(boid.velocity)
      .multiplyScalar(
        settings.alignmentForce * (1 - boid.personality.independence),
      );

    boid.acceleration.add(alignment);
  }

  // 🎯 4. COHÉSION TRÈS FAIBLE - Juste pour éviter l'isolement total
  if (neighbors.length > 0 && Math.random() < 0.1) {
    // Seulement 10% du temps
    const center = new THREE.Vector3();
    neighbors.slice(0, 2).forEach((n) => center.add(n.position)); // Max 2 voisins
    center.divideScalar(Math.min(neighbors.length, 2));

    const cohesion = center
      .sub(boid.position)
      .normalize()
      .multiplyScalar(settings.cohesionForce * 0.5);

    boid.acceleration.add(cohesion);
  }

  // 🏃 5. VITESSE PERSONNALISÉE
  boid.velocity.add(boid.acceleration);

  // Maintenir la vitesse préférée
  const currentSpeed = boid.velocity.length();
  const preferredSpeed = boid.personality.speed;

  if (currentSpeed > 0) {
    const speedAdjustment = (preferredSpeed - currentSpeed) * 0.1;
    boid.velocity.multiplyScalar(1 + speedAdjustment / currentSpeed);
  }

  // Limites globales
  if (boid.velocity.length() > settings.maxSpeed) {
    boid.velocity.normalize().multiplyScalar(settings.maxSpeed);
  }
  if (boid.velocity.length() < 0.2) {
    boid.velocity.normalize().multiplyScalar(0.2);
  }
};
