import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export const CameraDirectionalLight = () => {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (lightRef.current) {
      // Place la lumière à une certaine distance devant la caméra
      const offset = new THREE.Vector3(3, -3, -5); // 5 unités devant la caméra
      const lightPosition = camera.localToWorld(offset.clone());
      lightRef.current.position.copy(lightPosition);

      // Oriente la lumière dans la même direction que la caméra
      const targetPosition = camera.localToWorld(new THREE.Vector3(0, 0, -10));
      lightRef.current.target.position.copy(targetPosition);
      lightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <directionalLight
        ref={lightRef}
        intensity={5}
        color="white"
        castShadow
      />
      {/* Le target doit être dans la scène */}
      {lightRef.current && (
        <primitive object={lightRef.current.target as THREE.Object3D} />
      )}
    </>
  );
};