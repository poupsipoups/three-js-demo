import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';


const CameraDirectionalLight = () => {
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

const CameraPointLight = () => {
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

const CameraSphere = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.position.copy(camera.position);
    }
  });

  return (
    <mesh ref={sphereRef} position={[3, 3, 3]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

const Box = () => {

  const meshRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material[]>>(null);

  // Animation des couleurs des faces du cube
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.forEach((mat, i) => {
        (mat as THREE.MeshStandardMaterial).color.setHSL((clock.getElapsedTime() * 0.1 + i * 0.15) % 1, 0.7, 0.5);
      });
    }
  });

  // Couleurs pour chaque face du cube (6 faces)
  // const materials = [
  //   new THREE.MeshStandardMaterial({ color: '#EC5864' }), // rouge vif
  //   new THREE.MeshStandardMaterial({ color: '#606EEF' }), // bleu foncé
  //   new THREE.MeshStandardMaterial({ color: '#A35CBF' }), // violet profond
  //   new THREE.MeshStandardMaterial({ color: '#12D19E' }), // vert émeraude
  //   new THREE.MeshStandardMaterial({ color: '#ffd166' }), // jaune doré
  //   new THREE.MeshStandardMaterial({ color: '#ff6700' }), // orange vif
  // ];

  const materials = [
    new THREE.MeshStandardMaterial({ color: '#F5F5F5' }), // blanc
    new THREE.MeshStandardMaterial({ color: '#F5F5F5' }), // blanc
    new THREE.MeshStandardMaterial({ color: '#F5F5F5' }), // blanc
    new THREE.MeshStandardMaterial({ color: '#F5F5F5' }), // blanc
    new THREE.MeshStandardMaterial({ color: '#F5F5F5' }), // blanc
    new THREE.MeshStandardMaterial({ color: '#F5F5F5' }), // blanc
  ];


  return (
    <mesh rotation={[0.4, 0.2, 0]} material={materials} castShadow receiveShadow>
      <boxGeometry args={[2, 2, 2]} />
    </mesh>
  );
}

const Scene1 = () => {
  return (
    <Canvas shadows style={{ height: '100vh', width: '100vw', background: 'linear-gradient(165deg,rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 73%)' }}>
      <CameraDirectionalLight />
      <CameraPointLight />
      <CameraSphere />
      <Box />
      <OrbitControls autoRotate autoRotateSpeed={2} />
    </Canvas>
  );
}

export default Scene1;
