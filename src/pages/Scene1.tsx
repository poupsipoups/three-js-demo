import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Box() {
  // Couleurs pour chaque face du cube (6 faces)
  const materials = [
    new THREE.MeshStandardMaterial({ color: 'red' }),
    new THREE.MeshStandardMaterial({ color: 'green' }),
    new THREE.MeshStandardMaterial({ color: 'blue' }),
    new THREE.MeshStandardMaterial({ color: 'yellow' }),
    new THREE.MeshStandardMaterial({ color: 'orange' }),
    new THREE.MeshStandardMaterial({ color: 'purple' }),
  ];

  return (
    <mesh rotation={[0.4, 0.2, 0]} material={materials}>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
}

const Scene1 = () => {
  return (
    <Canvas style={{ height: '100vh', width: '100vw', background: '#111' }}>
      <ambientLight />
      <pointLight position={[5, 5, 5]} />
      <Box />
      <OrbitControls />
    </Canvas>
  );
}

export default Scene1;
