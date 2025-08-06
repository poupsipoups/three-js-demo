import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export const CameraPointLight = () => {
  const lightRef = useRef<THREE.PointLight>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (lightRef.current && sphereRef.current) {
      // place light
      const offset = new THREE.Vector3(-1, 1, -1);
      const lightPosition = camera.localToWorld(offset.clone()); // local to world place camera as center of the relative position
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
        distance={100} // optional: range of the light
        decay={2}     // optional: attenuation
        castShadow
      />
      {/* sphere is a visual representation of the light */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </>
  );
};