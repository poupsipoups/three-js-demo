import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export const CameraPointLight = () => {
  const lightRef = useRef<THREE.PointLight>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (lightRef.current && sphereRef.current) {
      // Place la lumière à une certaine distance devant la caméra
      const offset = new THREE.Vector3(-1, 1, -1); // 2 unités devant la caméra
      const lightPosition = camera.localToWorld(offset.clone());
      lightRef.current.position.copy(lightPosition);

      sphereRef.current.position.copy(lightRef.current.position);
    }
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        intensity={500}
        color="blue"
        distance={100} // optionnel : portée de la lumière
        decay={2}     // optionnel : atténuation
        castShadow
      />
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </>
  );
};