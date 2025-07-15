import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CameraDirectionalLight } from '../components/CameraDirectionalLight';
import { CameraPointLight } from '../components/CameraPointLight';
import { Box } from '../components/Box';


const Scene1 = () => {
  return (
    <Canvas shadows style={{ position: 'fixed', zIndex: 10, top: 0, left: 0, height: '100vh', width: '100vw', background: 'linear-gradient(165deg,rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 73%)' }}>
      <CameraDirectionalLight />
      <CameraPointLight />
      <Box />
      <OrbitControls autoRotate autoRotateSpeed={2} />
    </Canvas>
  );
}

export default Scene1;
