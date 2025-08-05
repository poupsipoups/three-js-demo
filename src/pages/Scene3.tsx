import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

function BlenderModel() {
  const { scene } = useGLTF('/models/weird_man.glb');
  console.log('Modèle chargé:', scene);
  console.log('Enfants du modèle:', scene.children);
  console.log('Position du modèle:', scene.position);
  console.log('Scale du modèle:', scene.scale);

  // Enable shadows on all children recursively
  React.useEffect(() => {
    const enableShadows = (object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
      object.children.forEach(enableShadows);
    };
    enableShadows(scene);
  }, [scene]);

  return (
    <primitive
      object={scene}
      scale={2}
      position={[0, -1, 0]}
      castShadow
    />
  );
}

function Loader() {
  return (
    <Center>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </Center>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#846565" />
    </mesh>
  );
}

const Scene3 = () => {
  return (
    <Canvas
      shadows
      camera={{
        position: [3, 1.5, 3],
        fov: 60,
        near: 0.1,
        far: 1000
      }}
      style={{
        position: 'fixed',
        zIndex: 10,
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(165deg,rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 73%)'
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[-10, 10, 10]}
        intensity={5}
        color="white"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-3, 3, -3]} intensity={100} />

      {/* <Environment preset="studio" /> */}

      <Floor />

      <Center>
        <Suspense fallback={<Loader />}>
          <BlenderModel />
        </Suspense>
      </Center>

      <OrbitControls
        autoRotate
        autoRotateSpeed={1}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={8}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
};

export default Scene3;
