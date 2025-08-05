import * as THREE from "three";

export interface Boid {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
}

export interface BoidsSettings {
  separationForce: number;
  alignmentForce: number;
  cohesionForce: number;
  maxSpeed: number;
  maxForce: number;
  boundaryAvoidance: number;
}
