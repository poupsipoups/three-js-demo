# three-js-demo

Simple demos and test to learn three.js !

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

---

## 🕹️ 3D Scene with React Three Fiber – Beginner's Guide

### What is Three.js?

**Three.js** is a JavaScript library for creating 3D graphics in the browser.  
**React Three Fiber** is a React renderer for Three.js, making it much easier to build 3D scenes in React apps.

### 1. 3D Coordinates System

```
     Y (up)
     ↑
     |
     |
     |
     |
     |

     +----------------------→ X (right)
    /
   /
  /
 Z (depth, into the screen)
```

- **X**: left/right
- **Y**: up/down
- **Z**: depth (forward/backward)

### 2. What Makes a 3D Scene?

A 3D scene always has:

- **A scene** (the “world”)
- **A camera** (the point of view)
- **Lights** (to see objects)
- **3D objects** (models, cubes, spheres, etc.)

### 3. The Canvas: Your 3D “Paper”

In React Three Fiber, the `<Canvas />` component is your 3D drawing area.

```jsx
<Canvas>{/* Put your lights, objects, controls here */}</Canvas>
```

### 4. The Camera

The camera is the “eye” of the viewer.  
You place it somewhere in space, e.g. `[3, 1.5, 3]` (a bit diagonal and above).

```jsx
<Canvas camera={{ position: [3, 1.5, 3], fov: 60, near: 0.1, far: 1000 }}>
```

- **`fov`**: field of view (like a camera lens)
- **`near`/`far`**: min/max render distance

### 5. Lights

Without lights, everything would be black!

- **Ambient light**: soft light everywhere
- **Directional light**: like the sun
- **Point light**: like a bulb

```jsx
<ambientLight intensity={0.6} />
<directionalLight position={[5, 5, 5]} intensity={1.2} />
<pointLight position={[-3, 3, -3]} intensity={0.4} />
```

---

## Scenes Overview

### **Scene 1: Animated Cube with Dynamic Lighting**

- **What you see:**  
  A rotating cube with each face colored differently, animated color changes, and interactive camera controls.
- **Key elements:**
  - **Box component:** A cube whose faces change color dynamically using HSL color cycling.
  - **CameraDirectionalLight & CameraPointLight:** Lights that follow the camera, creating dynamic shadows and highlights.
  - **OrbitControls:** Lets you rotate, zoom, and pan around the cube.
  - **Canvas background:** Uses a CSS gradient for a modern look.

**Animation in Three.js:**
The animation is powered by the `useFrame` hook from React Three Fiber. This hook runs every frame (typically 60 times per second) and allows you to update object properties over time.

```jsx
// Animation des couleurs des faces du cube
useFrame(({ clock }) => {
  if (meshRef.current) {
    meshRef.current.material.forEach((mat, i) => {
      (mat as THREE.MeshStandardMaterial).color.setHSL(
        (clock.getElapsedTime() * 0.1 + i * 0.15) % 1,
        0.7,
        0.5
      );
    });
  }
});
```

**How the animation works:**

1. **`useFrame`**: This hook runs every frame, creating a smooth animation loop
2. **`clock.getElapsedTime()`**: Returns the total time elapsed since the scene started (in seconds)
3. **HSL color cycling**: Each face uses a different offset (`i * 0.15`) to create a rainbow effect
4. **Modulo operator (`% 1`)**: Ensures the color values stay between 0 and 1
5. **`setHSL(hue, saturation, lightness)`**: Updates the material color using HSL color space

**What you learn:**  
How to animate geometry using `useFrame`, cycle through colors with HSL, and make the camera interactive.

---

### **Scene 2: Interactive Particle System**

- **What you see:**  
  A 3D cloud of animated particles that move according to simple flocking rules (inspired by boids), with colored trails and boundaries.
- **Key elements:**
  - **BoidsParticles component:** Implements a particle system where each particle follows rules of separation, alignment, and cohesion, creating emergent flocking behavior. The system is fully interactive and updates every frame.
  - **Custom boundaries:** Visualized with wireframe boxes, showing the space in which particles move.
  - **OrbitControls:** Lets you explore the particle system from any angle.
  - **Canvas background:** Black, to highlight the particles.

