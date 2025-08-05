import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { BoidsParticles } from '../components/BoidsParticules/BoidsParticles'
import { useBoidsSettings } from '../components/BoidsParticules/BoidsParticules.hooks'
import { BoidsControls } from '../components/BoidsParticules/components/BoidsControls/BoidsControls'


const Scene2 = () => {
  const { settings, updateSetting } = useBoidsSettings()
  return (
    <>
    <Canvas style={{ 
      position: 'fixed', 
      zIndex: 10, 
      top: 0, 
      left: 0, 
      height: '100vh', 
      width: '100vw', 
      background: 'black' 
    }}>
        <BoidsParticles settings={settings} />
        
        {/* Visualiser la zone plus grande */}
        <mesh>
          <boxGeometry args={[8, 8, 8]} />
          <meshBasicMaterial color="white" wireframe opacity={0.1} transparent />
        </mesh>
        
        {/* Zone de safety pour particules */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[10, 6, 10]} />
          <meshBasicMaterial color="green" wireframe opacity={0.2} transparent />
        </mesh>
        
        {/* Zone très conservative */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[6, 4, 6]} />
          <meshBasicMaterial color="blue" wireframe opacity={0.1} transparent />
        </mesh>
        
        {/* Zone d'évitement (70% du boundary) */}
        <mesh>
          <boxGeometry args={[5.6, 5.6, 5.6]} />
          <meshBasicMaterial color="yellow" wireframe opacity={0.15} transparent />
        </mesh>
        
        {/* Boundary absolue */}
        <mesh>
          <boxGeometry args={[8, 8, 8]} />
          <meshBasicMaterial color="red" wireframe opacity={0.1} transparent />
        </mesh>
      <OrbitControls />

    </Canvas>
      <BoidsControls settings={settings} onSettingChange={updateSetting} /> 
      </>
  )
}

export default Scene2
