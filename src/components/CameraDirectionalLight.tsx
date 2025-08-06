import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export const CameraDirectionalLight = () => {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (lightRef.current) {
      // place light
      const offset = new THREE.Vector3(3, -3, -5); 
      //lines so the light position is always at the same place relatively to the camera
      const lightPosition = camera.localToWorld(offset.clone()); // local to world place camera as center of the relative position
      lightRef.current.position.copy(lightPosition);

      // orient light in the same direction as the camera => follows the camera pov
      const targetPosition = camera.localToWorld(new THREE.Vector3(0, 0, -10)); //points forward of the camera
      lightRef.current.target.position.copy(targetPosition); //target of the light
      lightRef.current.target.updateMatrixWorld(); // as we chnaged the position manually we have to apply this to our actual context
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
      {/* target must be in the scene */}
      {/* target is the point the light is pointing at, we need it so three js can calculate the light direction + the shadows */}
      {lightRef.current && (
        <primitive object={lightRef.current.target as THREE.Object3D} />
      )}
    </>
  );
};