**What you learn:**  
How to create and animate a 3D particle system, update positions every frame, and visualize boundaries in 3D.

---

### **Scene 3: Importing and Displaying a Blender Model**

- **What you see:**  
  A 3D model exported from Blender (GLB format), centered in the scene, with realistic lighting and environment reflections.
- **Key elements:**
  - **BlenderModel component:** Loads a GLB file using `useGLTF` and displays it with `<primitive />`.
  - **Center:** Ensures the model is centered in the view.
  - **Environment:** Adds realistic reflections and ambient lighting.
  - **OrbitControls:** Lets you rotate and zoom around the imported model.
  - **Canvas background:** Gradient for a modern look.

**What you learn:**  
How to import and display complex 3D models, set up realistic lighting, and use environment maps for reflections.

---

---

## 📚 Three.js Lexicon

### Core Concepts

#### **Mesh**

A complete 3D object that combines geometry (shape) and material (appearance).

```jsx
<mesh>
  <boxGeometry args={[1, 1, 1]} />
  <meshStandardMaterial color="red" />
</mesh>
```

- **Use case**: Solid 3D objects (cubes, spheres, imported models)
- **Rendering**: Full surfaces with lighting, shadows, textures
- **Performance**: Medium (depends on complexity)

#### **BufferGeometry**

Optimized way to store geometric data directly in GPU memory.

```jsx
<bufferGeometry>
  <bufferAttribute
    attach="attributes-position"
    args={[positions, 3]}
    itemSize={3}
  />
</bufferGeometry>
```

- **Use case**: High-performance geometry, particle systems
- **Benefits**: Direct GPU access, memory efficient
- **Data**: Stores positions, colors, normals as arrays

#### **Points + PointsMaterial**

Specialized rendering system for particles and point-based effects.

```jsx
<points>
  <bufferGeometry>
    <bufferAttribute attach="attributes-position" {...} />
  </bufferGeometry>
  <pointsMaterial
    size={0.05}
    color="white"
    transparent={true}
    vertexColors={true}
  />
</points>
```

- **Use case**: Particle effects, stars, rain, fire
- **Performance**: Very high (thousands of particles)
- **Rendering**: Each vertex becomes a point/sprite

#### **MeshStandardMaterial**

Physically-based material for realistic rendering with complex lighting.

```jsx
<meshStandardMaterial
  color="#ff6b6b"
  metalness={0.2}
  roughness={0.4}
  map={colorTexture}
  normalMap={normalTexture}
  emissive="#441144"
  transparent={true}
/>
```

- **Features**: PBR (Physically Based Rendering)
- **Properties**: Metalness, roughness, emission, multiple texture maps
- **Lighting**: Responds to all light types with realistic shading

### Coordinate Transformations

#### **localToWorld()**

Converts local coordinates (relative to an object) to world coordinates (global 3D space).

```jsx
const worldPosition = camera.localToWorld(localOffset.clone());
```

- **Use case**: Position objects relative to camera/other objects
- **Example**: Light that follows camera with fixed offset

#### **position.copy()**

Copies coordinates from one object to another.

```jsx
lightRef.current.position.copy(calculatedPosition);
```

#### **updateMatrixWorld()**

Forces recalculation of transformation matrices after manual position changes.

```jsx
lightRef.current.target.updateMatrixWorld();
```

### Lighting System

#### **DirectionalLight + Target**

Light that illuminates from a position toward a target, creating parallel rays.

```jsx
<directionalLight ref={lightRef} intensity={5} castShadow />;
{
  /* Target must be in scene for proper calculations */
}
<primitive object={lightRef.current?.target} />;
```

- **Direction**: From light position to target position
- **Shadows**: Requires target to be in scene
- **Use case**: Sun-like lighting, follow-camera lighting

### Separation of Concerns

**Why BufferGeometry + Material?**

- **BufferGeometry**: Defines WHERE and WHAT (positions, colors, data)
- **Material**: Defines HOW (appearance, rendering style)
- **Benefits**: Reusability, performance optimization, flexibility

**Analogy**:

- Geometry = coordinates where to draw
- Material = paint and brush how to draw

---

**This project is a playground for learning and experimenting with 3D in React. Have fun!**
