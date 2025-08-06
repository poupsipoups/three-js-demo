import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Box = () => {

  const meshRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material[]>>(null);

  // Animation of the colors of the cube faces
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.forEach((mat, i) => {
        (mat as THREE.MeshStandardMaterial).color.setHSL((clock.getElapsedTime() * 0.1 + i * 0.15) % 1, 0.7, 0.5);
      });
    }
  });

  // Colors for each face of the cube (6 faces)
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